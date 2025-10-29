import React, { useState } from "react";
import axios from "axios";
import "../Styles/WardenCreateHoliday.css"; // optional, for styling

const API_URL = "http://localhost:5000";

export default function WardenCreateHoliday({ wardenName }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !startDate || !endDate) {
      setMessage("Please fill in all required fields.");
      setShowPopup(true);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/warden/create-holiday`, {
        title,
        start_date: startDate,
        end_date: endDate,
        description,
        created_by: wardenName || "Warden",
      });
      setMessage(res.data.message);
      setShowPopup(true);

      // Reset form
      setTitle("");
      setStartDate("");
      setEndDate("");
      setDescription("");
    } catch (err) {
      console.error("Error creating holiday:", err);
      setMessage("Failed to create holiday.");
      setShowPopup(true);
    }
  };

  return (
    <div className="create-holiday-container">
      <h2>📅 Create Holiday Period</h2>
      <form onSubmit={handleSubmit} className="holiday-form">
        <label>Holiday Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Winter Break"
          required
        />

        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description for students..."
          rows="3"
        />

        <button type="submit" className="submit-btn">
          Send Holiday to Students
        </button>
      </form>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup">
            <div className="tick-mark">&#10004;</div>
            <p>{message}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
