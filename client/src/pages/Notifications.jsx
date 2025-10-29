import React, { useState, useEffect } from "react";
import "../styles/Notifications.css";
import { fetchNotifications, addNotification } from "../api";
import NotificationItem from "../components/NotificationItem";
import Sidebar from "../components/Sidebar";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "general",
    valid_until: "",
    created_by: "",
  });

  // ✅ Load notifications on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("❌ Failed to fetch notifications:", err);
      }
    };
    loadData();
  }, []);
const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle input changes
  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...form,
    created_by: form.created_by || "System", // ensure not empty
    type: form.type || "general",
  };

  try {
    const newNotif = await addNotification(payload);
    if (newNotif && newNotif.id) {
      setNotifications([newNotif, ...notifications]); // display actual inserted notification
      setForm({
        title: "",
        message: "",
        type: "general",
        valid_until: "",
        created_by: "",
      });
    } else {
      alert("❌ Failed to add notification. Please check console.");
    }
  } catch (err) {
    console.error("❌ Failed to add notification:", err);
    alert("Failed to add notification");
  }
};



  return (
    
  <div className="notifications-page">
      

      <div className="notifications-content">
        <h1 style={{ color: 'rgba(9, 40, 106, 1)' }}>Notification</h1>
        <br />

        {/* Notification Form */}
        <form className="notification-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Notification Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Notification Message"
            value={form.message}
            onChange={handleChange}
            required
          />
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="general">General</option>
            <option value="maintenance">Maintenance</option>
            <option value="event">Event</option>
            <option value="emergency">Emergency</option>
          </select>
          <input
            type="date"
            name="valid_until"
            value={form.valid_until}
            onChange={handleChange}
          />
          <input
            type="text"
            name="created_by"
            placeholder="Created By"
            value={form.created_by}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn">
            Add Notification
          </button>
        </form>

        {/* List of Notifications */}
        <div className="notification-list">
          {notifications.length === 0 ? (
            <p>No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))
          )}
        </div>
      </div>
    </div>
);

  
};

export default Notifications;
