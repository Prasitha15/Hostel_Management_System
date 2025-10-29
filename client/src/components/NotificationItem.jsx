import React from "react";
import "../styles/Notifications.css";

const NotificationItem = ({ notification }) => {
  return (
    <div className="notification-item">
      <h4 className="notif-title">{notification.title}</h4>
      <p className="notif-message">{notification.message}</p>

      <div className="notif-meta">
        <span><strong>Type:</strong> {notification.type || "General"}</span>
        <span><strong>Created By:</strong> {notification.created_by || "System"}</span>
        <span>
          <strong>Valid Until:</strong>{" "}
          {notification.valid_until
            ? new Date(notification.valid_until).toLocaleDateString()
            : "N/A"}
        </span>
        <span>
          <strong>Posted On:</strong>{" "}
          {notification.created_at
            ? new Date(notification.created_at).toLocaleString()
            : "Unknown"}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;
