// Attendance.jsx
import React, { useState, useEffect } from "react";
import Stu_sidebar from "./Stu_sidebar";
import MapComponent from "./MapComponent";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
} from "date-fns";
import { QRCodeCanvas } from "qrcode.react";

import "./AttendanceStyles.css";
export default function Attendance() {
  const [time, setTime] = useState(new Date());
  const [attendanceEnabled, setAttendanceEnabled] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [dailyQR, setDailyQR] = useState(null);
  const [qrMessage, setQRMessage] = useState("");

  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [todayStatus, setTodayStatus] = useState("Not Marked");
  const [presentDays, setPresentDays] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);

  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveType, setLeaveType] = useState("full-day");
  const [leaveReason, setLeaveReason] = useState("");

  // --- Clock ---
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Get student ID ---
  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("student"));
    if (storedStudent?.id) setStudentId(storedStudent.id);
  }, []);

  // --- Fetch attendance enabled status ---
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/attendance-status");
        const data = await res.json();
        setAttendanceEnabled(data.attendanceEnabled ?? false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStatus();
  }, []);

  // --- Fetch attendance and today's status ---
  useEffect(() => {
    if (!studentId) return;

    const fetchAttendance = async () => {
      const month = currentMonth.getMonth() + 1;
      const year = currentMonth.getFullYear();
      const todayStr = format(new Date(), "yyyy-MM-dd");

      try {
        const res = await fetch(
          `http://localhost:5000/api/attendance-by-student?studentId=${studentId}&month=${month}&year=${year}`
        );
        const data = await res.json();

        const records = {};
        let presentCount = 0;

        data.forEach((rec) => {
          const formattedDate = format(new Date(rec.date), "yyyy-MM-dd");
          const statusLower = rec.status.toLowerCase();
          records[formattedDate] = { status: statusLower };
          if (statusLower === "present") presentCount++;
        });

        setAttendanceRecords(records);
        setPresentDays(presentCount);
        setTotalDays(data.length);
        setAttendanceRate(data.length > 0 ? (presentCount / data.length) * 100 : 0);

        // Today's status
        if (records[todayStr]) setTodayStatus(records[todayStr].status);
        else setTodayStatus("Not Marked");
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };

    fetchAttendance();

    // Live update every 5 seconds
    const interval = setInterval(fetchAttendance, 5000);
    return () => clearInterval(interval);
  }, [studentId, currentMonth]);

  // --- Fetch today's QR with leave check ---
 useEffect(() => {
  if (!studentId) return;

  const fetchQR = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/get-active-qr/${studentId}`);
      const data = await res.json();

      if (data.active && data.qrValue) {
        setDailyQR(data.qrValue);
        setQRMessage("");
      } else {
        setDailyQR(null);
        setQRMessage(data.message || "QR not available");
      }
    } catch (err) {
      console.error("Error fetching QR:", err);
      setDailyQR(null);
      setQRMessage("Error fetching QR");
    }
  };

  fetchQR();
}, [studentId]);


  // --- Handle Leave Submission ---
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return alert("Student ID not found.");

    try {
      const res = await fetch("http://localhost:5000/api/leave-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          fromDate: leaveFrom,
          toDate: leaveTo,
          leavetype: leaveType,
          reason: leaveReason,
        }),
      });
      const data = await res.json();
      if (res.ok) alert("Leave request submitted successfully!");
      else alert(data.message || "Failed to submit leave");
    } catch (err) {
      console.error(err);
      alert("Error submitting leave.");
    }
  };

  // --- Calendar Navigation ---
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  return (
    <div className="dashboard-layout bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <Stu_sidebar />

      <div className="dashboard-content p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-2xl font-bold">📘 Attendance</h2>
          <p className="opacity-90">Mark your daily hostel attendance</p>
        </div>

        {/* QR Section */}
        <div className="card bg-white shadow-lg rounded-2xl p-6 mt-6 flex flex-col items-center">
          {attendanceEnabled ? (
            <div className="text-center">
              <p className="text-green-600 mb-4">✅ Attendance marking is enabled</p>
              <p className="text-gray-700 mb-3 font-medium">
                📸 Scan this QR Code with your phone to mark attendance
              </p>

              {studentId && dailyQR ? (
                <QRCodeCanvas
                  value={`http://localhost:5000/api/mark-attendance?id=${studentId}&qrValue=${dailyQR}`}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#2563eb"
                  level="H"
                  includeMargin={true}
                />
              ) : (
                <p className="text-red-500 font-bold">{qrMessage || "Loading today's QR..."}</p>
              )}

              <p className="text-sm text-gray-500 mt-3">
                The QR expires at the end of the day.
              </p>
            </div>
          ) : (
            <p className="text-red-500">❌ Attendance is not enabled yet</p>
          )}
        </div>

        {/* Stats Section */}
        <div className="info-grid grid gap-6 md:grid-cols-3 mt-6">
          <div className="card bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3">📅 Today's Status</h3>
            {todayStatus === "present" ? (
              <div className="status marked">✅ Marked as Present</div>
            ) : todayStatus === "absent" ? (
              <div className="status not-marked">❌ Marked as Absent</div>
            ) : todayStatus === "leave" ? (
              <div className="status leave">🟡 On Leave</div>
            ) : (
              <div className="status not-marked">❌ Not Marked</div>
            )}
          </div>

          <div className="card bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3">📊 Monthly Stats</h3>
            <h2 className="text-3xl font-bold">{attendanceRate.toFixed(0)}%</h2>
            <p>Attendance Rate</p>
            <div className="info-row mt-3">
              <p>
                <strong>Present Days:</strong> {presentDays}
              </p>
              <p>
                <strong>Total Days:</strong> {totalDays}
              </p>
            </div>
          </div>
        </div>

        {/* Map Component */}
        <div className="card bg-white shadow-lg rounded-2xl p-6 mt-6">
          <h3 className="text-xl font-semibold mb-3">📍 Your Location</h3>
          <MapComponent />
        </div>

        {/* Leave Form */}
        <div className="leave-card mt-6">
          <div className="leave-form">
            <h3>Leave Application Form</h3>
            <form onSubmit={handleLeaveSubmit} className="grid grid-cols-1 gap-6">
              <div className="form-field">
                <label htmlFor="leave-from">From:</label>
                <input
                  id="leave-from"
                  type="datetime-local"
                  value={leaveFrom}
                  onChange={(e) => setLeaveFrom(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="leave-to">To:</label>
                <input
                  id="leave-to"
                  type="datetime-local"
                  value={leaveTo}
                  onChange={(e) => setLeaveTo(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="leave-type">Type of Leave:</label>
                <select
                  id="leave-type"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="full-day">Full Day</option>
                  <option value="half-day-AM">Half Day - Morning</option>
                  <option value="half-day-PM">Half Day - Afternoon</option>
                </select>
              </div>

              <div className="form-field reason-field">
                <label htmlFor="leave-reason">Reason:</label>
                <textarea
                  id="leave-reason"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => {
                    setLeaveFrom("");
                    setLeaveTo("");
                    setLeaveType("full-day");
                    setLeaveReason("");
                  }}
                >
                  Clear
                </button>
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Calendar */}
        <div className="calendar-container mt-6">
          <div className="calendar-header">
            <button onClick={handlePrevMonth} className="nav-btn">◀</button>
            <span className="calendar-title">{format(currentMonth, "MMMM yyyy")}</span>
            <button onClick={handleNextMonth} className="nav-btn">▶</button>
            <button onClick={handleToday} className="today-btn">Today</button>
          </div>

          <div className="calendar-grid calendar-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="calendar-day-name">{day}</div>
            ))}
          </div>

          <div className="calendar-grid calendar-days">
            {(() => {
              const startMonth = startOfMonth(currentMonth);
              const endMonth = endOfMonth(currentMonth);
              const startDate = startOfWeek(startMonth);
              const endDate = endOfWeek(endMonth);
              const days = [];
              let day = startDate;

              while (day <= endDate) {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const dateStr = format(day, "yyyy-MM-dd");
                const record = attendanceRecords[dateStr];
                const dayStatus = record?.status || "";

                const dayClass = `calendar-day ${
                  !isCurrentMonth ? "outside-month" : ""
                } ${
                  dayStatus === "present"
                    ? "present"
                    : dayStatus === "absent"
                    ? "absent"
                    : dayStatus === "leave"
                    ? "leave"
                    : ""
                }`;

                days.push(
                  <div
                    key={dateStr}
                    className={dayClass}
                    title={dayStatus ? dayStatus.toUpperCase() : "No record"}
                  >
                    {format(day, "d")}
                  </div>
                );
                day = addDays(day, 1);
              }
              return days;
            })()}
          </div>

          <div className="calendar-legend mt-4">
            <span className="present">● Present</span>
            <span className="absent">● Absent</span>
            <span className="leave">● Leave</span>
          </div>
        </div>
      </div>
    </div>
  );
}
