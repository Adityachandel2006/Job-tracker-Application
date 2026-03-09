import { useEffect } from 'react';
import './TrackerPage.css';

// Raw HTML from original index.html <body>, with login/profile links pointed to React routes
// and asset paths pointing to /public files.
const trackerHtml = `
  <nav class="nav">
    <div class="nav-inner">
      <div class="brand" style="gap:24px;">
        <div class="logo-img">
          <img src="/track.png" alt="JobHound Logo">
        </div>
        <span class="brand-text">
          JobHound
        </span>
      </div>
      
      <div class="nav-collapse" id="navCollapse">
        <div class="nav-links" style="gap:24px;">
          <a href="#home">Home</a>
          <a href="#tracker">Tracker</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#faq">FAQ</a>
        </div>
        <div class="actions" style="gap:16px;">
          <button id="exportBtn" title="Export CSV" class="btn btn-ghost">Export</button>
          <label class="btn btn-ghost" for="importFile" title="Import CSV">Import</label>
          <input id="importFile" type="file" accept=".csv" hidden />
          <button id="newBtn" class="btn btn-primary">+ New</button>
  
          <a href="/login" id="loginBtn" class="btn btn-ghost">Login</a>
          
          <a href="/profile" id="profileBtn" title="View Profile" style="display: none; align-items: center; justify-content: center;">
            <img src="/profile icon.jpg" alt="Profile" style="
              width: 54px; 
              height: 54px; 
              border-radius: 50%; 
              object-fit: cover; 
              border: 2px solid var(--brand);
              cursor: pointer;
            ">
          </a>
        </div>
      </div>
      
      <button id="menuToggle" class="btn btn-ghost menu-toggle">☰</button>

    </div>
  </nav>

  <section id="home" class="container">
    <div class="hero">
      <div>
        <h1>Track every application. <br/>Land your next offer.</h1>
        <p>All-in-one job application tracker with powerful filters, Kanban view, and a live dashboard. Designed for placements and portfolio showcases. Your data never leaves your browser.</p>
        <div class="badges">
          <span class="badge">LocalStorage</span>
          <span class="badge">CSV Export/Import</span>
          <span class="badge">Kanban + Table</span>
          <span class="badge">Dark / Light</span>
          <span class="badge">Keyboard Shortcuts</span>
        </div>
        <div style="margin-top:18px; display:flex; gap:10px; flex-wrap:wrap">
          <a href="#tracker" class="btn btn-primary">Open Tracker</a>
          <a href="#dashboard" class="btn btn-ghost">View Dashboard</a>
        </div>
      </div>
      <div class="card">
        <div class="stats">
          <div class="stat"><div class="n" id="statTotal">0</div><div class="subtle">Total</div></div>
          <div class="stat"><div class="n" id="statInterviews">0</div><div class="subtle">Interviews</div></div>
          <div class="stat"><div class="n" id="statOffers">0</div><div class="subtle">Offers</div></div>
          <div class="stat"><div class="n" id="statApplied">0</div><div class="subtle">Applied</div></div>
          <div class="stat"><div class="n" id="statRejected">0</div><div class="subtle">Rejected</div></div>
          <div class="stat"><div class="n" id="statThisMonth">0</div><div class="subtle">This month</div></div>
        </div>
        <p class="help">Tip: Press <b>N</b> to add a new application, <b>/</b> to search, and <b>?</b> for help.
        </p>
      </div>
    </div>
  </section>

  <section id="tracker" class="container">
    <h2 style="margin:0 0 10px">Tracker</h2>
    <div class="panel">
      <div class="toolbar">
        <input id="q" class="input" placeholder="Search company, role, tags, notes ( / )" />
        <select id="filterStatus">
          <option value="">All Status</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <select id="filterSort">
          <option value="appliedAt_desc">Newest</option>
          <option value="appliedAt_asc">Oldest</option>
          <option value="deadline_asc">Closest deadline</option>
          <option value="priority_desc">Highest priority</option>
        </select>
        <input id="filterTag" class="input" placeholder="Tag filter (e.g. campus, SDE, fintech)" />
        <button id="clearFilters" class="btn btn-ghost">Clear</button>
        <div style="margin-left:auto"></div>
        <button id="newBtn2" class="btn btn-primary">+ New</button>
      </div>

      <div id="tableView">
        <table class="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Deadline</th>
              <th>Location</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="rows"></tbody>
        </table>
        <div id="emptyTable" class="empty" style="display:none">No applications match your filters.</div>
      </div>

      <div id="kanbanView" style="display:none">
        <div class="kanban">
          <div class="col" data-col="Applied"><h4>Applied</h4><div class="list" id="colApplied"></div></div>
          <div class="col" data-col="Interview"><h4>Interview</h4><div class="list" id="colInterview"></div></div>
          <div class="col" data-col="Offer"><h4>Offer</h4><div class="list" id="colOffer"></div></div>
          <div class="col" data-col="Rejected"><h4>Rejected</h4><div class="list" id="colRejected"></div></div>
        </div>
      </div>
    </div>
  </section>

  <section id="dashboard" class="container">
    <h2 style="margin:0 0 10px">Dashboard</h2>
    <div class="grid-2">
      <div class="panel">
        <canvas id="chartTimeline" height="220"></canvas>
      </div>
      <div class="panel">
        <canvas id="chartBreakdown" height="220"></canvas>
      </div>
    </div>
    <div class="metrics" style="margin-top:14px">
      <div class="metric"><div class="n" id="mTotal">0</div><div class="subtle">Total Applications</div></div>
      <div class="metric"><div class="n" id="mInterview">0</div><div class="subtle">Interviews</div></div>
      <div class="metric"><div class="n" id="mOffer">0</div><div class="subtle">Offers</div></div>
      <div class="metric"><div class="n" id="mRejected">0</div><div class="subtle">Rejected</div></div>
    </div>
  </section>

  <section id="faq" class="container">
    <h2 style="margin:0 0 10px">FAQ & Shortcuts</h2>
    <div class="panel">
      <ul>
        <li><b>/</b> — Focus search</li>
        <li><b>K</b> — Toggle Kanban/Table</li>
        <li>Your data stays in your browser (LocalStorage). Use Export to back up / share as CSV.</li>
      </ul>
    </div>
    <div class="footer">© <span id="yyyy"></span> JobTrack Pro • Designed for placements and portfolios</div>
  </section>

  <div id="modal" class="modal" aria-hidden="true" role="dialog">
    <div class="sheet">
      <h3 id="modalTitle">Add Application</h3>
      <div class="grid" style="margin-top:10px">
        <div class="grid-1">
          <label>Company<input id="fCompany" class="input" placeholder="e.g., Google"/></label>
          <label>Role<input id="fRole" class="input" placeholder="e.g., SDE Intern"/></label>
          <label>Location<input id="fLocation" class="input" placeholder="e.g., Bengaluru, Remote"/></label>
          <label>Link<input id="fLink" class="input" placeholder="e.g., careers page URL"/></label>
        </div>
        <div class="grid-1">
          <label>Status<select id="fStatus" class="input">
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select></label>
          <label>Applied Date<input id="fAppliedAt" class="input" type="date"/></label>
          <label>Deadline<input id="fDeadline" class="input" type="date"/></label>
          <label>Priority<select id="fPriority" class="input">
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select></label>
        </div>
      </div>
      <label style="display:block; margin-top:10px">Tags (comma-separated)
        <input id="fTags" class="input" placeholder="e.g., campus, SDE, fintech"/>
      </label>
      <label style="display:block; margin-top:10px">Notes
        <textarea id="fNotes" class="input" rows="3" placeholder="Add preparation notes, contacts, etc."></textarea>
      </label>
      <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:12px">
        <button id="deleteBtn" class="btn btn-ghost" style="display:none">Delete</button>
        <button id="closeModal" class="btn btn-ghost">Cancel</button>
        <button id="saveModal" class="btn btn-primary">Save</button>
      </div>
      <div class="help">Pro tip: paste a URL in <b>Link</b> and click it in the table to open directly.</div>
    </div>
  </div>

  <div id="toast" style="position:fixed; bottom:20px; left:50%; transform: translateX(-50%) translateY(20px); opacity:0; transition:.3s; background: var(--card); border:1px solid rgba(255,255,255,.14); color:var(--text); padding:10px 14px; border-radius:12px; z-index:80; box-shadow:var(--shadow)">Saved</div>
`;

