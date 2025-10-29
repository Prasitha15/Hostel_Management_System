import React, { useEffect, useState } from "react";

export default function AttendanceMark() {
  const [message, setMessage] = useState("Marking attendance...");

  useEffect(() => {
    const markAttendance = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const studentId = urlParams.get("id");

      if (!studentId) {
        setMessage("❌ Invalid QR link.");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/mark-attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId }),
        });
        const data = await res.json();

        if (res.ok) setMessage("✅ Attendance marked successfully!");
        else setMessage(`❌ ${data.message || "Failed to mark attendance"}`);
      } catch (err) {
        console.error(err);
        setMessage("❌ Error marking attendance.");
      }
    };

    markAttendance();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{message}</h2>
    </div>
  );
}
