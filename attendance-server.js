// Attendance System Backend
// npm install express mysql2 cors
// node attendance-server.js

const express = require('express');
const mysql   = require('mysql2');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ganesh@216',  // ← change this
  database: 'attendancedb'
});

db.connect(err => {
  if (err) { console.error('❌ DB Error:', err.message); process.exit(1); }
  console.log('✅ MySQL connected');
});

// GET all records
app.get('/getAttendance', (req, res) => {
  db.query('SELECT * FROM attendance ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST mark attendance
app.post('/addAttendance', (req, res) => {
  const { name, roll, subject, date, status } = req.body;
  if (!name || !roll || !subject || !date || !status)
    return res.status(400).json({ error: 'All fields required' });

  db.query(
    'INSERT INTO attendance (name, roll, subject, date, status) VALUES (?,?,?,?,?)',
    [name, roll, subject, date, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Marked', id: result.insertId });
    }
  );
});

// DELETE a record
app.delete('/deleteAttendance/:id', (req, res) => {
  db.query('DELETE FROM attendance WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted' });
  });
});

app.listen(3000, () => console.log('🚀 Server at http://localhost:3000'));
