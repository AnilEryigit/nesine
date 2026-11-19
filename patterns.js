const fs = require('fs');
const path = require('path');

const CUSTOM_PATTERNS_PATH = path.join(__dirname, 'data', 'custom_patterns.json');

/**
 * 31 verified historical matches digitized from the user's 3 notebook pages:
 * - Page 1: "1.90 - 2.00" group
 * - Pages 2 & 3: "# Çalışan Oranlar #" (2.10 - 2.18 & 2.03 group)
 */
const NOTEBOOK_MATCHES = [
  // --- Group 1: 1.90 - 2.00 ---
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

  // --- Group 2: # Çalışan Oranlar # (2.10 - 2.18) ---
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

function loadCustomPatterns() {
  try {
    if (fs.existsSync(CUSTOM_PATTERNS_PATH)) {
      return JSON.parse(fs.readFileSync(CUSTOM_PATTERNS_PATH, 'utf8'));
    }
  } catch {
    // ignore corrupt file
  }
  return [];
}

function saveCustomPattern(entry) {
  const existing = loadCustomPatterns();
  const next = [entry, ...existing];
  fs.writeFileSync(CUSTOM_PATTERNS_PATH, JSON.stringify(next, null, 2), 'utf8');
  return next;
}

function getAllNotebookMatches() {
  return [...loadCustomPatterns(), ...NOTEBOOK_MATCHES];
}

/**
 * Computes similarity score (0-100) between a live match and a notebook entry,
 * considering both normal orientation (1 vs 2) and mirrored orientation (2 vs 1).
 */
function computeSimilarity(live, nb) {
  if (!live.ms1 || !live.msX || !live.ms2) return 0;

  const liveFav = Math.min(live.ms1, live.ms2);
  const liveDog = Math.max(live.ms1, live.ms2);
  const nbFav = Math.min(nb.ms1, nb.ms2);
  const nbDog = Math.max(nb.ms1, nb.ms2);

  const dFav = Math.abs(liveFav - nbFav);
  const dX = Math.abs(live.msX - nb.msX);
  const dDog = Math.abs(liveDog - nbDog);

  let weightedDist = dFav * 2.4 + dX * 1.6 + dDog * 1.6;
  if (live.plus6 && nb.plus6) {
    // Scale +6 difference gently since +6 ranges from 4.33 to 19.65
    weightedDist += Math.min(Math.abs(live.plus6 - nb.plus6) * 0.12, 0.8);
  }

  // Convert distance to 0-100% similarity (dist=0 -> 100%, dist>=1.5 -> ~0%)
  const score = Math.max(0, Math.round((1 - weightedDist / 1.8) * 100));
  return score;
}

/**
 * Evaluates a live Mackolik match against the two main "Oran Şikesi" rules
 * and finds the closest historical notebook matches.
 */
function analyzeMatch(match, allNotebook) {
  const { ms1, msX, ms2, plus6 } = match;
  if (!ms1 || !msX || !ms2) {
    return {
      signals: [],
      isSignal: false,
      bestSimilarity: 0,
      topMatches: [],
    };
  }

  const fav = Math.min(ms1, ms2);
  const dog = Math.max(ms1, ms2);
  const favSide = ms1 <= ms2 ? '1' : '2';
  const signals = [];

  // Rule 1: 1.90 - 2.00 Şikesi
  if (fav >= 1.90 && fav <= 2.00 && msX >= 2.80 && msX <= 3.65 && dog >= 2.50 && dog <= 3.65) {
    signals.push({
      code: '190_200',
      label: '1.90 - 2.00 Şikesi',
      side: favSide,
      hint: 'KG Var / 4.5+ Üst / +6 Gol Adayı',
    });
  }

  // Rule 2: # Çalışan Oranlar # (2.10 - 2.18 / 2.03)
  if (fav >= 2.03 && fav <= 2.20 && msX >= 3.00 && msX <= 3.25 && dog >= 2.48 && dog <= 2.75) {
    signals.push({
      code: 'CALISAN_210',
      label: 'Çalışan Oranlar (2.10-2.18)',
      side: favSide,
      hint: 'Yüksek Skor & İY/MS (2/1 - 1/2) Adayı',
    });
  }

  // Find top 3 closest historical matches from the notebook
  const scored = allNotebook
    .map((nb) => ({
      ...nb,
      similarity: computeSimilarity(match, nb),
    }))
    .sort((a, b) => b.similarity - a.similarity);

  const topMatches = scored.slice(0, 3);
  const bestSimilarity = topMatches[0]?.similarity ?? 0;

  // Also flag high-similarity (>= 82%) even if slightly outside strict bounds
  if (signals.length === 0 && bestSimilarity >= 82) {
    signals.push({
      code: 'HIGH_SIM',
      label: `Defter Eşleşmesi (%${bestSimilarity})`,
      side: favSide,
      hint: `${topMatches[0].match} (${topMatches[0].score}) oranına çok yakın`,
    });
  }

  return {
    signals,
    isSignal: signals.length > 0,
    bestSimilarity,
    topMatches,
  };
}

module.exports = {
  NOTEBOOK_MATCHES,
  getAllNotebookMatches,
  saveCustomPattern,
  analyzeMatch,
};
