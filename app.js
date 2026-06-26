/* ═══════════════════════════════════════════════════
   Writer's Ground – App Logic v2
═══════════════════════════════════════════════════ */

// ── State ──────────────────────────────────────────
const state = {
  currentCat: 'submissions',
  search: '',
  regions: [],
  genres: [],
  toggles: [],
  sort: 'default',
};

// ── DOM refs ────────────────────────────────────────
const cardsGrid    = document.getElementById('cards-grid');
const emptyState   = document.getElementById('empty-state');
const resultsCount = document.getElementById('results-count');
const resultsLabel = document.getElementById('results-label');
const searchInput  = document.getElementById('search-input');
const sortSelect   = document.getElementById('sort-select');
const catTabs      = document.querySelectorAll('.cat-tab');
const regionChecks = document.querySelectorAll('#filter-region input[type="checkbox"]');
const toggleBtns   = document.querySelectorAll('.toggle-btn');
const genreBlock   = document.getElementById('filter-genre');
const btnReset     = document.getElementById('btn-reset');
const btnEmptyReset= document.getElementById('btn-empty-reset');
const siteHeader   = document.getElementById('site-header');
const hamburger    = document.getElementById('hamburger');
const mainNav      = document.getElementById('main-nav');
const nlForm       = document.getElementById('nl-form');

// ── Region class map ────────────────────────────────
function regionClass(r) {
  if (!r) return '';
  const lo = r.toLowerCase();
  if (lo.includes('australia') && lo.includes('new zealand')) return 'region-aunz';
  if (lo.includes('australia')) return 'region-au';
  if (lo.includes('new zealand')) return 'region-nz';
  return 'region-intl';
}

// ── Status badge ────────────────────────────────────
function statusBadge(s) {
  const map = {
    open:    ['status-open',    'Open'],
    rolling: ['status-rolling', 'Rolling'],
    annual:  ['status-annual',  'Annual'],
    ongoing: ['status-ongoing', 'Ongoing'],
    active:  ['status-open',    'Active'],
    check:   ['status-check',   'Check Site'],
  };
  const [cls, label] = map[s] || map.check;
  return `<span class="card-status ${cls}">${label}</span>`;
}

// ── Deadline urgency ────────────────────────────────
function deadlineClass(d) {
  if (!d) return '';
  const lo = d.toLowerCase();
  if (lo.includes('june') || lo.includes('july')) return 'deadline-urgent';
  if (lo.includes('august') || lo.includes('september')) return 'deadline-soon';
  return '';
}

// ── Tag builder ─────────────────────────────────────
function genreTags(genres) {
  if (!genres || !genres.length) return '';
  return genres.slice(0, 3).map(g => `<span class="tag tag-genre">${g}</span>`).join('');
}

