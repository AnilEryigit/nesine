const NESINE_FULL_URL = 'https://bulten.nesine.com/api/bulten/getprebultenfull';

export const NOTEBOOK_MATCHES = [
  { id: 'nb-1', group: '1.90 - 2.00', match: 'Watford - Wolverhampton', ms1: 1.98, msX: 3.22, ms2: 2.77, plus6: 8.61, score: '4-2', iyms: '', note: '2' },
  { id: 'nb-2', group: '1.90 - 2.00', match: 'Widzew - Lech Poznan', ms1: 2.70, msX: 3.13, ms2: 1.92, plus6: 9.41, score: '2-3', iyms: '', note: '' },
  { id: 'nb-3', group: '1.90 - 2.00', match: 'NY Red Bulls - Charlotte', ms1: 1.94, msX: 3.11, ms2: 2.65, plus6: 11.10, score: '4-2', iyms: '', note: '1' },
  { id: 'nb-4', group: '1.90 - 2.00', match: 'Bristol R. - Plymouth', ms1: 2.67, msX: 3.12, ms2: 1.92, plus6: 11.15, score: '3-4', iyms: '1/2', note: '' },
  { id: 'nb-5', group: '1.90 - 2.00', match: 'E. Frankfurt - B. Dortmund', ms1: 2.65, msX: 3.12, ms2: 1.98, plus6: 8.99, score: '3-3', iyms: '', note: '' },
  { id: 'nb-6', group: '1.90 - 2.00', match: 'Al Wahda - Al Ahli Doha', ms1: 1.94, msX: 3.11, ms2: 2.64, plus6: 9.73, score: '3-2', iyms: '', note: '1' },
  { id: 'nb-7', group: '1.90 - 2.00', match: 'Luzern - Basel', ms1: 1.93, msX: 3.42, ms2: 2.73, plus6: 5.84, score: '2-4', iyms: '', note: '' },
  { id: 'nb-8', group: '1.90 - 2.00', match: 'Aachen - Hoffenheim II', ms1: 1.92, msX: 3.14, ms2: 2.79, plus6: null, score: '2-4', iyms: '', note: '' },
  { id: 'nb-9', group: '1.90 - 2.00', match: 'Hoffenheim - Aachen', ms1: 1.91, msX: 3.32, ms2: 2.82, plus6: 8.06, score: '2-3', iyms: '', note: '' },
  { id: 'nb-10', group: '1.90 - 2.00', match: 'Vallecano - Santander', ms1: 1.92, msX: 3.56, ms2: 3.54, plus6: 8.71, score: '3-2', iyms: '', note: '2' },
  { id: 'nb-11', group: '1.90 - 2.00', match: 'Valerenga - Molde', ms1: 2.54, msX: 3.57, ms2: 1.99, plus6: 4.33, score: '3-4', iyms: '', note: '3' },
  { id: 'nb-12', group: '1.90 - 2.00', match: 'Hacken - Djurgarden', ms1: 2.77, msX: 3.28, ms2: 1.94, plus6: 10.10, score: '1-6', iyms: '', note: '' },
  { id: 'nb-13', group: '1.90 - 2.00', match: 'Beşiktaş - Shakhtar D.', ms1: 1.97, msX: 3.24, ms2: 2.73, plus6: 9.55, score: '2-4', iyms: '', note: '2' },
  { id: 'nb-14', group: '1.90 - 2.00', match: 'Basel - Young Boys', ms1: 1.96, msX: 3.27, ms2: 2.78, plus6: 6.28, score: '3-3', iyms: '', note: '' },
  { id: 'nb-15', group: '1.90 - 2.00', match: 'Doncaster - Wigan', ms1: 1.95, msX: 2.85, ms2: 2.84, plus6: 19.40, score: '3-3', iyms: '', note: '' },
  { id: 'nb-16', group: '1.90 - 2.00', match: 'Grasshopper - Sion', ms1: 2.70, msX: 3.10, ms2: 1.93, plus6: 19.65, score: '3-3', iyms: '', note: '' },
  { id: 'nb-17', group: 'Çalışan Oranlar', match: 'Zwolle - Telstar', ms1: 2.10, msX: 3.18, ms2: 2.56, plus6: 10.80, score: '4-1', iyms: '', note: '' },
  { id: 'nb-18', group: 'Çalışan Oranlar', match: 'Zürich - Luzern', ms1: 2.57, msX: 3.17, ms2: 2.10, plus6: 7.42, score: '1-4', iyms: '', note: '' },
  { id: 'nb-19', group: 'Çalışan Oranlar', match: 'Hamburg - W. Bremen', ms1: 2.13, msX: 3.10, ms2: 2.58, plus6: 10.05, score: '3-2', iyms: '2/1', note: '' },
  { id: 'nb-20', group: 'Çalışan Oranlar', match: 'Strasbourg - Monaco', ms1: 2.13, msX: 3.10, ms2: 2.58, plus6: 7.49, score: '3-1', iyms: '', note: '' },
  { id: 'nb-21', group: 'Çalışan Oranlar', match: 'Leicester - Southampton', ms1: 2.56, msX: 3.11, ms2: 2.14, plus6: 11.45, score: '3-4', iyms: '1/2', note: '' },
  { id: 'nb-22', group: 'Çalışan Oranlar', match: 'Wolfsburg - Freiburg', ms1: 2.16, msX: 3.08, ms2: 2.55, plus6: 13.15, score: '3-4', iyms: '', note: '' },
  { id: 'nb-23', group: 'Çalışan Oranlar', match: 'Türkiye - İtalya', ms1: 2.56, msX: 3.07, ms2: 2.16, plus6: 9.87, score: '1-4', iyms: '', note: '' },
  { id: 'nb-24', group: 'Çalışan Oranlar', match: 'Estoril - Guimaraes', ms1: 2.17, msX: 3.10, ms2: 2.51, plus6: 13.05, score: '4-2', iyms: '2/1', note: '' },
  { id: 'nb-25', group: 'Çalışan Oranlar', match: 'Elfsborg - Göteborg', ms1: 2.15, msX: 3.17, ms2: 2.50, plus6: 9.37, score: '4-3', iyms: '2/1', note: '' },
  { id: 'nb-26', group: 'Çalışan Oranlar', match: 'Valladolid - Cordoba', ms1: 2.18, msX: 3.05, ms2: 2.56, plus6: 14.10, score: '3-1', iyms: '', note: '' },
  { id: 'nb-27', group: 'Çalışan Oranlar', match: 'Swansea - Norwich', ms1: 2.13, msX: 3.12, ms2: 2.55, plus6: 10.20, score: '2-1', iyms: '2/1', note: '' },
  { id: 'nb-28', group: 'Çalışan Oranlar', match: 'Celta Vigo II - R. Sociedad II', ms1: 2.17, msX: 3.08, ms2: 2.56, plus6: 11.80, score: '4-1', iyms: '', note: '' },
  { id: 'nb-29', group: 'Çalışan Oranlar', match: 'Ingolstadt - W. Wiesbaden', ms1: 2.13, msX: 3.18, ms2: 2.55, plus6: 10.05, score: '2-4', iyms: '', note: '' },
  { id: 'nb-30', group: 'Çalışan Oranlar', match: 'Mechelen - St. Truidense', ms1: 2.59, msX: 3.14, ms2: 2.12, plus6: 9.45, score: '4-3', iyms: '', note: '' },
  { id: 'nb-31', group: 'Çalışan Oranlar', match: 'Hartberg - Lustenau', ms1: 2.03, msX: 3.19, ms2: 2.70, plus6: 11.00, score: '4-3', iyms: '2/1', note: '' },
];

