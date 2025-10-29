import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
  FaBell,
  FaUser,
  FaSignOutAlt,
   FaClipboardList,
   FaBed,
} from "react-icons/fa";
import "../styles/Sidebar.css";

function Sidebar({ children }) {
  return (
    <div className="sidebar-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">HOSTEL</h1>
        </div>

        <nav className="sidebar-nav">
  <NavLink to="/dashboard" className="sidebar-item">
    <FaTachometerAlt className="icon" />
    <span className="label">Dashboard</span>
  </NavLink>
  <NavLink to="/students" className="sidebar-item">
    <FaUsers className="icon" />
    <span className="label">Students</span>
  </NavLink>
  <NavLink to="/pending-requests" className="sidebar-item">
    <FaClipboardList className="icon" />
    <span className="label">Pending Requests</span>
  </NavLink>
    <NavLink to="/warden/stay-requests" className="sidebar-item">
            <FaBed className="icon" />
            <span className="label">Stay Requests</span>
          </NavLink>
         <NavLink to="/warden/create-holiday" className="sidebar-item">
            <FaBed className="icon" />
            <span className="label">Create Holiday</span>
          </NavLink>
       

  <NavLink to="/attendance-history" className="sidebar-item">  {/* 🆕 New link */}
    <FaChartBar className="icon" />
    <span className="label">Attendance History</span>
  </NavLink>
  <NavLink to="/notifications" className="sidebar-item">
    <FaBell className="icon" />
    <span className="label">Notifications</span>
  </NavLink>
  <NavLink to="/profile" className="sidebar-item">
    <FaUser className="icon" />
    <span className="label">Profile</span>
  </NavLink>
</nav>


        <div className="sidebar-footer">
          <NavLink
            to="/wardenauth"
            className="sidebar-item logout"
            onClick={() => {
              localStorage.removeItem("warden");
              window.location.href = "/wardenauth"; // force reload to login page
            }}
          >
          <FaSignOutAlt className="icon" />
            <span className="label">Logout</span>
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">{children}</main>
    </div>
  );
}

export default Sidebar;
