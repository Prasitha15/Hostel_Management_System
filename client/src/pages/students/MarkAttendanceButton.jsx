import React, { useState, useEffect } from "react";
import "./MarkAttendanceButton.css";

const NEC_HOSTEL_LOCATION = {
  lat: 9.0026,
  lng: 77.4010,
  radius: 2000, // meters
};

export default function MarkAttendanceButton({ wardenEnabled, onMarkedPresent }) {
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState("Not Marked");
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Reset when warden disables
  useEffect(() => {
    if (!wardenEnabled) {
      setStatus("Not Marked");
      setError("⏳ Warden has not enabled attendance yet.");
    } else {
      setError(""); // clear error when enabled
    }
  }, [wardenEnabled]);
const checkLocation = async (position) => {
  const { latitude, longitude } = position.coords;
  const distance = getDistanceFromLatLonInM(
    latitude,
    longitude,
    NEC_HOSTEL_LOCATION.lat,
    NEC_HOSTEL_LOCATION.lng
  );

  if (distance <= NEC_HOSTEL_LOCATION.radius) {
    try {
      const res = await fetch("http://localhost:5000/api/mark-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: localStorage.getItem("studentId"), // or from props/context
          latitude,
          longitude,
        }),
      });
      const data = await res.json();
      if (data.message) {
        setStatus("Present");
        setError("");
        if (onMarkedPresent) onMarkedPresent();
      } else {
        setError("⚠ Failed to mark attendance in database.");
      }
    } catch (err) {
      console.error("Mark error:", err);
      setError("⚠ Server error while marking attendance.");
    }
  } else {
    setError("❌ You are not inside NEC Ladies Hostel premises.");
  }
};


  const markAttendance = () => {
    if (!wardenEnabled) {
      setError("⏳ Warden has not enabled attendance yet.");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(checkLocation, () =>
        setError("⚠ Location access denied. Please enable GPS.")
      );
    } else {
      setError("❌ Geolocation not supported on this device.");
    }
  };

  return (
    <div className="mark-attendance-container">
      <h2 className="title">Mark Attendance</h2>
      <p className="time">{time.toLocaleTimeString()}</p>

      <button
        onClick={markAttendance}
        disabled={!wardenEnabled || status === "Present"}
        className={`present-button 
          ${status === "Present" ? "present" : ""} 
          ${status === "Absent" ? "absent" : ""}`}
      >
        {status === "Not Marked" ? "Mark" : status}
      </button>

      {error && <p className="error">{error}</p>}
      {status === "Present" && !error && (
        <p className="success">✅ Attendance Marked Successfully!</p>
      )}
    </div>
  );
}

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
