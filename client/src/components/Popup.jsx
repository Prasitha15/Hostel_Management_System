// Popup.js
import React, { useEffect } from "react";
import "./Popup.css";

export default function Popup({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // auto close after 2 sec
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`popup-container ${type}`}>
      <div className="popup-box">
        <div className="tick-mark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 52 52"
          >
            <circle className="circle" cx="26" cy="26" r="25" fill="none" />
            <path className="check" fill="none" d="M14 27l7 7 16-16" />
          </svg>
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
}
