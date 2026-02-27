const API = 'http://localhost:3000';
let selectedStatus = 'Present';

// Set today's date by default
document.getElementById('f-date').valueAsDate = new Date();

function setStatus(status, btn) {
  selectedStatus = status;
  document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

async function markAttendance() {
  const name    = document.getElementById('f-name').value.trim();
  const roll    = document.getElementById('f-roll').value.trim();
  const subject = document.getElementById('f-subject').value.trim();
  const date    = document.getElementById('f-date').value;

  if (!name || !roll || !subject || !date) {
    toast('Please fill in all fields!', 'err'); return;
  }

  const payload = { name, roll, subject, date, status: selectedStatus };

  try {
    const res = await fetch(`${API}/addAttendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error();
    toast('Attendance marked!', 'ok');
    document.getElementById('f-name').value = '';
    document.getElementById('f-roll').value = '';
    loadRecords();
  } catch {
    toast('Backend not connected — demo mode', 'err');
    // Demo fallback
    demoRecords.unshift({ id: Date.now(), ...payload });
    renderRecords(demoRecords);
  }
}

async function loadRecords() {
  try {
    const res = await fetch(`${API}/getAttendance`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error();
    const data = await res.json();
    renderRecords(data);
  } catch {
    renderRecords(demoRecords);
  }
}

async function deleteRecord(id) {
  try {
    await fetch(`${API}/deleteAttendance/${id}`, { method: 'DELETE' });
    toast('Record deleted', 'ok');
    loadRecords();
  } catch {
    demoRecords = demoRecords.filter(r => r.id !== id);
    renderRecords(demoRecords);
    toast('Deleted (demo)', 'ok');
  }
}

function renderRecords(data) {
  const el = document.getElementById('records-list');
  document.getElementById('count-badge').textContent = `${data.length} entries`;

  if (data.length === 0) {
    el.innerHTML = '<div class="empty">No records yet. Mark some attendance!</div>';
    return;
  }

  el.innerHTML = data.map(r => `
    <div class="record-row">
      <div class="avatar">${r.name.charAt(0).toUpperCase()}</div>
      <div class="record-info">
        <div class="record-name">${r.name} <span style="color:#64748b;font-weight:400;font-size:.75rem">${r.roll}</span></div>
        <div class="record-meta">${r.subject} • ${r.date}</div>
      </div>
      <span class="status-pill pill-${r.status.toLowerCase()}">${r.status}</span>
      <button class="btn-del" onclick="deleteRecord(${r.id})" title="Delete">✕</button>
    </div>
  `).join('');
}

function toast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2800);
}

// Demo data fallback
let demoRecords = [
  { id:1, name:'Ganesh', roll:'21CS045', subject:'DBMS', date:'2026-02-18', status:'Present' },
  { id:2, name:'Priya',  roll:'21CS032', subject:'DBMS', date:'2026-02-18', status:'Absent'  },
  { id:3, name:'Ravi',   roll:'21CS018', subject:'DBMS', date:'2026-02-18', status:'Late'    },
];

loadRecords();