function computeSimilarity(live, nb) {
  if (!live.ms1 || !live.msX || !live.ms2) return 0;
  const liveFav = Math.min(live.ms1, live.ms2);
  const liveDog = Math.max(live.ms1, live.ms2);
  const nbFav = Math.min(nb.ms1, nb.ms2);
  const nbDog = Math.max(nb.ms1, nb.ms2);

  let weightedDist =
    Math.abs(liveFav - nbFav) * 2.4 +
    Math.abs(live.msX - nb.msX) * 1.6 +
    Math.abs(liveDog - nbDog) * 1.6;

  if (live.plus6 && nb.plus6) {
    weightedDist += Math.min(Math.abs(live.plus6 - nb.plus6) * 0.12, 0.8);
  }
  return Math.max(0, Math.round((1 - weightedDist / 1.8) * 100));
}

export function analyzeMatch(match) {
  const { ms1, msX, ms2 } = match;
  if (!ms1 || !msX || !ms2) {
    return { signals: [], isSignal: false, bestSimilarity: 0, topMatches: [] };
  }

  const fav = Math.min(ms1, ms2);
  const dog = Math.max(ms1, ms2);
  const favSide = ms1 <= ms2 ? '1' : '2';
  const signals = [];

  if (fav >= 1.90 && fav <= 2.00 && msX >= 2.80 && msX <= 3.65 && dog >= 2.50 && dog <= 3.65) {
    signals.push({
      code: '190_200',
      label: '1.90 - 2.00 Şikesi',
      side: favSide,
      hint: 'KG Var / 4.5+ Üst / +6 Gol Adayı',
    });
  }

  if (fav >= 2.03 && fav <= 2.20 && msX >= 3.00 && msX <= 3.25 && dog >= 2.48 && dog <= 2.75) {
    signals.push({
      code: 'CALISAN_210',
      label: 'Çalışan Oranlar (2.10-2.18)',
      side: favSide,
      hint: 'Yüksek Skor & İY/MS (2/1 - 1/2) Adayı',
    });
  }

  const topMatches = NOTEBOOK_MATCHES.map((nb) => ({
    ...nb,
    similarity: computeSimilarity(match, nb),
  }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  const bestSimilarity = topMatches[0]?.similarity ?? 0;

  if (signals.length === 0 && bestSimilarity >= 82) {
    signals.push({
      code: 'HIGH_SIM',
      label: `Defter Eşleşmesi (%${bestSimilarity})`,
      side: favSide,
      hint: `${topMatches[0].match} (${topMatches[0].score}) oranına çok yakın`,
    });
  }

  return { signals, isSignal: signals.length > 0, bestSimilarity, topMatches };
}

function toOdd(val) {
  const num = Number(val);
  return Number.isFinite(num) && num > 1.0 ? num : null;
}

function utcMsToIstanbulDateStr(utcMs) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(utcMs));
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

export async function fetchNesineLivePayload() {
  const res = await fetch(NESINE_FULL_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      Accept: 'application/json, text/plain, */*',
      Referer: 'https://www.nesine.com/iddaa',
      Origin: 'https://www.nesine.com',
    },
  });
  if (!res.ok) {
    throw new Error(`Nesine API HTTP ${res.status}`);
  }
  const data = await res.json();
  const events = data?.sg?.EA || [];
  const leagues = data?.sg?.LA || [];

  const leagueMap = new Map();
  for (const l of leagues) {
    leagueMap.set(l.LID, { name: l.N || '-', cc: l.CC || '' });
  }

  const nowMs = Date.now();
  const matches = [];

  for (const e of events) {
    if (e.TYPE !== 1 || !e.ESD || e.ESD <= nowMs) continue;
    if (!e.HN || !e.AN || !Array.isArray(e.MA) || e.MA.length === 0) continue;

    const odds = extractMarkets(e.MA);
    if (!odds.ms1 && !odds.msX && !odds.ms2) continue;

    const lg = leagueMap.get(e.LC) || { name: '-', cc: '' };
    const leagueLabel = lg.cc ? `${lg.cc} • ${lg.name}` : lg.name;
    const analysis = analyzeMatch(odds);

    matches.push({
      key: String(e.C),
      iddaaCode: String(e.C),
      utcMs: e.ESD,
      dateStr: utcMsToIstanbulDateStr(e.ESD),
      league: leagueLabel,
      mbs: e.EMBS ? String(e.EMBS) : '-',
      home: e.HN,
      away: e.AN,
      odds,
      analysis,
    });
  }

  matches.sort((a, b) => (a.utcMs || 0) - (b.utcMs || 0));

  return {
    lastSync: new Date().toISOString(),
    dateScope: 'all',
    total: matches.length,
    signalCount: matches.filter((m) => m.analysis.isSignal).length,
    matches,
  };
}
