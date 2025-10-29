import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../Styles/AttendanceHistory.css";

export default function WardenAttendanceHistory() {
  const [filters, setFilters] = useState({
    name: "",
    rollNumber: "",
    department: "",
    roomNumber: "",
    blockNumber: "",
    status: "",
    date: "",
    month: "",
    year: "",
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch attendance history from backend
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/attendance-history?`;

      // Attach only non-empty filters to query
      Object.entries(filters).forEach(([key, value]) => {
        if (value) url += `${key}=${encodeURIComponent(value)}&`;
      });

      const res = await fetch(url);
      const data = await res.json();
      setAttendanceData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data initially
  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchAttendance();
  };


  const handleClear = () => {
  setFilters({
    name: "",
    rollNumber: "",
    department: "",
    roomNumber: "",
    blockNumber: "",
    status: "",
    date: "",
    month: "",
    year: "",
  });
};



  const handleExportCSV = () => {
    if (!attendanceData.length) return;

    const header = ["Name", "Roll No", "Department", "Room No", "Block No", "Status", "Date"];
    const rows = attendanceData.map((a) => [
      a.fullName,
      a.rollNumber,
      a.department || "",
      a.roomNumber || "",
      a.blockNumber || "",
      a.status,
      a.date,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `attendance_history_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    
      <div className="attendance-container">
        <h2>Attendance History</h2>

        {/* Filters Section */}
        <div className="filters">
          <input
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Search by Name"
          />
          <input
            name="rollNumber"
            value={filters.rollNumber}
            onChange={handleChange}
            placeholder="Search by Roll No"
          />
          <input
            name="department"
            value={filters.department}
            onChange={handleChange}
            placeholder="Department"
          />
          <input
            name="roomNumber"
            value={filters.roomNumber}
            onChange={handleChange}
            placeholder="Room No"
          />
          <input
            name="blockNumber"
            value={filters.blockNumber}
            onChange={handleChange}
            placeholder="Block No"
          />
          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="">All Status</option>
            <option value="Present">Present</option>
            <option value="Leave">Leave</option>
            <option value="Absent">Absent</option>
          </select>
          <input type="date" name="date" value={filters.date} onChange={handleChange} />
          <select name="month" value={filters.month} onChange={handleChange}>
            <option value="">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <input
            name="year"
            value={filters.year}
            onChange={handleChange}
            placeholder="Year (e.g., 2025)"
          />
        </div>

       {/* Buttons */}
<div className="buttons">
  <button onClick={handleSearch} className="search-btn">
    Search
  </button>
  <button onClick={handleClear} className="clear-btn">
    Clear
  </button>
  <button onClick={handleExportCSV} className="export-btn">
    Export CSV
  </button>
</div>

        {/* Attendance Table */}
        {loading ? (
          <p>Loading...</p>
        ) : attendanceData.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Department</th>
                <th>Room No</th>
                <th>Block No</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((att) => (
                <tr key={`${att.student_id}-${att.date}`}>
                  <td data-label="Roll Number">{att.rollNumber}</td>
                  <td data-label="Name">{att.fullName}</td>
                  <td data-label="Department">{att.department || ""}</td>
                  <td data-label="Room No">{att.roomNumber || ""}</td>
                  <td data-label="Block No">{att.blockNumber || ""}</td>
                  <td
                    data-label="Status"
                    className={
                      att.status === "Present"
                        ? "status-present"
                        : att.status === "Absent"
                        ? "status-absent"
                        : "status-leave"
                    }
                  >
                    {att.status}
                  </td>
                  <td data-label="Date">
                    {new Date(att.date).toLocaleString("en-IN", {
                      dateStyle: "medium",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    
  );
}
