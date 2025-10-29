// Students.jsx
import React, { useEffect, useState } from "react";
import "../styles/Students.css";
import { fetchStudents } from "../api";

const Students = ({ isWarden = true }) => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("name");
  const [attendanceEnabled, setAttendanceEnabled] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");

  const categories = [
    { value: "name", label: "Name" },
    { value: "rollNumber", label: "Roll No" },
    { value: "department", label: "Department" },
    { value: "roomNumber", label: "Room No" },
    { value: "blockNumber", label: "Block No" },
    
  ];

  // Fetch attendance status once on mount
  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/attendance-status");
        const data = await res.json();
        setAttendanceEnabled(data.attendanceEnabled === true);
      } catch (err) {
        console.error("Error fetching attendance status:", err);
        setAttendanceEnabled(false);
      }
    };
    fetchAttendanceStatus();
  }, []);

  // Load students
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStudents({ search, category });
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };
    loadData();
  }, [search, category]);

  // Warden toggles attendance
  const handleAttendanceToggle = async () => {
    try {
      const enable = !attendanceEnabled;
      const res = await fetch("http://localhost:5000/api/enable-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: enable ? "Yes" : "No" }),
      });
      const data = await res.json();
      if (data.success) {
        setAttendanceEnabled(enable); // update frontend immediately
        alert(`✅ Attendance marking ${enable ? "enabled" : "disabled"}!`);
      } else {
        alert("Failed to update attendance. Try again.");
      }
    } catch (err) {
      console.error("Error updating attendance:", err);
      alert("Error updating attendance!");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!students.length) return;
    const header = ["Name", "Department", "Roll No", "Room No", "Block No", "Attendance"];
    const rows = students.map(s => [
      s.fullName,
      s.department,
      s.rollNumber,
      s.roomNumber,
      s.blockNumber,
      s.attendance
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `students_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="students-page">
      <h1 style={{ color: "rgba(9, 40, 106, 1)" }}>Students</h1>
      <br />

      {/* Search Box */}
      <div className="search-container">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="search-dropdown"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={`Search by ${category}`}
          value={search}
          onChange={(e) => {
            let value = e.target.value;
            let msg = "";
            if (category === "name" || category === "place") {
              if (/[^a-zA-Z\s]/.test(value)) msg = "Only alphabets and spaces are allowed.";
              value = value.replace(/[^a-zA-Z\s]/g, "");
            } else if (category === "department") {
              const allowed = ["s&h", "aids", "cse", "it", "civil", "mech", "ece", "eee"];
              const lowerValue = value.toLowerCase();
              if (lowerValue && !allowed.some(dep => dep.startsWith(lowerValue))) msg = "Invalid department";
            } else if (category === "rollNumber" || category === "roomNumber") {
              if (/[^0-9]/.test(value)) msg = "Only numbers are allowed.";
              value = value.replace(/[^0-9]/g, "");
            } else if (category === "blockNumber") {
              if (/[^abcdeABCDE]/.test(value)) msg = "Only blocks A-E allowed";
              value = value.replace(/[^abcdeABCDE]/g, "").toUpperCase();
            }
            setSearch(value);
            setValidationMsg(msg);
          }}
          className="search-bar"
        />

        {validationMsg && <p style={{ color: "red", fontSize: "13px" }}>{validationMsg}</p>}
      </div>

      {/* Attendance Controls */}
      <div className="attendance-controls" style={{ marginBottom: '20px' }}>
        {isWarden && (
          <button
            className={`warden-btn ${attendanceEnabled ? "disable-btn" : "enable-btn"}`}
            onClick={handleAttendanceToggle}
          >
            {attendanceEnabled ? "Disable Attendance Marking" : "Enable Attendance Marking"}
          </button>
        )}

        <button
          className="warden-btn export-btn"
          style={{ marginLeft: '10px' }}
          onClick={handleExportCSV}
        >
          Export as CSV
        </button>

        <span style={{ marginLeft: '10px', color: attendanceEnabled ? 'green' : 'red' }}>
          {attendanceEnabled ? '✅ Attendance Marking Enabled' : '❌ Attendance Marking Disabled'}
        </span>
      </div>

      {/* Students Table */}
      <table className="students-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Roll No</th>
            <th>Room No</th>
            <th>Block No</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.fullName}</td>
              <td>{s.department}</td>
              <td>{s.rollNumber}</td>
              <td>{s.roomNumber}</td>
              <td>{s.blockNumber}</td>
              <td>
  <span
    className={`status-badge ${
      s.attendance === "Present"
        ? "present"
        : s.attendance === "Absent"
        ? "absent"
        : "leave"
    }`}
  ></span>
  <span className="attendance-text">{s.attendance}</span>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
