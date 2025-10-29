import React from "react";
import "../styles/Reports.css";

export default function StatCard({ title, value, change, isNegative }) {
  return (
    <div className="card stat-card">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
      {change && (
        <p className={isNegative ? "stat-change negative" : "stat-change positive"}>
          {change}
        </p>
      )}
    </div>
  );
}
