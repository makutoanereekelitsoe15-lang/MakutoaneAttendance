import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("present");

  
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  };

  
  const handleAddStudent = (e) => {
    e.preventDefault();

    if (!name || !number) return;

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, number: Number(number), status }),
    })
      .then((res) => res.json())
      .then((newStudent) => {
        setStudents((prev) => [...prev, newStudent]);
        setName("");
        setNumber("");
        setStatus("present");
      })
      .catch((err) => console.error("Error adding student:", err));
  };

  
  const handleToggleStatus = (student) => {
    const newStatus = student.status === "present" ? "absent" : "present";

    fetch(`${API_URL}/${student.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedStudent) => {
        setStudents((prev) =>
          prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
        );
      })
      .catch((err) => console.error("Error updating student:", err));
  };

  return (
    <div className="container">
      <h1>Student Attendance Register</h1>

    
      <form className="attendance-form" onSubmit={handleAddStudent}>
        <input
          type="text"
          placeholder="Student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Student number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
        <button type="submit">Add Student</button>
      </form>

      
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.number}</td>
              <td>
                <span className={`badge ${student.status}`}>
                  {student.status}
                </span>
              </td>
              <td>
                <button onClick={() => handleToggleStatus(student)}>
                  Mark {student.status === "present" ? "Absent" : "Present"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
