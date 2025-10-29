import React, { useEffect, useState } from "react";
import "./studentdashboardstyle.css";
import Stu_sidebar from "./Stu_sidebar";
import { motion } from "framer-motion";
import { BookOpen, Bell, Calendar, AlertCircle } from "lucide-react";

// Helper function to check if date is today
const isToday = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Helper function to check if stay notification is active
const isStayNotificationActive = (notification) => {
  const today = new Date();
  const toDate = new Date(notification.to_date);
  return toDate >= today;
};

// Helper function to calculate current academic year
const getCurrentStudentYear = (yearOfAdmission) => {
  if (!yearOfAdmission) return 0;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  let yearDiff = currentYear - yearOfAdmission;
  if (currentMonth < 6) yearDiff -= 1;
  return yearDiff + 1;
};

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [leaveNotifications, setLeaveNotifications] = useState([]);
  const [stayNotifications, setStayNotifications] = useState([]);
  const [editing, setEditing] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [blockNumber, setBlockNumber] = useState("");
  const studentId = localStorage.getItem("studentId");

  // 🟦 General Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notifications");
        let data = await res.json();
        const todayNotifications = data.filter((n) => isToday(n.created_at));
        setNotifications(todayNotifications.slice(0, 5));
      } catch (err) {
        console.error("❌ Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🟧 Leave Notifications
  useEffect(() => {
    if (!studentId) return;

    const fetchLeaveNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/student-leave-notifications/${studentId}`
        );
        let data = await res.json();
        const todayLeaveNotifications = data.filter((n) =>
          isToday(n.created_at)
        );
        setLeaveNotifications(todayLeaveNotifications.slice(0, 5));
      } catch (err) {
        console.error("❌ Error fetching leave notifications:", err);
      }
    };

    fetchLeaveNotifications();
    const interval = setInterval(fetchLeaveNotifications, 10000);
    return () => clearInterval(interval);
  }, [studentId]);

  // Stay Notifications
useEffect(() => {
  const fetchStayNotifications = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/student-stay-notifications`
      );
      const data = await res.json();
      setStayNotifications(data.slice(0, 5)); // latest 5 notifications
    } catch (err) {
      console.error("❌ Error fetching stay notifications:", err);
    }
  };

  fetchStayNotifications();
  const interval = setInterval(fetchStayNotifications, 10000);
  return () => clearInterval(interval);
}, []);


  // 🧍 Load student profile data
  useEffect(() => {
    if (studentId) {
      fetch(`http://localhost:5000/student/profile/${studentId}`)
        .then((res) => res.json())
        .then((data) => {
          const currentYear = getCurrentStudentYear(data.yearOfAdmission);
          setStudent({ ...data, currentYear });
          setRoomNumber(data.roomNumber || "");
          setBlockNumber(data.blockNumber || "");
        })
        .catch((err) => console.error("Error fetching dashboard data:", err));
    }
  }, [studentId]);

  const handleSaveHostel = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/student/profile/${student.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomNumber, blockNumber }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      alert("✅ Hostel info updated!");
      setStudent({ ...data, currentYear: student.currentYear });
      setEditing(false);
    } catch (err) {
      console.error("Error updating hostel info:", err);
      alert("❌ Failed to update hostel info");
    }
  };

  if (!student) {
    return (
      <div className="dashboard-layout">
        <Stu_sidebar />
        <div className="dashboard-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading student data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Stu_sidebar />

      <div className="dashboard-content-pro">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <div>
              <h1 className="dashboard-title">Student Portal</h1>
              <p className="dashboard-subtitle">
                Welcome back, <strong>{student.fullName}</strong>
              </p>
            </div>
            <div className="header-date">
              <Calendar size={18} />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid">
          {/* Academic Information Card */}
          <motion.div
            className="dashboard-card academic-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="card-header">
              <div className="card-title-wrapper">
                <BookOpen className="card-icon" size={20} />
                <h3 className="card-title">Academic Information</h3>
              </div>
            </div>
            <div className="card-content">
              <div className="info-row">
                <span className="info-label">Full Name</span>
                <span className="info-value">{student.fullName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Roll Number</span>
                <span className="info-value">{student.rollNumber}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Department</span>
                <span className="info-value">{student.department}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Current Year</span>
                <span className="info-value">Year {student.currentYear}</span>
              </div>
            </div>
          </motion.div>

          {/* Latest Notifications */}
          <motion.div
            className="dashboard-card notifications-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="card-header">
              <div className="card-title-wrapper">
                <Bell className="card-icon" size={20} />
                <h3 className="card-title">Latest Notifications</h3>
              </div>
            </div>
            <div className="card-content scrollable-content">
              {notifications.length === 0 ? (
                <div className="empty-state">
                  <AlertCircle size={40} />
                  <p>No notifications available</p>
                </div>
              ) : (
                <div className="notifications-list">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item notification-${n.type || 'general'}`}
                    >
                      <div className="notification-header">
                        <strong className="notification-title">{n.title}</strong>
                        <span className="notification-badge">
                          {n.type || 'general'}
                        </span>
                      </div>
                      <p className="notification-message">{n.message}</p>
                      <small className="notification-time">
                        {new Date(n.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Leave Notifications */}
          <motion.div
            className="dashboard-card leave-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="card-header">
              <div className="card-title-wrapper">
                <Calendar className="card-icon" size={20} />
                <h3 className="card-title">Leave Status</h3>
              </div>
            </div>
            <div className="card-content scrollable-content">
              {leaveNotifications.length === 0 ? (
                <div className="empty-state">
                  <AlertCircle size={40} />
                  <p>No leave updates yet</p>
                </div>
              ) : (
                <div className="notifications-list">
                  {leaveNotifications.map((n) => (
                    <div key={n.id} className="notification-item notification-leave">
                      <div className="notification-header">
                        <strong className="notification-title">{n.title}</strong>
                      </div>
                      <p className="notification-message">{n.message}</p>
                      <small className="notification-time">
                        {new Date(n.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Stay/Holiday Notifications */}
          <motion.div
            className="dashboard-card stay-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="card-header">
              <div className="card-title-wrapper">
                <Calendar className="card-icon" size={20} />
                <h3 className="card-title">Stay & Holiday Updates</h3>
              </div>
            </div>
            <div className="card-content scrollable-content">
              {stayNotifications.length === 0 ? (
                <div className="empty-state">
                  <AlertCircle size={40} />
                  <p>No stay or holiday updates yet</p>
                </div>
              ) : (
                <div className="notifications-list">
                  {stayNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item notification-${n.type || 'stay'}`}
                    >
                      <div className="notification-header">
                        <strong className="notification-title">{n.title}</strong>
                        <span className="notification-badge">
                          {n.type || 'stay'}
                        </span>
                      </div>
                      <p className="notification-message">{n.message}</p>
                      <small className="notification-time">
                        {new Date(n.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}