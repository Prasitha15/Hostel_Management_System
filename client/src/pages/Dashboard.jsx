import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import AttendanceChart from "../components/AttendanceChart";
import ActivityList from "../components/ActivityList";
import "../styles/Dashboard.css";

const API_URL = "http://localhost:5000";

function Dashboard({ onLogout }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    leaveToday: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllActivities, setShowAllActivities] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/students/stats`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats({
          totalStudents: data.total_students || 0,
          presentToday: data.present_today || 0,
          absentToday: data.absent_today || 0,
          leaveToday: data.leave_today || 0,
        });
        setActivities(data.recent_activities || []);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching dashboard stats:", err);
        setLoading(false);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 30000);
    const eventSource = new EventSource(`${API_URL}/students/live-stats`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setActivities(data.recent_activities || []);
    };

    eventSource.onerror = (err) => {
      console.error("❌ Live activities connection lost:", err);
      eventSource.close();
    };

    return () => {
      clearInterval(interval);
      eventSource.close();
    };
  }, []);

  if (loading) return <p>Loading Dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">Dashboard</h2>
      <p className="dashboard-header-subtitle">
        Welcome back! Here's what's happening at your hostel today.
      </p>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard title="Total Students" value={stats.totalStudents} subtitle="+12 from last month" />
        <StatCard title="Present Today" value={stats.presentToday} subtitle="93% attendance" />
        <StatCard title="Absent Today" value={stats.absentToday} subtitle="7% absenteeism" />
        <StatCard title="Leave Today" value={stats.leaveToday} subtitle="On leave" />
      </div>

      {/* Attendance Chart & Activities */}
      <div className="middle-section">
        <AttendanceChart stats={stats} />
        <div className="activity-list-section">
          <ActivityList activities={activities.slice(0, 5)} /> {/* recent 5 */}
          <button
            type="button"
            className="view-all-btn"
            onClick={() => setShowAllActivities(true)}
          >
            View All Activities
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {showAllActivities && (
        <div
          className="modal-overlay"
          onClick={() => setShowAllActivities(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>All Activities</h3>
            <div className="all-activities-list">
              {activities.map((a, i) => (
                <div key={i} className={`activity ${a.status}`}>
                  <strong>{a.student_name}</strong> - {a.status} <span>{a.timestamp}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="close-btn"
              onClick={() => setShowAllActivities(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
