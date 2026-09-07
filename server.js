// server.js
// Express API that connects the React frontend to the SQLite database.
//
// Routes (mapped to the rubric):
//   GET    /api/students      -> RETRIEVING  (12 marks)
//   POST   /api/students      -> INSERTING   (8 marks)
//   PUT    /api/students/:id  -> UPDATING    (12 marks)

const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ---------- CREATE THE DATABASE (2 marks) ----------
// This opens (or creates, if it doesn't exist) a file called attendance.db
// in the backend folder. That file IS the database.
const db = new Database("attendance.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    number INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('present', 'absent'))
  )
`);

// Seed the table with the assignment's starting data, but only once
const { count } = db.prepare("SELECT COUNT(*) AS count FROM students").get();
if (count === 0) {
  const insert = db.prepare(
    "INSERT INTO students (name, number, status) VALUES (?, ?, ?)"
  );
  const seedMany = db.transaction((students) => {
    for (const s of students) insert.run(...s);
  });
  seedMany([
    ["Teboho", 20, "present"],
    ["Relebohile", 12, "present"],
    ["Ntsoaki", 80, "absent"],
    ["Reaboka", 73, "present"],
  ]);
  console.log("Seeded attendance.db with starting students.");
}

// ---------- RETRIEVE: get every student ----------
app.get("/api/students", (req, res) => {
  try {
    const students = db.prepare("SELECT * FROM students ORDER BY id").all();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- INSERT: add a new student ----------
app.post("/api/students", (req, res) => {
  const { name, number, status } = req.body;

  if (!name || !number || !status) {
    return res.status(400).json({ error: "name, number and status are all required" });
  }

  try {
    const insert = db.prepare(
      "INSERT INTO students (name, number, status) VALUES (?, ?, ?)"
    );
    const result = insert.run(name, number, status);
    const newStudent = db
      .prepare("SELECT * FROM students WHERE id = ?")
      .get(result.lastInsertRowid);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- UPDATE: change a student's attendance status ----------
app.put("/api/students/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["present", "absent"].includes(status)) {
    return res.status(400).json({ error: "status must be 'present' or 'absent'" });
  }

  try {
    const result = db
      .prepare("UPDATE students SET status = ? WHERE id = ?")
      .run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const updated = db.prepare("SELECT * FROM students WHERE id = ?").get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
