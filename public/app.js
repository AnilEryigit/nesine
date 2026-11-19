const collator = new Intl.Collator('tr', { numeric: true, sensitivity: 'base' });

const state = {
  matches: [],
  notebook: [],
  activeTab: 'bulletin',
  preset: 'all',
  selectedDate: 'all',
  nbGroup: 'all',
  lastSync: null,
};

const els = {
  syncStatus: document.getElementById('syncStatus'),
  dateChips: document.getElementById('dateChips'),
  datePicker: document.getElementById('datePicker'),
  refreshBtn: document.getElementById('refreshBtn'),
  statTotal: document.getElementById('statTotal'),
  statSignals: document.getElementById('statSignals'),
  statNotebook: document.getElementById('statNotebook'),
  tabSignalCount: document.getElementById('tabSignalCount'),
  filterPanel: document.getElementById('filterPanel'),
  bulletinSection: document.getElementById('bulletinSection'),
  notebookSection: document.getElementById('notebookSection'),
  bulletinTable: document.getElementById('bulletinTable'),
  bulletinBody: document.getElementById('bulletinBody'),
  notebookBody: document.getElementById('notebookBody'),
  sortStatus: document.getElementById('sortStatus'),
  searchInput: document.getElementById('searchInput'),
  ms1Min: document.getElementById('ms1Min'),
  ms1Max: document.getElementById('ms1Max'),
  msXMin: document.getElementById('msXMin'),
  msXMax: document.getElementById('msXMax'),
  ms2Min: document.getElementById('ms2Min'),
  ms2Max: document.getElementById('ms2Max'),
  plus6Min: document.getElementById('plus6Min'),
  clearFiltersBtn: document.getElementById('clearFiltersBtn'),
  matchDialog: document.getElementById('matchDialog'),
  modalTitle: document.getElementById('modalTitle'),
  modalBody: document.getElementById('modalBody'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  addPatternDialog: document.getElementById('addPatternDialog'),
  openAddPatternBtn: document.getElementById('openAddPatternBtn'),
  closeAddModalBtn: document.getElementById('closeAddModalBtn'),
  addPatternForm: document.getElementById('addPatternForm'),
};

function fmtOdd(val) {
  return typeof val === 'number' && Number.isFinite(val) ? val.toFixed(2) : '-';
}

function fmtTime(utcMs) {
  if (!utcMs) return '--:--';
  const d = new Date(utcMs);
  const datePart = d.toLocaleDateString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: '2-digit',
    month: '2-digit',
  });
  const timePart = d.toLocaleTimeString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${datePart} · ${timePart}`;
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

function formatDateChipLabel(dateStr, todayStr, tomorrowStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const short = dt.toLocaleDateString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  });
  if (dateStr === todayStr) return `Bugün · ${short}`;
  if (dateStr === tomorrowStr) return `Yarın · ${short}`;
  return short;
}

function renderDateChips() {
  const counts = new Map();
  for (const m of state.matches) {
    if (!m.dateStr) continue;
    counts.set(m.dateStr, (counts.get(m.dateStr) || 0) + 1);
  }

  const dates = [...counts.keys()].sort();
  const todayStr = getIstanbulDateStr(0);
  const tomorrowStr = getIstanbulDateStr(1);

  if (dates.length > 0) {
    els.datePicker.min = dates[0];
    els.datePicker.max = dates[dates.length - 1];
  }

  els.dateChips.replaceChildren();

  const makeChip = (val, text) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `chip ${state.selectedDate === val ? 'is-active' : ''}`;
    btn.textContent = text;
    btn.addEventListener('click', () => {
      state.selectedDate = val;
      els.datePicker.value = val === 'all' ? '' : val;
      renderDateChips();
      renderBulletinTable();
    });
    return btn;
  };

  els.dateChips.appendChild(makeChip('all', `Tüm Günler (${state.matches.length})`));
  for (const d of dates) {
    els.dateChips.appendChild(
      makeChip(d, `${formatDateChipLabel(d, todayStr, tomorrowStr)} (${counts.get(d)})`)
    );
  }
}

function fmtSyncTime(iso) {
  if (!iso) return 'Henüz senkronize edilmedi';
  const d = new Date(iso);
  return `Son güncelleme: ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
}

function numInput(el) {
  const v = parseFloat(el.value);
  return Number.isFinite(v) ? v : null;
}

