import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import "../styles/Reports.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchAttendanceStats, fetchAttendanceOverall } from "../api";

// Colors for Present, Absent, Leave
const COLORS = ["#22c55e", "#000000", "#facc15"];

export default function Reports() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [pieData, setPieData] = useState([
    { name: "Present", value: 0 },
    { name: "Absent", value: 0 },
    { name: "Leave", value: 0 },
  ]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch daily attendance stats
        const stats = await fetchAttendanceStats();
        const formatted = stats.map((s) => ({
          day: s.day,
          present: s.present,
          absent: s.absent,
          leave: s.leave_count || 0,
        }));
        setAttendanceData(formatted);

        // Fetch overall stats
        const overall = await fetchAttendanceOverall();
        const total =
          overall.totalPresent + overall.totalAbsent + overall.totalLeave;
        setPieData([
          {
            name: "Present",
            value: total ? (overall.totalPresent / total) * 100 : 0,
          },
          {
            name: "Absent",
            value: total ? (overall.totalAbsent / total) * 100 : 0,
          },
          {
            name: "Leave",
            value: total ? (overall.totalLeave / total) * 100 : 0,
          },
        ]);
        setTotalStudents(overall.totalStudents);
      } catch (err) {
        console.error("❌ Failed to fetch attendance data:", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="reports-container">
      <main className="reports-main">
        <h1 style={{ color: "rgba(9, 40, 106, 1)" }}>Reports</h1>
        <br />
        <p className="page-subtitle">
          Attendance insights and performance metrics
        </p>

        {/* Stat Cards */}
        <div className="stats-grid">
          <StatCard
            title="Average Attendance"
            value={pieData[0] ? `${pieData[0].value.toFixed(2)}%` : "0%"}
          />
          <StatCard title="Total Students" value={totalStudents || 0} />
        </div>

    

        {/* Bar Chart */}
        <div className="card chart-card">
          <h3 className="card-title">Daily Attendance Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#22c55e" />
              <Bar dataKey="absent" fill="#000000" />
              <Bar dataKey="leave" fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