// ── External link icon ──────────────────────────────
const extIcon = `<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// ═══════════════════════════════════════════════════
//  CARD RENDERERS (one per category)
// ═══════════════════════════════════════════════════

function renderSubmission(item) {
  return `
    <article class="card ${regionClass(item.region)}">
      <div class="card-top">
        <div>
          <div class="card-name">${item.name}</div>
          <div class="card-org">${item.org}</div>
        </div>
        ${statusBadge(item.status)}
      </div>
      <p class="card-desc">${item.desc}</p>
      <div class="card-tags">
        <span class="tag tag-region">${item.region}</span>
        <span class="tag tag-type">${item.type}</span>
        ${item.payment === 'Paid' ? '<span class="tag tag-fee">💰 Pays Writers</span>' : ''}
        ${item.fee === 'Free' ? '<span class="tag tag-fee">Free to Submit</span>' : `<span class="tag tag-cost">${item.fee}</span>`}
        ${genreTags(item.genres)}
      </div>
      <div class="card-meta">
        <div class="meta-item"><span class="meta-icon">📅</span><span class="meta-value ${deadlineClass(item.deadline)}">${item.deadline || 'Check site'}</span></div>
        <div class="meta-item"><span class="meta-icon">✍️</span><span class="meta-value">${item.payment || 'Unpaid'}</span></div>
      </div>
      <div class="card-footer">
        <div class="card-eligibility">👤 ${item.eligibility || 'Open to all'}</div>
        <a href="${item.url}" target="_blank" rel="noopener" class="card-link">Visit ${extIcon}</a>
      </div>
    </article>`;
}

function renderCompetition(item) {
  return `
    <article class="card ${regionClass(item.region)}">
      <div class="card-top">
        <div>
          <div class="card-name">${item.name}</div>
          <div class="card-org">${item.org}</div>
        </div>
        ${statusBadge(item.status)}
      </div>
      <p class="card-desc">${item.desc}</p>
      <div class="card-tags">
        <span class="tag tag-region">${item.region}</span>
        <span class="tag tag-type">${item.type}</span>
        ${item.fee === 'Free' ? '<span class="tag tag-fee">Free Entry</span>' : `<span class="tag tag-cost">${item.fee}</span>`}
        ${genreTags(item.genres)}
      </div>
      <div class="card-meta">
        <div class="meta-item"><span class="meta-icon">🏆</span><span class="meta-value">${item.prize || 'See site'}</span></div>
        <div class="meta-item"><span class="meta-icon">📅</span><span class="meta-value ${deadlineClass(item.deadline)}">${item.deadline || 'Check site'}</span></div>
      </div>
      <div class="card-footer">
        <div class="card-eligibility">👤 ${item.eligibility || 'Open to all'}</div>
        <a href="${item.url}" target="_blank" rel="noopener" class="card-link">Visit ${extIcon}</a>
      </div>
    </article>`;
}

function renderPrize(item) {
  return `
    <article class="card ${regionClass(item.region)}">
      <div class="card-top">
        <div>
          <div class="card-name">${item.name}</div>
          <div class="card-org">${item.org}</div>
        </div>
        ${statusBadge(item.status)}
      </div>
      <p class="card-desc">${item.desc}</p>
      <div class="card-tags">
        <span class="tag tag-region">${item.region}</span>
        <span class="tag tag-type">${item.entry || 'Direct entry'}</span>
        ${genreTags(item.genres)}
      </div>
      <div class="card-meta">
        <div class="meta-item"><span class="meta-icon">💰</span><span class="meta-value">${item.value || 'See site'}</span></div>
        <div class="meta-item"><span class="meta-icon">📅</span><span class="meta-value ${deadlineClass(item.deadline)}">${item.deadline || 'Check site'}</span></div>
      </div>
      <div class="card-footer">
        <div class="card-eligibility">👤 ${item.eligibility || 'Open to all'}</div>
        <a href="${item.url}" target="_blank" rel="noopener" class="card-link">Visit ${extIcon}</a>
      </div>
    </article>`;
}

function renderFellowship(item) {
  return `
    <article class="card ${regionClass(item.region)}">
      <div class="card-top">
        <div>
          <div class="card-name">${item.name}</div>
          <div class="card-org">${item.org}</div>
        </div>
        ${statusBadge(item.status)}
      </div>
      <p class="card-desc">${item.desc}</p>
      <div class="card-tags">
        <span class="tag tag-region">${item.region}</span>
        ${item.fee === 'Free' ? '<span class="tag tag-fee">Free to Apply</span>' : ''}
        ${genreTags(item.genres)}
      </div>
      <div class="card-meta">
        <div class="meta-item"><span class="meta-icon">💰</span><span class="meta-value">${item.value || 'See site'}</span></div>
        <div class="meta-item"><span class="meta-icon">⏱️</span><span class="meta-value">${item.duration || 'Varies'}</span></div>
        <div class="meta-item"><span class="meta-icon">📅</span><span class="meta-value ${deadlineClass(item.deadline)}">${item.deadline || 'Check site'}</span></div>
      </div>
      <div class="card-footer">
        <div class="card-eligibility">👤 ${item.eligibility || 'Open to all'}</div>
        <a href="${item.url}" target="_blank" rel="noopener" class="card-link">Visit ${extIcon}</a>
      </div>
    </article>`;
}

function renderResidency(item) {
  return `
    <article class="card ${regionClass(item.region)}">
      <div class="card-top">
        <div>
          <div class="card-name">${item.name}</div>
          <div class="card-org">${item.org}</div>
        </div>
        ${statusBadge(item.status)}
      </div>
      <p class="card-desc">${item.desc}</p>
      <div class="card-tags">
        <span class="tag tag-region">${item.region}</span>
        <span class="tag tag-type">📍 ${item.location || 'Various'}</span>
        ${item.fee === 'Free' ? '<span class="tag tag-fee">Free to Apply</span>' : ''}
        ${genreTags(item.genres)}
      </div>
      <div class="card-meta">
        <div class="meta-item"><span class="meta-icon">💰</span><span class="meta-value">${item.value || 'See site'}</span></div>
        <div class="meta-item"><span class="meta-icon">⏱️</span><span class="meta-value">${item.duration || 'Varies'}</span></div>
        <div class="meta-item"><span class="meta-icon">📅</span><span class="meta-value ${deadlineClass(item.deadline)}">${item.deadline || 'Check site'}</span></div>
      </div>
      <div class="card-footer">
        <div class="card-eligibility">👤 ${item.eligibility || 'Open to all'}</div>
        <a href="${item.url}" target="_blank" rel="noopener" class="card-link">Visit ${extIcon}</a>
      </div>
    </article>`;
}

function renderEducation(item) {
  return `
    <article class="card ${regionClass(item.region)}">
      <div class="card-top">
        <div>
          <div class="card-name">${item.name}</div>
          <div class="card-org">${item.org}</div>
        </div>
        ${statusBadge(item.status)}
      </div>
      <p class="card-desc">${item.desc}</p>
      <div class="card-tags">
        <span class="tag tag-region">${item.region}</span>
        <span class="tag tag-type">${item.format || 'Online'}</span>
        ${item.cost && item.cost.toLowerCase().includes('free') ? '<span class="tag tag-fee">Free to Audit</span>' : `<span class="tag tag-cost">${item.cost || 'See site'}</span>`}
        ${genreTags(item.genres)}
      </div>
      <div class="card-meta">
        <div class="meta-item"><span class="meta-icon">🎓</span><span class="meta-value">${item.level || 'All levels'}</span></div>
        <div class="meta-item"><span class="meta-icon">💻</span><span class="meta-value">${item.format || 'Online'}</span></div>
      </div>
      <div class="card-footer">
        <div class="card-eligibility">💰 ${item.cost || 'See site'}</div>
        <a href="${item.url}" target="_blank" rel="noopener" class="card-link">Visit ${extIcon}</a>
      </div>
    </article>`;
}

function renderJob(item) {
  return `
    <article class="card ${regionClass(item.region)}">
      <div class="card-top">
        <div>
          <div class="card-name">${item.name}</div>
          <div class="card-org">${item.org}</div>
        </div>
        ${statusBadge(item.status)}
      </div>
      <p class="card-desc">${item.desc}</p>
      <div class="card-tags">
        <span class="tag tag-region">${item.region}</span>
        <span class="tag tag-type">${item.jobType || 'Various'}</span>
        ${(item.types || []).slice(0, 2).map(t => `<span class="tag tag-genre">${t}</span>`).join('')}
      </div>
      <div class="card-meta">
        <div class="meta-item"><span class="meta-icon">💼</span><span class="meta-value">${item.jobType || 'Various'}</span></div>
      </div>
      <div class="card-footer">
        <div class="card-eligibility">📍 ${item.region}</div>
        <a href="${item.url}" target="_blank" rel="noopener" class="card-link">Visit ${extIcon}</a>
      </div>
    </article>`;
}

function renderPublisher(item) {
  const agentTag = item.agent
    ? '<span class="tag tag-cost">Agent Required</span>'
    : '<span class="tag tag-fee">No Agent Needed</span>';
  return `
    <article class="card ${regionClass(item.region)}">
      <div class="card-top">
        <div>
          <div class="card-name">${item.name}</div>
          <div class="card-org">${item.location || item.org}</div>
        </div>
        ${statusBadge(item.status)}
      </div>
      <p class="card-desc">${item.desc}</p>
      <div class="card-tags">
        <span class="tag tag-region">${item.region}</span>
        <span class="tag tag-type">${item.type || 'Publisher'}</span>
        ${agentTag}
        ${genreTags(item.genres)}
      </div>
      <div class="card-meta">
        <div class="meta-item"><span class="meta-icon">📬</span><span class="meta-value">${item.submission || 'Check site'}</span></div>
      </div>
      <div class="card-footer">
        <div class="card-eligibility">📍 ${item.location || item.region}</div>
        <a href="${item.url}" target="_blank" rel="noopener" class="card-link">Visit ${extIcon}</a>
      </div>
    </article>`;
}

function renderPaysWriters(item) {
  return `
    <article class="card ${regionClass(item.region)}">
      <div class="card-top">
        <div>
          <div class="card-name">${item.name}</div>
          <div class="card-org">${item.org}</div>
        </div>
        ${statusBadge(item.status)}
      </div>
      <p class="card-desc">${item.desc}</p>
      <div class="card-tags">
        <span class="tag tag-region">${item.region}</span>
        <span class="tag tag-type">${item.type}</span>
        <span class="tag tag-fee">💰 Pays Writers</span>
        ${item.fee === 'Free' ? '<span class="tag tag-fee">Free to Submit</span>' : `<span class="tag tag-cost">${item.fee}</span>`}
        ${genreTags(item.genres)}
      </div>
      <div class="card-meta">
        <div class="meta-item"><span class="meta-icon">💰</span><span class="meta-value">${item.payRate || 'See site'}</span></div>
        <div class="meta-item"><span class="meta-icon">📅</span><span class="meta-value ${deadlineClass(item.deadline)}">${item.deadline || 'Check site'}</span></div>
      </div>
      <div class="card-footer">
        <div class="card-eligibility">✍️ ${item.type}</div>
        <a href="${item.url}" target="_blank" rel="noopener" class="card-link">Visit ${extIcon}</a>
      </div>
    </article>`;
}

const renderers = {
  submissions:   renderSubmission,
  competitions:  renderCompetition,
  prizes:        renderPrize,
  fellowships:   renderFellowship,
  residencies:   renderResidency,
  education:     renderEducation,
  pays_writers:  renderPaysWriters,
  publishers:    renderPublisher,
};

// ═══════════════════════════════════════════════════
//  FILTER & RENDER
// ═══════════════════════════════════════════════════

function getItems() {
  return WG_DATA[state.currentCat] || [];
}

function matchesSearch(item, q) {
  if (!q) return true;
  const haystack = [item.name, item.org, item.desc, item.region,
    ...(item.genres || []), ...(item.types || [])].join(' ').toLowerCase();
  return haystack.includes(q.toLowerCase());
}

function matchesRegion(item) {
  if (!state.regions.length) return true;
  return state.regions.some(r => item.region && item.region.toLowerCase().includes(r.toLowerCase()));
}

function matchesGenre(item) {
  if (!state.genres.length) return true;
  const itemGenres = (item.genres || item.types || []).map(g => g.toLowerCase());
  return state.genres.some(g => itemGenres.includes(g.toLowerCase()));
}

function matchesToggle(item) {
  if (!state.toggles.length) return true;
  return state.toggles.every(t => {
    if (t === 'open')    return ['open','rolling','ongoing','active'].includes(item.status);
    if (t === 'free')    return item.fee === 'Free' || (item.cost && item.cost.toLowerCase().includes('free'));
    if (t === 'paid')    return item.payment === 'Paid' || (item.value && item.value.includes('$'));
    if (t === 'noagent') return item.agent === false || item.agent === undefined;
    return true;
  });
}

function sortItems(items) {
  const copy = [...items];
  if (state.sort === 'name') {
    copy.sort((a, b) => a.name.localeCompare(b.name));
  } else if (state.sort === 'deadline') {
    // Simple: items with 'June' or 'July' first
    const urgency = d => {
      if (!d) return 99;
      const lo = d.toLowerCase();
      if (lo.includes('june') || lo.includes('july')) return 1;
      if (lo.includes('august') || lo.includes('september')) return 2;
      if (lo.includes('october') || lo.includes('november')) return 3;
      return 5;
    };
    copy.sort((a, b) => urgency(a.deadline) - urgency(b.deadline));
  } else if (state.sort === 'value') {
    const val = v => {
      if (!v) return 0;
      const m = v.replace(/,/g, '').match(/[\d]+/);
      return m ? parseInt(m[0]) : 0;
    };
    copy.sort((a, b) => val(b.value || b.prize) - val(a.value || a.prize));
  }
  return copy;
}

function render() {
  const items = getItems();
  const filtered = items.filter(item =>
    matchesSearch(item, state.search) &&
    matchesRegion(item) &&
    matchesGenre(item) &&
    matchesToggle(item)
  );
  const sorted = sortItems(filtered);

  const renderer = renderers[state.currentCat];
  cardsGrid.innerHTML = sorted.map(renderer).join('');

  resultsCount.textContent = sorted.length;
  resultsLabel.textContent = sorted.length === 1 ? 'opportunity' : 'opportunities';

  emptyState.style.display = sorted.length === 0 ? 'block' : 'none';
  cardsGrid.style.display  = sorted.length === 0 ? 'none'  : 'grid';
}

// ═══════════════════════════════════════════════════
//  GENRE FILTER (dynamic per category)
// ═══════════════════════════════════════════════════

function buildGenreFilter() {
  const items = getItems();
  const allGenres = new Set();
  items.forEach(item => {
    (item.genres || item.types || []).forEach(g => allGenres.add(g));
  });
  const sorted = [...allGenres].sort();
  const container = document.getElementById('filter-genre');
  container.innerHTML = sorted.map(g => `
    <label class="check-item">
      <input type="checkbox" value="${g}" ${state.genres.includes(g) ? 'checked' : ''} />
      ${g}
    </label>`).join('');
  container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      state.genres = [...container.querySelectorAll('input:checked')].map(c => c.value);
      render();
    });
  });
}

// ═══════════════════════════════════════════════════
//  EVENT LISTENERS
// ═══════════════════════════════════════════════════

// Category tabs
catTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    catTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.currentCat = tab.dataset.cat;
    state.genres = [];
    buildGenreFilter();
    render();
  });
});

// Search
searchInput.addEventListener('input', e => {
  state.search = e.target.value;
  render();
});

// Region checkboxes
regionChecks.forEach(cb => {
  cb.addEventListener('change', () => {
    state.regions = [...document.querySelectorAll('#filter-region input:checked')].map(c => c.value);
    render();
  });
});

// Toggle buttons
toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    if (state.toggles.includes(f)) {
      state.toggles = state.toggles.filter(t => t !== f);
      btn.classList.remove('active');
    } else {
      state.toggles.push(f);
      btn.classList.add('active');
    }
    render();
  });
});

// Sort
sortSelect.addEventListener('change', e => {
  state.sort = e.target.value;
  render();
});

// Reset
function resetFilters() {
  state.search = '';
  state.regions = [];
  state.genres = [];
  state.toggles = [];
  state.sort = 'default';
  searchInput.value = '';
  sortSelect.value = 'default';
  regionChecks.forEach(cb => cb.checked = false);
  toggleBtns.forEach(btn => btn.classList.remove('active'));
  buildGenreFilter();
  render();
}
btnReset.addEventListener('click', resetFilters);
btnEmptyReset.addEventListener('click', resetFilters);

// Scroll header shadow
window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 10);
});

// Hamburger
hamburger.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

// Newsletter form
nlForm.addEventListener('submit', e => {
  e.preventDefault();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = '🐾 You\'re on the list! First newsletter coming soon.';
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
  nlForm.reset();
});

// Footer tab links
window.switchTab = function(cat) {
  if (cat === 'jobs') cat = 'pays_writers';
  catTabs.forEach(t => t.classList.remove('active'));
  const tab = document.querySelector(`.cat-tab[data-cat="${cat}"]`);
  if (tab) tab.classList.add('active');
  state.currentCat = cat;
  state.genres = [];
  buildGenreFilter();
  render();
};

// ═══════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════
buildGenreFilter();
render();
