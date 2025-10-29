import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../styles/Dashboard.css";

function AttendanceChart({ stats }) {
  const data = [
    { name: "Present", value: stats.presentToday || 0 },
    { name: "Absent", value: stats.absentToday || 0 },
    { name: "On Leave", value: stats.leaveToday || 0 },
  ];

  const COLORS = ["#1e3a8a", "#ef4444", "#f59e0b"]; // professional blue, red, amber

  return (
   <div className="attendance-chart-card">
  <h3>Today's Attendance</h3>
  <ResponsiveContainer>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        paddingAngle={4}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="bottom" height={36} iconType="circle" />
    </PieChart>
  </ResponsiveContainer>
</div>

  );
}

export default AttendanceChart;
