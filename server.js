const express = require('express');
const path = require('path');
const { syncNesineBulletin, getCachedBulletin } = require('./scraper');
const { getAllNotebookMatches, saveCustomPattern, analyzeMatch } = require('./patterns');

const app = express();
const PORT = process.env.PORT || 3456;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let isSyncing = false;

function buildEnrichedMatches(cache) {
  const notebook = getAllNotebookMatches();
  return (cache.matches || []).map((m) => {
    const o = m.odds || {};
    const liveAnalysis = analyzeMatch(
      {
        ms1: o.ms1,
        msX: o.msX,
        ms2: o.ms2,
        plus6: o.plus6,
      },
      notebook
    );

    const locked = m.lockedSignals || [];
    const mergedSignals = locked.length > 0 ? locked : liveAnalysis.signals;

    return {
      ...m,
      analysis: {
        ...liveAnalysis,
        signals: mergedSignals,
        isSignal: mergedSignals.length > 0,
        keptViaLock: Boolean(m.keptViaLock),
      },
    };
  });
}

app.get('/api/matches', async (req, res) => {
  try {
    let cache = getCachedBulletin();
    if (!cache.lastSync && !isSyncing) {
      isSyncing = true;
      try {
        cache = await syncNesineBulletin('all');
      } finally {
        isSyncing = false;
      }
    }
    const matches = buildEnrichedMatches(cache);
    res.json({
      lastSync: cache.lastSync,
      dateScope: cache.dateScope || 'all',
      total: matches.length,
      signalCount: matches.filter((m) => m.analysis.isSignal).length,
      matches,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/refresh', async (req, res) => {
  if (isSyncing) {
    return res.status(429).json({ error: 'Senkronizasyon zaten devam ediyor.' });
  }
  const dateScope = ['all', 'today', 'tomorrow', 'both'].includes(req.body?.dateScope)
    ? req.body.dateScope
    : 'all';

  isSyncing = true;
  try {
    const cache = await syncNesineBulletin(dateScope);
    const matches = buildEnrichedMatches(cache);
    res.json({
      lastSync: cache.lastSync,
      dateScope: cache.dateScope,
      total: matches.length,
      signalCount: matches.filter((m) => m.analysis.isSignal).length,
      matches,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    isSyncing = false;
  }
});

app.get('/api/notebook', (req, res) => {
  res.json({
    entries: getAllNotebookMatches(),
  });
});

app.post('/api/notebook', (req, res) => {
  const { group, match, ms1, msX, ms2, plus6, score, iyms, note } = req.body || {};
  if (!match || !ms1 || !msX || !ms2) {
    return res.status(400).json({ error: 'Maç adı ve MS 1/X/2 oranları zorunludur.' });
  }
  const entry = {
    id: `custom-${Date.now()}`,
    group: group || 'Özel Kayıt',
    match: String(match).trim(),
    ms1: Number(ms1),
    msX: Number(msX),
    ms2: Number(ms2),
    plus6: plus6 ? Number(plus6) : null,
    score: score ? String(score).trim() : '-',
    iyms: iyms ? String(iyms).trim() : '',
    note: note ? String(note).trim() : '',
  };
  saveCustomPattern(entry);
  res.json({ ok: true, entry });
});

const AUTO_SYNC_INTERVAL_MS = 60 * 1000;

app.listen(PORT, () => {
  console.log(`Mackolik Oran Radar sunucusu http://localhost:${PORT} adresinde çalışıyor.`);
  setInterval(async () => {
    if (isSyncing) return;
    isSyncing = true;
    try {
      await syncNesineBulletin('all');
    } catch (err) {
      console.error('Otomatik Nesine senkronizasyon hatası:', err.message);
    } finally {
      isSyncing = false;
    }
  }, AUTO_SYNC_INTERVAL_MS);
});
