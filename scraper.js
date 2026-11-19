const fs = require('fs');
const path = require('path');
const { getAllNotebookMatches, analyzeMatch } = require('./patterns');

const CACHE_PATH = path.join(__dirname, 'data', 'bulletin_cache.json');
const NESINE_FULL_URL = 'https://bulten.nesine.com/api/bulten/getprebultenfull';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  Referer: 'https://www.nesine.com/iddaa',
  Origin: 'https://www.nesine.com',
};

const TRACKED_FIELDS = ['ms1', 'msX', 'ms2', 'plus6', 'ust25', 'kgVar'];

function toOdd(val) {
  const num = Number(val);
  return Number.isFinite(num) && num > 1.0 ? num : null;
}

function getIstanbulDateStr(offsetDays = 0) {
  const now = new Date(Date.now() + offsetDays * 86400000);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

function utcMsToIstanbulDateStr(utcMs) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(utcMs));
}

function loadCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    }
  } catch {
    // ignore corrupt cache
  }
  return { lastSync: null, dateScope: 'all', matches: [] };
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
}

function extractMarkets(maList) {
  let ms1 = null;
  let msX = null;
  let ms2 = null;
  let alt25 = null;
  let ust25 = null;
  let plus6 = null;
  let ust45 = null;
  let kgVar = null;

  for (const m of maList || []) {
    const oca = m.OCA || [];
    const byN = (n) => toOdd(oca.find((o) => o.N === n)?.O);

    if (m.MTID === 1) {
      ms1 = byN(1);
      msX = byN(2);
      ms2 = byN(3);
    } else if (m.MTID === 12 && m.SOV === 2.5) {
      alt25 = byN(1);
      ust25 = byN(2);
    } else if (m.SOV === 4.5 && oca.length === 2 && [12, 13, 14, 15, 16].includes(m.MTID)) {
      ust45 = byN(2);
    } else if (m.MTID === 38) {
      kgVar = byN(1);
    } else if (m.MTID === 43) {
      plus6 = byN(4);
    }
  }

  return { ms1, msX, ms2, alt25, ust25, plus6, ust45, kgVar };
}

function computeMovements(initialOdds, currentOdds) {
  const movements = {};
  let hasMovement = false;

  for (const field of TRACKED_FIELDS) {
    const from = initialOdds?.[field] ?? null;
    const to = currentOdds?.[field] ?? null;
    if (from !== null && to !== null) {
      const diff = Number((to - from).toFixed(2));
      if (Math.abs(diff) >= 0.01) {
        movements[field] = {
          from,
          to,
          delta: diff,
          dir: diff > 0 ? 'up' : 'down',
        };
        hasMovement = true;
      }
    }
  }

  return { movements, hasMovement };
}

function mergeLockedSignals(prevLocked, newSignals) {
  const byCode = new Map();
  for (const s of prevLocked || []) {
    byCode.set(s.code, s);
  }
  for (const s of newSignals || []) {
    if (!byCode.has(s.code)) {
      byCode.set(s.code, { ...s, lockedAt: new Date().toISOString() });
    }
  }
  return [...byCode.values()];
}

/**
 * Fetches all unstarted Soccer matches directly from Nesine's full pre-bulletin API.
 * Preserves initial odds, tracks odds rises/drops, and never drops a match from
 * the Şike list once it has been flagged.
 */
async function syncNesineBulletin(dateScope = 'all') {
  const prevCache = loadCache();
  const prevByKey = new Map();
  for (const pm of prevCache.matches || []) {
    prevByKey.set(pm.key, pm);
  }

  const res = await fetch(NESINE_FULL_URL, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`Nesine API HTTP ${res.status}`);
  }
  const data = await res.json();
  const events = data?.sg?.EA || [];
  const leagues = data?.sg?.LA || [];

  const leagueMap = new Map();
  for (const l of leagues) {
    leagueMap.set(l.LID, {
      name: l.N || '-',
      cc: l.CC || '',
    });
  }

  const notebook = getAllNotebookMatches();
  const nowMs = Date.now();
  const todayStr = getIstanbulDateStr(0);
  const tomorrowStr = getIstanbulDateStr(1);

  const matches = [];

  for (const e of events) {
    if (e.TYPE !== 1 || !e.ESD || e.ESD <= nowMs) continue;
    if (!e.HN || !e.AN || !Array.isArray(e.MA) || e.MA.length === 0) continue;

    const dateStr = utcMsToIstanbulDateStr(e.ESD);
    if (dateScope === 'today' && dateStr !== todayStr) continue;
    if (dateScope === 'tomorrow' && dateStr !== tomorrowStr) continue;
    if (dateScope === 'both' && dateStr !== todayStr && dateStr !== tomorrowStr) continue;

    const odds = extractMarkets(e.MA);
    if (!odds.ms1 && !odds.msX && !odds.ms2) continue;

    const key = String(e.C);
    const prev = prevByKey.get(key);

    // Keep first-seen odds as baseline for movement tracking
    const initialOdds = prev?.initialOdds ? { ...prev.initialOdds } : { ...odds };
    for (const f of TRACKED_FIELDS) {
      if (initialOdds[f] == null && odds[f] != null) {
        initialOdds[f] = odds[f];
      }
    }

    const { movements, hasMovement } = computeMovements(initialOdds, odds);

    // Analyze current odds AND preserve any previously locked şike signals
    const currentAnalysis = analyzeMatch(
      { ms1: odds.ms1, msX: odds.msX, ms2: odds.ms2, plus6: odds.plus6 },
      notebook
    );

    const lockedSignals = mergeLockedSignals(prev?.lockedSignals, currentAnalysis.signals);
    const isCurrentSignal = currentAnalysis.signals.length > 0;
    const keptViaLock = lockedSignals.length > 0 && !isCurrentSignal;

    const lg = leagueMap.get(e.LC) || { name: '-', cc: '' };
    const leagueLabel = lg.cc ? `${lg.cc} • ${lg.name}` : lg.name;

    matches.push({
      key,
      iddaaCode: key,
      utcMs: e.ESD,
      dateStr,
      league: leagueLabel,
      mbs: e.EMBS ? String(e.EMBS) : '-',
      home: e.HN,
      away: e.AN,
      initialOdds,
      odds,
      movements,
      hasMovement,
      lockedSignals,
      keptViaLock,
    });
  }

  matches.sort((a, b) => (a.utcMs || 0) - (b.utcMs || 0));

  const cache = {
    lastSync: new Date().toISOString(),
    dateScope,
    matches,
  };
  saveCache(cache);
  return cache;
}

function getCachedBulletin() {
  return loadCache();
}

module.exports = {
  syncNesineBulletin,
  getCachedBulletin,
};