export default function TrackerPage() {
  useEffect(() => {
    // --------- Utilities ---------
    const $ = (sel) => document.querySelector(sel);
    const $all = (sel) => Array.from(document.querySelectorAll(sel));
    const fmt = (d) => (d ? new Date(d).toLocaleDateString() : '');
    const todayStr = () => new Date().toISOString().slice(0, 10);
    const uuid = () =>
      crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2);

    const pastDate = (monthsAgo) => {
      const d = new Date();
      d.setMonth(d.getMonth() - monthsAgo);
      return d.toISOString().slice(0, 10);
    };

    // --------- State (per-user storage) ---------
    const LS_PREFIX = 'jobtrack_pro_v1';
    const SESSION_KEY = 'jobHoundSession';
    const sessionRaw = localStorage.getItem(SESSION_KEY);
    let sessionUser = null;
    try {
      sessionUser = sessionRaw ? JSON.parse(sessionRaw) : null;
    } catch (e) {
      sessionUser = null;
    }
    const currentEmail = sessionUser && sessionUser.email ? sessionUser.email : 'default';
    const LS_KEY = `${LS_PREFIX}_${currentEmail}`;

    // Load jobs for this user; if none yet, migrate from legacy global key once
    let jobs = [];
    const storedForUser = localStorage.getItem(LS_KEY);
    if (storedForUser) {
      jobs = JSON.parse(storedForUser || '[]');
    } else {
      const legacy = localStorage.getItem(LS_PREFIX);
      jobs = JSON.parse(legacy || '[]');
      if (jobs.length) {
        localStorage.setItem(LS_KEY, JSON.stringify(jobs));
        localStorage.removeItem(LS_PREFIX);
      }
    }

    let editingId = null;
    const save = () => {
      localStorage.setItem(LS_KEY, JSON.stringify(jobs));
      refresh();
      toast('Saved');
    };
    const toast = (msg) => {
      const t = $('#toast');
      if (!t) return;
      t.textContent = msg;
      t.style.opacity = 1;
      t.style.transform = 'translateX(-50%) translateY(0)';
      setTimeout(() => {
        t.style.opacity = 0;
        t.style.transform = 'translateX(-50%) translateY(20px)';
      }, 1400);
    };

    // --------- Theme ---------
    const THEME_KEY = 'jobtrack_theme';
    const setTheme = (mode) => {
      document.documentElement.classList.toggle('light', mode === 'light');
      localStorage.setItem(THEME_KEY, mode);
    };
    const initTheme = () => {
      const pref =
        localStorage.getItem(THEME_KEY) ||
        (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      setTheme(pref);
    };

    // --------- Filters / View ---------
    const state = {
      q: '',
      status: '',
      sort: 'appliedAt_desc',
      tag: '',
      view: localStorage.getItem('jobtrack_view') || 'table',
    };

    // --------- Access Control ---------
    function checkAccess() {
      if (!sessionUser) {
        alert('You must be logged in to view the tracker.');
        window.location.href = '/login';
      }
    }

    // --------- Login/Profile UI ---------
    function checkLoginStatus() {
      const session = localStorage.getItem('jobHoundSession');
      const loginBtn = $('#loginBtn');
      const profileBtn = $('#profileBtn');

      if (!loginBtn || !profileBtn) return;

      if (session) {
        profileBtn.style.display = 'inline-flex';
        loginBtn.style.display = 'none';
      } else {
        loginBtn.style.display = 'inline-flex';
        profileBtn.style.display = 'none';
      }
    }

    // --------- Rendering: Table ---------
    function clsStatus(s) {
      return (
        {
          Applied: 'applied',
          Interview: 'interview',
          Offer: 'offer',
          Rejected: 'rejected',
        }[s] || 'applied'
      );
    }

    function renderTable() {
      const body = $('#rows');
      if (!body) return;
      body.innerHTML = '';
      const filtered = applyFilters(jobs);
      const empty = $('#emptyTable');
      if (!filtered.length) {
        if (empty) empty.style.display = 'block';
        return;
      }
      if (empty) empty.style.display = 'none';
      for (const j of filtered) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><a href="${j.link || '#'}" target="_blank" rel="noopener" style="font-weight:700">${j.company}</a></td>
          <td>${j.role}</td>
          <td><span class="pill ${clsStatus(j.status)}">${j.status}</span></td>
          <td>${fmt(j.appliedAt)}</td>
          <td>${fmt(j.deadline)}</td>
          <td>${j.location || ''}</td>
          <td>${(j.tags || []).join(', ')}</td>
          <td class="row-actions">
            <button class="btn btn-ghost" onclick="openEdit('${j.id}')">Edit</button>
            <button class="btn btn-ghost" onclick="quickMove('${j.id}')">Move →</button>
          </td>`;
        body.appendChild(tr);
      }
    }

    // --------- Rendering: Kanban ---------
    function renderKanban() {
      const data = applyFilters(jobs);
      const cols = {
        Applied: $('#colApplied'),
        Interview: $('#colInterview'),
        Offer: $('#colOffer'),
        Rejected: $('#colRejected'),
      };
      Object.values(cols).forEach((c) => {
        if (c) c.innerHTML = '';
      });
      for (const j of data) {
        const el = document.createElement('div');
        el.className = 'card-job';
        el.draggable = true;
        el.dataset.id = j.id;
        el.innerHTML = `<div class="title">${j.company} — ${j.role}</div>
                        <div class="meta">${fmt(j.appliedAt)} · ${(j.tags || []).join(', ')}</div>`;
        el.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', j.id);
        });
        const col = cols[j.status];
        if (col) col.appendChild(el);
      }
    }

    // Drag & drop targets
    $all('.col').forEach((col) => {
      col.addEventListener('dragover', (e) => e.preventDefault());
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const j = jobs.find((x) => x.id === id);
        if (j) {
          j.status = col.dataset.col;
          save();
        }
      });
    });

    // --------- Filters & Search ---------
    function applyFilters(arr) {
      const q = state.q.toLowerCase().trim();
      const t = state.tag.toLowerCase().trim();
      let res = arr.filter((j) => {
        const hay = [
          j.company,
          j.role,
          j.notes,
          (j.tags || []).join(' '),
          j.location,
        ]
          .join(' ')
          .toLowerCase();
        const okQ = !q || hay.includes(q);
        const okS = !state.status || j.status === state.status;
        const okT = !t || (j.tags || []).some((x) => x.toLowerCase().includes(t));
        return okQ && okS && okT;
      });
      const [field, dir] = state.sort.split('_');
      res.sort((a, b) => {
        if (field === 'deadline') return cmpDate(a.deadline, b.deadline, dir === 'asc');
        if (field === 'priority')
          return dir === 'asc'
            ? (a.priority || 1) - (b.priority || 1)
            : (b.priority || 1) - (a.priority || 1);
        return cmpDate(a.appliedAt, b.appliedAt, dir === 'asc');
      });
      return res;
    }

    function cmpDate(a, b, asc) {
      const na = a ? new Date(a).getTime() : 9e15;
      const nb = b ? new Date(b).getTime() : 9e15;
      return asc ? na - nb : nb - na;
    }

    // --------- Modal ---------
    function fillForm(j) {
      $('#fCompany').value = j.company || '';
      $('#fRole').value = j.role || '';
      $('#fLocation').value = j.location || '';
      $('#fLink').value = j.link || '';
      $('#fStatus').value = j.status || 'Applied';
      $('#fAppliedAt').value = j.appliedAt || '';
      $('#fDeadline').value = j.deadline || '';
      $('#fPriority').value = j.priority || 2;
      $('#fTags').value = (j.tags || []).join(', ');
      $('#fNotes').value = j.notes || '';
    }

    function readForm() {
      return {
        id: editingId || uuid(),
        company: $('#fCompany').value.trim(),
        role: $('#fRole').value.trim(),
        location: $('#fLocation').value.trim(),
        link: $('#fLink').value.trim(),
        status: $('#fStatus').value,
        appliedAt: $('#fAppliedAt').value,
        deadline: $('#fDeadline').value,
        priority: parseInt($('#fPriority').value || '2', 10),
        tags: $('#fTags')
          .value.split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        notes: $('#fNotes').value.trim(),
      };
    }

    function showModal(v) {
      const m = $('#modal');
      if (!m) return;
      m.style.display = v ? 'flex' : 'none';
      m.setAttribute('aria-hidden', v ? 'false' : 'true');
      if (v) $('#fCompany').focus();
    }

    function openNew() {
      editingId = null;
      $('#modalTitle').textContent = 'Add Application';
      $('#deleteBtn').style.display = 'none';
      fillForm({ appliedAt: todayStr(), status: 'Applied', priority: 2 });
      showModal(true);
    }

    function openEdit(id) {
      const j = jobs.find((x) => x.id === id);
      if (!j) return;
      editingId = id;
      $('#modalTitle').textContent = 'Edit Application';
      $('#deleteBtn').style.display = 'inline-flex';
      fillForm(j);
      showModal(true);
    }

    function saveForm() {
      const j = readForm();
      if (!j.company || !j.role) {
        alert('Company and Role are required');
        return;
      }
      const idx = jobs.findIndex((x) => x.id === j.id);
      if (idx >= 0) jobs[idx] = j;
      else jobs.push(j);
      save();
      showModal(false);
    }

    function deleteCurrent() {
      if (!editingId) return;
      if (confirm('Delete this application?')) {
        jobs = jobs.filter((x) => x.id !== editingId);
        save();
        showModal(false);
      }
    }

    function quickMove(id) {
      const order = ['Applied', 'Interview', 'Offer', 'Rejected'];
      const j = jobs.find((x) => x.id === id);
      if (!j) return;
      const i = order.indexOf(j.status);
      j.status = order[(i + 1) % order.length];
      save();
    }

    // --------- Export / Import ---------
    function toCSV(arr) {
      const header = [
        'id',
        'company',
        'role',
        'status',
        'appliedAt',
        'deadline',
        'location',
        'tags',
        'link',
        'priority',
        'notes',
      ];
      const lines = [header.join(',')];
      for (const j of arr) {
        const row = [
          j.id,
          j.company,
          j.role,
          j.status,
          j.appliedAt || '',
          j.deadline || '',
          j.location || '',
          (j.tags || []).join('|'),
          j.link || '',
          j.priority || '',
          (j.notes || '').replaceAll('\n', '\\n'),
        ].map((v) => '"' + String(v).replaceAll('"', '""') + '"');
        lines.push(row.join(','));
      }
      return lines.join('\n');
    }

    function download(filename, text) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    }

    function exportCSV() {
      download('jobtrack.csv', toCSV(jobs));
    }

    function parseCSVLine(line) {
      const res = [];
      let cur = '';
      let inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQ) {
          if (ch === '"' && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else if (ch === '"') {
            inQ = false;
          } else {
            cur += ch;
          }
        } else {
          if (ch === ',') {
            res.push(cur);
            cur = '';
          } else if (ch === '"') {
            inQ = true;
          } else {
            cur += ch;
          }
        }
      }
      res.push(cur);
      return res;
    }

    function mergeById(a, b) {
      const map = new Map(a.map((x) => [x.id, x]));
      for (const j of b) {
        map.set(j.id, j);
      }
      return Array.from(map.values());
    }

    function importCSV(file) {
      const reader = new FileReader();
      reader.onload = () => {
        const lines = reader.result.split(/\r?\n/).filter(Boolean);
        const header = lines
          .shift()
          .split(',')
          .map((h) => h.replaceAll('"', '').trim());
        const idx = (name) => header.indexOf(name);
        const out = [];
        for (const line of lines) {
          const cols = parseCSVLine(line);
          const obj = {
            id: uuid(),
            company: cols[idx('company')] || '',
            role: cols[idx('role')] || '',
            status: cols[idx('status')] || 'Applied',
            appliedAt: cols[idx('appliedAt')] || '',
            deadline: cols[idx('deadline')] || '',
            location: cols[idx('location')] || '',
            tags: (cols[idx('tags')] || '').split('|').filter(Boolean),
            link: cols[idx('link')] || '',
            priority: parseInt(cols[idx('priority')] || '2', 10),
            notes: (cols[idx('notes')] || '').replaceAll('\\n', '\n'),
          };
          out.push(obj);
        }
        jobs = mergeById(jobs, out);
        save();
        toast('Imported');
      };
      reader.readAsText(file);
    }

    // --------- Dashboard / Stats ---------
    let chart1;
    let chart2;

    function aggregateByMonth(arr) {
      const map = new Map();
      for (const j of arr) {
        if (!j.appliedAt) continue;
        const d = new Date(j.appliedAt);
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        map.set(k, (map.get(k) || 0) + 1);
      }
      return Object.fromEntries(
        Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
      );
    }

    function refreshStats() {
      const total = jobs.length;
      const c = (s) => jobs.filter((j) => j.status === s).length;
      const thisMonth = jobs.filter((j) => {
        if (!j.appliedAt) return false;
        const d = new Date(j.appliedAt);
        const now = new Date();
        return (
          d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        );
      }).length;

      const statTotal = $('#statTotal');
      const statInterviews = $('#statInterviews');
      const statOffers = $('#statOffers');
      const statApplied = $('#statApplied');
      const statRejected = $('#statRejected');
      const statThisMonth = $('#statThisMonth');
      const mTotal = $('#mTotal');
      const mInterview = $('#mInterview');
      const mOffer = $('#mOffer');
      const mRejected = $('#mRejected');

      if (statTotal) statTotal.textContent = total;
      if (statInterviews) statInterviews.textContent = c('Interview');
      if (statOffers) statOffers.textContent = c('Offer');
      if (statApplied) statApplied.textContent = c('Applied');
      if (statRejected) statRejected.textContent = c('Rejected');
      if (statThisMonth) statThisMonth.textContent = thisMonth;
      if (mTotal) mTotal.textContent = total;
      if (mInterview) mInterview.textContent = c('Interview');
      if (mOffer) mOffer.textContent = c('Offer');
      if (mRejected) mRejected.textContent = c('Rejected');

      const byMonth = aggregateByMonth(jobs);
      const labels = Object.keys(byMonth);
      const vals = Object.values(byMonth);

      const chartColors = {
        main: document.documentElement.classList.contains('light')
          ? '#0d1222'
          : '#ecf1ff',
        grid: document.documentElement.classList.contains('light')
          ? '#eef0f6'
          : 'rgba(255,255,255,.12)',
        brand: '#7c5cff',
        applied: 'rgba(124,92,255,1)',
        interview: 'rgba(0,210,255,1)',
        offer: 'rgba(34,197,94,1)',
        rejected: 'rgba(239,68,68,1)',
        appliedBg: 'rgba(124,92,255,.15)',
        interviewBg: 'rgba(0,210,255,.15)',
        offerBg: 'rgba(34,197,94,.15)',
        rejectedBg: 'rgba(239,68,68,.15)',
      };

      if (window.Chart) {
        const canvas1 = $('#chartTimeline');
        if (canvas1) {
          // Destroy any existing chart on this canvas (handles React dev double-mount and remounts)
          const existing1 = window.Chart.getChart(canvas1);
          if (existing1) existing1.destroy();

          chart1 = new window.Chart(canvas1, {
            type: 'line',
            data: {
              labels,
              datasets: [
                {
                  label: 'Applications',
                  data: vals,
                  tension: 0.3,
                  fill: false,
                  borderColor: chartColors.brand,
                  pointBackgroundColor: chartColors.brand,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: {
                  grid: { color: chartColors.grid },
                  ticks: { color: chartColors.main },
                },
                y: {
                  beginAtZero: true,
                  grid: { color: chartColors.grid },
                  ticks: { color: chartColors.main, stepSize: 1 },
                },
              },
            },
          });
        }

        const canvas2 = $('#chartBreakdown');
        if (canvas2) {
          const existing2 = window.Chart.getChart(canvas2);
          if (existing2) existing2.destroy();

          chart2 = new window.Chart(canvas2, {
            type: 'doughnut',
            data: {
              labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
              datasets: [
                {
                  data: [c('Applied'), c('Interview'), c('Offer'), c('Rejected')],
                  backgroundColor: [
                    chartColors.appliedBg,
                    chartColors.interviewBg,
                    chartColors.offerBg,
                    chartColors.rejectedBg,
                  ],
                  borderColor: [
                    chartColors.applied,
                    chartColors.interview,
                    chartColors.offer,
                    chartColors.rejected,
                  ],
                  borderWidth: 1.5,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: chartColors.main },
                },
              },
            },
          });
        }
      }
    }

    function refresh() {
      const kanbanView = $('#kanbanView');
      const tableView = $('#tableView');
      if (state.view === 'kanban') {
        if (kanbanView) kanbanView.style.display = 'block';
        if (tableView) tableView.style.display = 'none';
        renderKanban();
      } else {
        if (kanbanView) kanbanView.style.display = 'none';
        if (tableView) tableView.style.display = 'block';
        renderTable();
      }
      refreshStats();
    }

    function seed() {
      if (jobs.length) return;
      jobs = [
        {
          id: uuid(),
          company: 'Acme Corp',
          role: 'SDE Intern',
          status: 'Applied',
          appliedAt: pastDate(3),
          deadline: '',
          location: 'Remote',
          tags: ['campus', 'SDE'],
          link: '',
          priority: 3,
          notes: 'Referred by senior.',
        },
        {
          id: uuid(),
          company: 'FinX',
          role: 'Data Analyst',
          status: 'Interview',
          appliedAt: pastDate(2),
          deadline: '',
          location: 'Mumbai',
          tags: ['fintech'],
          link: '',
          priority: 2,
          notes: 'Round 1 cleared.',
        },
        {
          id: uuid(),
          company: 'Healthify',
          role: 'Frontend Dev',
          status: 'Offer',
          appliedAt: pastDate(1),
          deadline: '',
          location: 'Bengaluru',
          tags: ['react'],
          link: '',
          priority: 3,
          notes: 'Offer pending negotiation.',
        },
        {
          id: uuid(),
          company: 'DevZ',
          role: 'Backend Intern',
          status: 'Applied',
          appliedAt: pastDate(2),
          deadline: '',
          location: 'Remote',
          tags: ['python', 'django'],
          link: '',
          priority: 2,
          notes: '',
        },
        {
          id: uuid(),
          company: 'DataCo',
          role: 'Data Science',
          status: 'Rejected',
          appliedAt: pastDate(1),
          deadline: '',
          location: 'Bengaluru',
          tags: ['ML'],
          link: '',
          priority: 1,
          notes: 'Online assessment failed.',
        },
        {
          id: uuid(),
          company: 'StartUpX',
          role: 'Full Stack',
          status: 'Applied',
          appliedAt: todayStr(),
          deadline: '',
          location: 'Remote',
          tags: ['react', 'node'],
          link: '',
          priority: 3,
          notes: 'New application.',
        },
      ];
      save();
    }

    // ===== Init (equivalent to DOMContentLoaded handler) =====
    checkAccess();
    initTheme();
    checkLoginStatus();
    const yearSpan = $('#yyyy');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    seed();

    const menuToggle = $('#menuToggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        const navCollapse = $('#navCollapse');
        if (navCollapse) navCollapse.classList.toggle('active');
      });
    }

    $all('#navCollapse a').forEach((link) => {
      link.addEventListener('click', () => {
        const navCollapse = $('#navCollapse');
        if (navCollapse) navCollapse.classList.remove('active');
      });
    });

    const qInput = $('#q');
    const filterStatus = $('#filterStatus');
    const filterSort = $('#filterSort');
    const filterTag = $('#filterTag');
    const clearFilters = $('#clearFilters');
    const toggleViewBtn = $('#toggleView');
    const newBtn = $('#newBtn');
    const newBtn2 = $('#newBtn2');
    const closeModalBtn = $('#closeModal');
    const saveModalBtn = $('#saveModal');
    const deleteBtn = $('#deleteBtn');
    const exportBtn = $('#exportBtn');
    const importFile = $('#importFile');
    const modeToggle = $('#modeToggle');

    if (qInput)
      qInput.addEventListener('input', (e) => {
        state.q = e.target.value;
        refresh();
      });
    if (filterStatus)
      filterStatus.addEventListener('change', (e) => {
        state.status = e.target.value;
        refresh();
      });
    if (filterSort)
      filterSort.addEventListener('change', (e) => {
        state.sort = e.target.value;
        refresh();
      });
    if (filterTag)
      filterTag.addEventListener('input', (e) => {
        state.tag = e.target.value;
        refresh();
      });
    if (clearFilters)
      clearFilters.addEventListener('click', () => {
        state.q = '';
        state.status = '';
        state.sort = 'appliedAt_desc';
        state.tag = '';
        if (qInput) qInput.value = '';
        if (filterStatus) filterStatus.value = '';
        if (filterSort) filterSort.value = 'appliedAt_desc';
        if (filterTag) filterTag.value = '';
        refresh();
      });

    const applyView = () => {
      localStorage.setItem('jobtrack_view', state.view);
      refresh();
      if (toggleViewBtn)
        toggleViewBtn.textContent = state.view === 'kanban' ? 'Table' : 'Kanban';
    };

    if (toggleViewBtn)
      toggleViewBtn.addEventListener('click', () => {
        state.view = state.view === 'kanban' ? 'table' : 'kanban';
        applyView();
      });

    if (newBtn) newBtn.addEventListener('click', openNew);
    if (newBtn2) newBtn2.addEventListener('click', openNew);

    if (closeModalBtn)
      closeModalBtn.addEventListener('click', () => showModal(false));
    if (saveModalBtn) saveModalBtn.addEventListener('click', saveForm);
    if (deleteBtn) deleteBtn.addEventListener('click', deleteCurrent);

    if (exportBtn) exportBtn.addEventListener('click', exportCSV);
    if (importFile)
      importFile.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) importCSV(file);
        e.target.value = '';
      });

    if (modeToggle)
      modeToggle.addEventListener('click', () => {
        const next = document.documentElement.classList.contains('light')
          ? 'dark'
          : 'light';
        setTheme(next);
        refreshStats();
      });

    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        if (qInput) qInput.focus();
      }
      // if (e.key === 'n' || e.key === 'N') {
      //   openNew();
      // }
      if (e.key === 'k' || e.key === 'K') {
        state.view = state.view === 'kanban' ? 'table' : 'kanban';
        applyView();
      }
      if (e.key === '?') {
        alert('Shortcuts:\nN = New application\n/ = Search\nK = Toggle Kanban/Table');
      }
    });

    refresh();

    // expose for inline handlers
    window.openEdit = openEdit;
    window.quickMove = quickMove;
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: trackerHtml }} />;
}