import React, { useState } from "react";
import "../styles/Notifications.css";

const NotificationForm = ({ addNotification }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("general");
  const [validUntil, setValidUntil] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !message || !createdBy) return;

    addNotification({
      id: Date.now(),
      title,
      message,
      type,
      valid_until: validUntil,
      created_by: createdBy,
      created_at: new Date().toISOString(), // auto-generate timestamp
    });

    // reset fields
    setTitle("");
    setMessage("");
    setType("general");
    setValidUntil("");
    setCreatedBy("");
  };

  return (
    <form className="notification-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Notification Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Notification Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="general">General</option>
        <option value="maintenance">Maintenance</option>
        <option value="event">Event</option>
        <option value="emergency">Emergency</option>
      </select>

      <input
        type="date"
        value={validUntil}
        onChange={(e) => setValidUntil(e.target.value)}
      />

      <input
        type="text"
        placeholder="Created By (e.g. Warden John)"
        value={createdBy}
        onChange={(e) => setCreatedBy(e.target.value)}
      />

      <button type="submit">Add Notification</button>
    </form>
  );
};

export default NotificationForm;
