import React, { useState, useEffect, useMemo } from "react";
import Stu_sidebar from "./Stu_sidebar";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import axios from "axios";
import "./History.css";

export default function History() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [month, setMonth] = useState("All Months");
  const [year, setYear] = useState("2024");
  const [status, setStatus] = useState("All Status");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentId = localStorage.getItem("studentId") || 1;
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    attendanceRate: 0
  });

  // Fetch attendance from backend
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`http://localhost:5000/api/attendance/${studentId}`);
        setRecords(res.data);

        const statsRes = await axios.get(`http://localhost:5000/api/attendance-stats/${studentId}`);
        setStats(statsRes.data);
      } catch (err) {
        console.error("❌ Error fetching attendance:", err);
        setError("Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [studentId]);

  // Filter logic
  useEffect(() => {
    const filtered = records.filter((rec) => {
      const [recYear, recMonth, recDay] = rec.date.split("-");
      const recordMonthName = new Date(rec.date).toLocaleString("default", { month: "long" });

      const matchMonth = month === "All Months" || recordMonthName === month;
      const matchYear = year === "All Years" || recYear === year;
      const matchStatus = status === "All Status" || rec.status === status;
      const matchDate = date === "" || rec.date === date;

      return matchMonth && matchYear && matchStatus && matchDate;
    });

    setFilteredRecords(filtered);
  }, [records, month, year, status, date]);

  // Summary calculations
  const totalDays = filteredRecords.length;
  const presentDays = filteredRecords.filter((r) => r.status === "Present").length;
  const absentDays = filteredRecords.filter((r) => r.status === "Absent").length;
  const attendanceRate = totalDays ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

  const clearFilters = () => {
    setMonth("All Months");
    setYear("2024");
    setStatus("All Status");
    setDate("");
  };

  // Excel Export
  const exportToExcel = () => {
    if (filteredRecords.length === 0) {
      alert("No attendance data to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance History");

    const summarySheet = XLSX.utils.json_to_sheet([
      { "Total Records": totalDays },
      { "Present Days": presentDays },
      { "Absent Days": absentDays },
      { "Attendance Rate": `${attendanceRate}%` },
    ]);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

    XLSX.writeFile(workbook, "Attendance_History.xlsx");
  };

  return (
    <div className="dashboard-layout">
      <Stu_sidebar />

      <div className="dashboard-content">
        <motion.div
          className="history-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>📘 Attendance History</h1>
          <p>View and filter your attendance records</p>
        </motion.div>

        <motion.div
          className="filters-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>🔍 Filters</h3>

          <div className="filters-container">
            <div className="filter-group">
              <label><i className="fas fa-calendar-alt"></i> Month</label>
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option>All Months</option>
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label><i className="fas fa-calendar"></i> Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option>2024</option>
                <option>2025</option>
              </select>
            </div>

            <div className="filter-group">
              <label><i className="fas fa-user-check"></i> Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>All Status</option>
                <option>Present</option>
                <option>Absent</option>
              </select>
            </div>

            <div className="filter-group">
              <label><i className="fas fa-calendar-day"></i> Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <button className="clear-btn" onClick={clearFilters}>
              <i className="fas fa-times-circle"></i> Clear All
            </button>
          </div>
        </motion.div>
<motion.div 
          className="records-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="records-header">
            <h3>📅 Attendance Records</h3>
            <button className="export-btn" onClick={exportToExcel}>
              <i className="fa-solid fa-file-export"></i> Export Excel
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <p>Loading attendance records...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="no-records">
              <p>📅 No records found</p>
              <small>Try adjusting your filters or date range</small>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec, idx) => (
                  <tr key={idx}>
                    <td>{rec.date}</td>
                    <td className={rec.status === "Present" ? "status-present" : "status-absent"}>
                      {rec.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
        {/* Summary Section */}
        <div className="summary-section">
          <div className="summary-box total">
            <h3>{totalDays}</h3>
            <p>📅 Total Records</p>
          </div>

          <div className="summary-box present">
            <h3>{presentDays}</h3>
            <p>✅ Present Days</p>
          </div>

          <div className="summary-box absent">
            <h3>{absentDays}</h3>
            <p>❌ Absent Days</p>
          </div>

          <div className="summary-box rate">
            <h3>{attendanceRate}%</h3>
            <p>📊 Attendance Rate</p>
          </div>
        </div>

        {/* Records Section */}
        
      </div>
    </div>
  );
}