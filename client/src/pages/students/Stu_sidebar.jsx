import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaGraduationCap,
  FaHome,
  FaUser,
  FaCalendarCheck,
  FaHistory,
  FaSignOutAlt,
  FaBed,
} from "react-icons/fa";
import "./studentsidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    if (path) navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("studentId");
    navigate("/auth");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="student-sidebar">
      {/* Logo */}
      <div className="student-sidebar-header" onClick={() => handleNav("/students/studentdashboard")}>
        <FaGraduationCap className="student-sidebar-logo" />
        <h2 className="student-sidebar-title">STUDENT</h2>
      </div>

      {/* Menu Items */}
      <nav className="student-sidebar-menu">
        <button
          className={`student-sidebar-btn ${isActive("/students/studentdashboard") ? "student-active" : ""}`}
          onClick={() => handleNav("/students/studentdashboard")}
        >
          <FaHome className="student-icon" />
          <span className="student-label">Dashboard</span>
        </button>

        <button
          className={`student-sidebar-btn ${isActive("/students/profile") ? "student-active" : ""}`}
          onClick={() => handleNav("/students/profile")}
        >
          <FaUser className="student-icon" />
          <span className="student-label">Profile</span>
        </button>

        <button
          className={`student-sidebar-btn ${isActive("/students/attendance") ? "student-active" : ""}`}
          onClick={() => handleNav("/students/attendance")}
        >
          <FaCalendarCheck className="student-icon" />
          <span className="student-label">Attendance</span>
        </button>

        <button
          className={`student-sidebar-btn ${isActive("/students/stay-request") ? "student-active" : ""}`}
          onClick={() => handleNav("/students/stay-request")}
        >
          <FaBed className="student-icon" />
          <span className="student-label">Stay Request</span>
        </button>

        <button
          className={`student-sidebar-btn ${isActive("/students/history") ? "student-active" : ""}`}
          onClick={() => handleNav("/students/history")}
        >
          <FaHistory className="student-icon" />
          <span className="student-label">History</span>
        </button>
      </nav>

      {/* Logout */}
      <div className="student-sidebar-footer">
        <button className="student-sidebar-btn student-logout" onClick={handleLogout}>
          <FaSignOutAlt className="student-icon" />
          <span className="student-label">Logout</span>
        </button>
      </div>
    </div>
  );
}