function getFilteredMatches() {
  const q = els.searchInput.value.trim().toLowerCase();
  const ms1Min = numInput(els.ms1Min);
  const ms1Max = numInput(els.ms1Max);
  const msXMin = numInput(els.msXMin);
  const msXMax = numInput(els.msXMax);
  const ms2Min = numInput(els.ms2Min);
  const ms2Max = numInput(els.ms2Max);
  const plus6Min = numInput(els.plus6Min);

  return state.matches.filter((m) => {
    const o = m.odds || {};
    if (state.selectedDate !== 'all' && m.dateStr !== state.selectedDate) return false;
    if (state.activeTab === 'signals' && !m.analysis?.isSignal) return false;

    if (state.preset === '190') {
      if (!m.analysis?.signals?.some((s) => s.code === '190_200')) return false;
    } else if (state.preset === '210') {
      if (!m.analysis?.signals?.some((s) => s.code === 'CALISAN_210')) return false;
    } else if (state.preset === 'plus6') {
      if (!o.plus6) return false;
    } else if (state.preset === 'moved') {
      if (!m.hasMovement) return false;
    }

    if (q) {
      const hay = `${m.home} ${m.away} ${m.league} ${m.iddaaCode}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    if (ms1Min !== null && (o.ms1 == null || o.ms1 < ms1Min)) return false;
    if (ms1Max !== null && (o.ms1 == null || o.ms1 > ms1Max)) return false;
    if (msXMin !== null && (o.msX == null || o.msX < msXMin)) return false;
    if (msXMax !== null && (o.msX == null || o.msX > msXMax)) return false;
    if (ms2Min !== null && (o.ms2 == null || o.ms2 < ms2Min)) return false;
    if (ms2Max !== null && (o.ms2 == null || o.ms2 > ms2Max)) return false;
    if (plus6Min !== null && (o.plus6 == null || o.plus6 < plus6Min)) return false;

    return true;
  });
}

function isHotOdd(val) {
  if (typeof val !== 'number') return false;
  return (val >= 1.90 && val <= 2.00) || (val >= 2.03 && val <= 2.20);
}

function buildOddCell(label, val, move, extraClass = '') {
  const td = document.createElement('td');
  td.dataset.label = label;
  td.dataset.value = val ?? 999;

  const wrap = document.createElement('span');
  wrap.className = 'odd-cell';

  const pill = document.createElement('span');
  pill.className = `odd-pill ${extraClass}`.trim();
  pill.textContent = fmtOdd(val);
  wrap.appendChild(pill);

  if (move) {
    const mv = document.createElement('span');
    mv.className = `odd-move odd-move--${move.dir}`;
    const arrow = move.dir === 'down' ? '▼' : '▲';
    const sign = move.delta > 0 ? '+' : '';
    mv.textContent = `${arrow} ${sign}${move.delta.toFixed(2)}`;
    mv.title = `İlk: ${fmtOdd(move.from)} → Güncel: ${fmtOdd(move.to)}`;
    wrap.appendChild(mv);
  }

  td.appendChild(wrap);
  return td;
}
function createCell(text, { label, value, tag = 'td', className = '' } = {}) {
  const el = document.createElement(tag);
  if (label) el.dataset.label = label;
  if (value !== undefined && value !== null) el.dataset.value = String(value);
  if (className) el.className = className;
  el.textContent = text;
  return el;
}

function renderBulletinTable() {
  const list = getFilteredMatches();
  els.bulletinBody.replaceChildren();

  if (list.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 10;
    td.className = 'empty-cell';
    td.textContent =
      state.activeTab === 'signals'
        ? 'Şu anki bültende aktif oran şikesi kriterine uyan maç bulunamadı.'
        : 'Filtreye uygun maç bulunamadı.';
    tr.appendChild(td);
    els.bulletinBody.appendChild(tr);
    return;
  }

  for (const m of list) {
    const o = m.odds || {};
    const mv = m.movements || {};
    const tr = document.createElement('tr');
    if (m.analysis?.isSignal) tr.classList.add('is-signal');
    tr.addEventListener('click', () => openMatchModal(m));

    // 0: Saat
    tr.appendChild(createCell(fmtTime(m.utcMs), { label: 'Saat', value: m.utcMs || 0 }));

    // 1: Lig / Kod
    tr.appendChild(
      createCell(`${m.league || '-'} • ${m.iddaaCode || '-'}`, {
        label: 'Lig / Kod',
        value: `${m.league} ${m.iddaaCode}`,
      })
    );

    // 2: Maç (row header)
    const matchName = `${m.home} - ${m.away}`;
    const th = createCell(matchName, { tag: 'th', value: matchName });
    th.scope = 'row';
    tr.appendChild(th);

    // 3: MS 1
    tr.appendChild(buildOddCell('MS 1', o.ms1, mv.ms1, isHotOdd(o.ms1) ? 'odd-pill--hot' : ''));

    // 4: MS X
    tr.appendChild(buildOddCell('MS X', o.msX, mv.msX));

    // 5: MS 2
    tr.appendChild(buildOddCell('MS 2', o.ms2, mv.ms2, isHotOdd(o.ms2) ? 'odd-pill--hot' : ''));

    // 6: +6 Gol
    tr.appendChild(buildOddCell('+6 Gol', o.plus6, mv.plus6, o.plus6 ? 'odd-pill--plus6' : ''));

    // 7: 2.5 Üst
    tr.appendChild(buildOddCell('2.5 Üst', o.ust25, mv.ust25));

    // 8: KG Var
    tr.appendChild(buildOddCell('KG Var', o.kgVar, mv.kgVar));

    // 9: Şike / Benzerlik
    const tdSig = document.createElement('td');
    tdSig.dataset.label = 'Şike / Benzerlik';
    tdSig.dataset.value = m.analysis?.bestSimilarity ?? 0;
    if (m.analysis?.signals?.length) {
      const badge = document.createElement('span');
      badge.className = 'signal-tag';
      badge.textContent = m.analysis.signals[0].label;
      tdSig.appendChild(badge);
      if (m.analysis.keptViaLock) {
        const lock = document.createElement('span');
        lock.className = 'lock-tag';
        lock.textContent = '🔒 Oran değişti (korundu)';
        tdSig.appendChild(lock);
      }
    } else {
      const span = document.createElement('span');
      span.className = 'sim-muted';
      span.textContent = `%${m.analysis?.bestSimilarity ?? 0} benzer`;
      tdSig.appendChild(span);
    }
    tr.appendChild(tdSig);

    els.bulletinBody.appendChild(tr);
  }
}

function renderNotebookTable() {
  const list = state.notebook.filter((item) =>
    state.nbGroup === 'all' ? true : item.group === state.nbGroup
  );
  els.notebookBody.replaceChildren();

  for (const item of list) {
    const tr = document.createElement('tr');
    tr.appendChild(createCell(item.group));
    const th = createCell(item.match, { tag: 'th' });
    th.scope = 'row';
    tr.appendChild(th);
    tr.appendChild(createCell(fmtOdd(item.ms1)));
    tr.appendChild(createCell(fmtOdd(item.msX)));
    tr.appendChild(createCell(fmtOdd(item.ms2)));
    tr.appendChild(createCell(fmtOdd(item.plus6)));

    const tdScore = document.createElement('td');
    const sb = document.createElement('span');
    sb.className = 'score-badge';
    sb.textContent = item.score || '-';
    tdScore.appendChild(sb);
    tr.appendChild(tdScore);

    tr.appendChild(createCell(item.iyms || '-'));
    els.notebookBody.appendChild(tr);
  }
}

function openMatchModal(m) {
  const o = m.odds || {};
  const mv = m.movements || {};
  els.modalTitle.textContent = `${m.home} - ${m.away} (${m.league} • ${m.iddaaCode})`;
  els.modalBody.replaceChildren();

  const oddsGrid = document.createElement('div');
  oddsGrid.className = 'detail-odds';
  const items = [
    ['MS 1', o.ms1, mv.ms1],
    ['MS X', o.msX, mv.msX],
    ['MS 2', o.ms2, mv.ms2],
    ['+6 Gol', o.plus6, mv.plus6],
    ['2.5 Üst', o.ust25, mv.ust25],
    ['4.5 Üst', o.ust45, null],
    ['KG Var', o.kgVar, mv.kgVar],
  ];
  for (const [label, val, move] of items) {
    const box = document.createElement('div');
    box.className = 'detail-box';
    const sp = document.createElement('span');
    sp.textContent = label;
    const st = document.createElement('strong');
    st.textContent = fmtOdd(val);
    box.append(sp, st);
    if (move) {
      const sub = document.createElement('span');
      sub.className = `odd-move odd-move--${move.dir}`;
      sub.textContent = `${fmtOdd(move.from)} → ${fmtOdd(move.to)} (${move.delta > 0 ? '+' : ''}${move.delta.toFixed(2)})`;
      box.appendChild(sub);
    }
    oddsGrid.appendChild(box);
  }
  els.modalBody.appendChild(oddsGrid);

  if (m.analysis?.signals?.length) {
    for (const sig of m.analysis.signals) {
      const p = document.createElement('p');
      p.className = 'signal-tag';
      p.textContent = `🎯 ${sig.label} — ${sig.hint}`;
      els.modalBody.appendChild(p);
    }
  }

  const subTitle = document.createElement('h3');
  subTitle.textContent = 'Defter Arşivindeki En Yakın 3 Açılış Oranı';
  subTitle.style.margin = '0.25rem 0 0';
  subTitle.style.fontSize = '0.95rem';
  els.modalBody.appendChild(subTitle);

  const listWrap = document.createElement('div');
  listWrap.className = 'nb-match-list';
  for (const nb of m.analysis?.topMatches || []) {
    const row = document.createElement('div');
    row.className = 'nb-match-item';

    const left = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = `${nb.match} `;
    const grp = document.createElement('span');
    grp.className = 'sim-muted';
    grp.textContent = `(${nb.group})`;
    const oddsLine = document.createElement('div');
    oddsLine.className = 'sim-muted';
    oddsLine.textContent = `1: ${fmtOdd(nb.ms1)} | X: ${fmtOdd(nb.msX)} | 2: ${fmtOdd(nb.ms2)} | +6: ${fmtOdd(nb.plus6)}`;
    left.append(title, grp, oddsLine);

    const right = document.createElement('div');
    right.style.display = 'flex';
    right.style.gap = '0.45rem';
    right.style.alignItems = 'center';
    const sim = document.createElement('span');
    sim.className = 'odd-pill';
    sim.textContent = `%${nb.similarity}`;
    const sc = document.createElement('span');
    sc.className = 'score-badge';
    sc.textContent = `${nb.score}${nb.iyms ? ' (' + nb.iyms + ')' : ''}`;
    right.append(sim, sc);

    row.append(left, right);
    listWrap.appendChild(row);
  }
  els.modalBody.appendChild(listWrap);

  els.matchDialog.showModal();
}

// Sortable table handler (reorders existing <tr> elements without rebuilding tbody)
els.bulletinTable.tHead.addEventListener('click', (e) => {
  const btn = e.target.closest('.sort-btn');
  if (!btn) return;

  const th = btn.closest('th');
  const direction = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';

  for (const header of els.bulletinTable.tHead.rows[0].cells) {
    header.removeAttribute('aria-sort');
  }
  th.setAttribute('aria-sort', direction);

  const colIndex = th.cellIndex;
  const type = th.dataset.type || 'text';
  const factor = direction === 'ascending' ? 1 : -1;

  const rows = [...els.bulletinBody.rows];
  if (rows.length <= 1 && rows[0]?.cells.length === 1) return;

  rows.sort((a, b) => {
    const va = a.cells[colIndex].dataset.value ?? a.cells[colIndex].textContent.trim();
    const vb = b.cells[colIndex].dataset.value ?? b.cells[colIndex].textContent.trim();
    if (type === 'number') {
      return factor * (Number(va) - Number(vb));
    }
    return factor * collator.compare(va, vb);
  });

  for (const row of rows) {
    if (typeof els.bulletinBody.moveBefore === 'function') {
      els.bulletinBody.moveBefore(row, null);
    } else {
      els.bulletinBody.appendChild(row);
    }
  }

  els.sortStatus.textContent = `${btn.textContent.trim()} sütununa göre ${
    direction === 'ascending' ? 'artan' : 'azalan'
  } sıralandı, ${rows.length} maç`;
});

// Tabs
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    state.activeTab = tab.dataset.tab;

    const isNb = state.activeTab === 'notebook';
    els.bulletinSection.hidden = isNb;
    els.filterPanel.hidden = isNb;
    els.notebookSection.hidden = !isNb;

    if (!isNb) renderBulletinTable();
  });
});

// Preset chips
document.querySelectorAll('.filter-presets [data-preset]').forEach((chip) => {
  chip.addEventListener('click', () => {
    document
      .querySelectorAll('.filter-presets [data-preset]')
      .forEach((c) => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    state.preset = chip.dataset.preset;
    renderBulletinTable();
  });
});

// Notebook group chips
document.querySelectorAll('[data-nb-group]').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('[data-nb-group]').forEach((c) => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    state.nbGroup = chip.dataset.nbGroup;
    renderNotebookTable();
  });
});

// Filter inputs
[
  els.searchInput,
  els.ms1Min,
  els.ms1Max,
  els.msXMin,
  els.msXMax,
  els.ms2Min,
  els.ms2Max,
  els.plus6Min,
].forEach((input) => {
  input.addEventListener('input', renderBulletinTable);
});

els.clearFiltersBtn.addEventListener('click', () => {
  [
    els.searchInput,
    els.ms1Min,
    els.ms1Max,
    els.msXMin,
    els.msXMax,
    els.ms2Min,
    els.ms2Max,
    els.plus6Min,
  ].forEach((el) => {
    el.value = '';
  });
  state.preset = 'all';
  state.selectedDate = 'all';
  els.datePicker.value = '';
  document.querySelectorAll('.filter-presets [data-preset]').forEach((c) => {
    c.classList.toggle('is-active', c.dataset.preset === 'all');
  });
  renderDateChips();
  renderBulletinTable();
});

els.datePicker.addEventListener('change', () => {
  state.selectedDate = els.datePicker.value || 'all';
  renderDateChips();
  renderBulletinTable();
});

// Modals
els.closeModalBtn.addEventListener('click', () => els.matchDialog.close());
els.matchDialog.addEventListener('click', (e) => {
  if (e.target === els.matchDialog) els.matchDialog.close();
});

els.openAddPatternBtn.addEventListener('click', () => els.addPatternDialog.showModal());
els.closeAddModalBtn.addEventListener('click', () => els.addPatternDialog.close());
els.addPatternDialog.addEventListener('click', (e) => {
  if (e.target === els.addPatternDialog) els.addPatternDialog.close();
});

els.addPatternForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(els.addPatternForm);
  const payload = Object.fromEntries(fd.entries());
  const res = await fetch('/api/notebook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    els.addPatternForm.reset();
    els.addPatternDialog.close();
    await loadAll();

setInterval(async () => {
  if (document.visibilityState !== 'visible') return;
  try {
    const res = await fetch('/api/matches');
    if (!res.ok) return;
    const data = await res.json();
    applyMatchesPayload(data);
  } catch {
    // ignore transient poll error
  }
}, 60 * 1000);
  }
});

async function refreshFromMackolik() {
  els.refreshBtn.disabled = true;
  els.refreshBtn.textContent = "Nesine'den Çekiliyor...";
  try {
    const res = await fetch('/api/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dateScope: 'all' }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Hata');
    applyMatchesPayload(data);
  } catch (err) {
    els.syncStatus.textContent = `Hata: ${err.message}`;
  } finally {
    els.refreshBtn.disabled = false;
    els.refreshBtn.textContent = "Nesine'den Güncelle";
  }
}

els.refreshBtn.addEventListener('click', refreshFromMackolik);

function applyMatchesPayload(data) {
  state.matches = data.matches || [];
  state.lastSync = data.lastSync;
  els.statTotal.textContent = String(data.total ?? state.matches.length);
  els.statSignals.textContent = String(data.signalCount ?? 0);
  els.tabSignalCount.textContent = String(data.signalCount ?? 0);
  els.syncStatus.textContent = fmtSyncTime(data.lastSync);
  renderDateChips();
  renderBulletinTable();
}

async function loadAll() {
  const [mRes, nRes] = await Promise.all([fetch('/api/matches'), fetch('/api/notebook')]);
  const mData = await mRes.json();
  const nData = await nRes.json();
  state.notebook = nData.entries || [];
  els.statNotebook.textContent = String(state.notebook.length);
  applyMatchesPayload(mData);
  renderNotebookTable();
}

loadAll();

setInterval(async () => {
  if (document.visibilityState !== 'visible') return;
  try {
    const res = await fetch('/api/matches');
    if (!res.ok) return;
    const data = await res.json();
    applyMatchesPayload(data);
  } catch {
    // ignore transient poll error
  }
}, 60 * 1000);
