import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Stu_sidebar from "./Stu_sidebar";
import { FaHome, FaCalendarAlt, FaEdit, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "./studentstayrequest.css";

const API_URL = "http://localhost:5000";

export default function StayRequest() {
  const [holidays, setHolidays] = useState([]);
  const [holidayId, setHolidayId] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success"); // 'success' or 'error'

  // Track which request IDs have already shown a popup
  const [shownNotifications, setShownNotifications] = useState(() => new Set());

  // Get studentId from localStorage
  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = student?.id;

  // Keep a ref to avoid stale closures in interval
  const shownRef = useRef(shownNotifications);
  useEffect(() => { shownRef.current = shownNotifications; }, [shownNotifications]);

  // Fetch all holidays (unchanged)
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/holidays`);
        setHolidays(response.data);
      } catch (err) {
        console.error("Error fetching holidays:", err);
      }
    };
    fetchHolidays();
  }, []);

  // On mount: fetch student's existing stay requests and mark any already-processed (non-pending) as shown
  useEffect(() => {
    if (!studentId) return;

    const markExistingNotifications = async () => {
      try {
        const res = await axios.get(`${API_URL}/students/stay-requests/${studentId}`);
        const rows = Array.isArray(res.data) ? res.data : [];
        // Add any non-pending requests to the shown set so historical approvals don't re-trigger popups
        setShownNotifications((prev) => {
          const next = new Set(prev);
          rows.forEach((r) => {
            if (r.status && r.status !== "pending") next.add(r.id);
          });
          return next;
        });
      } catch (err) {
        console.error("Error initializing shown notifications:", err);
      }
    };

    markExistingNotifications();
  }, [studentId]);

  // Submit stay request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId || !holidayId || !reason.trim()) {
      setMessage("Please fill all required fields!");
      setPopupType("error");
      setStatusMessage("");
      setShowPopup(true);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/students/stay-request`, {
        student_id: studentId,
        holiday_id: Number(holidayId),
        reason: reason.trim(),
      });

      // Backend message (submission success)
      setMessage(res.data.message || "Stay request submitted successfully");
      setPopupType("success");
      setStatusMessage("");
      setShowPopup(true);

      // Reset form
      setHolidayId("");
      setReason("");

      // Optional: if backend returned the inserted request id, mark it as shown if status is not pending.
      // e.g., if res.data.insertId and res.data.status exist (not currently in your backend)
      if (res.data.insertId && res.data.status && res.data.status !== "pending") {
        setShownNotifications((prev) => new Set(prev).add(res.data.insertId));
      }
    } catch (error) {
      console.error("Error response:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Error submitting stay request.");
      setPopupType("error");
      setStatusMessage("");
      setShowPopup(true);
    }
  };

  // Poll for approval/rejection every 5 seconds — show popup only once per request id
  useEffect(() => {
    if (!studentId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_URL}/students/stay-requests/${studentId}`);
        const rows = Array.isArray(res.data) ? res.data : [];

        // Find ANY request with status !== 'pending' which hasn't been shown yet.
        // Prefer the most recent non-pending request.
        const nonPending = rows
          .filter((r) => r && r.status && r.status !== "pending")
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // newest first

        if (nonPending.length > 0) {
          const first = nonPending[0];
          if (!shownRef.current.has(first.id)) {
            // Show popup for this request (once)
            setStatusMessage(`Your stay request for "${first.reason}" has been ${first.status}.`);
            setPopupType(first.status === "approved" ? "success" : "error");
            setShowPopup(true);

            // Mark as shown
            setShownNotifications((prev) => {
              const next = new Set(prev);
              next.add(first.id);
              return next;
            });
          }
        }
      } catch (err) {
        console.error("Error fetching stay request status:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [studentId]);

  return (
    <div className="stay-request-layout">
      <Stu_sidebar />

      <div className="stay-request-content">
        {/* Header */}
        <div className="stay-request-header">
          <div className="header-icon-wrapper">
            <FaHome className="header-icon-stay" />
          </div>
          <div>
            <h1 className="stay-request-title">Stay Request</h1>
            <p className="stay-request-subtitle">
              Request to stay in the hostel during holiday periods
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="stay-request-card">
          <div className="card-header-stay">
            <h3 className="card-title-stay">
              <FaEdit className="card-icon-inline" />
              Submit Stay Request
            </h3>
            <p className="card-description">
              Select the holiday period you want to stay during and provide a detailed reason
            </p>
          </div>

          <form onSubmit={handleSubmit} className="stay-request-form">
            <div className="form-group-stay">
              <label className="form-label-stay">
                <FaCalendarAlt className="label-icon" />
                Holiday Period
                <span className="required-mark">*</span>
              </label>
              <select
                value={holidayId}
                onChange={(e) => setHolidayId(e.target.value)}
                className="form-select-stay"
                required
              >
                <option value="">-- Select Holiday Period --</option>
                {holidays.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.title} ({new Date(h.start_date).toLocaleDateString()} -{" "}
                    {new Date(h.end_date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-stay">
              <label className="form-label-stay">
                <FaEdit className="label-icon" />
                Reason for Stay
                <span className="required-mark">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="form-textarea-stay"
                placeholder="Please provide a detailed explanation for why you need to stay in the hostel during this holiday period..."
                rows="6"
                required
              />
              <small className="form-hint">
                Provide a clear and valid reason for your stay request
              </small>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn-stay">
                <FaCheckCircle className="btn-icon" />
                Submit Request
              </button>
            </div>
          </form>
        </div>

        {/* Popup Modal */}
        {showPopup && (
          <div className="popup-overlay-stay" onClick={() => setShowPopup(false)}>
            <div
              className={`popup-stay ${popupType === "success" ? "popup-success" : "popup-error"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`popup-icon-stay ${popupType === "success" ? "icon-success" : "icon-error"}`}>
                {popupType === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
              </div>
              <h3 className="popup-title-stay">{popupType === "success" ? "Success!" : "Error"}</h3>
              <p className="popup-message-stay">{statusMessage || message}</p>
              <button
                onClick={() => setShowPopup(false)}
                className={`popup-btn-stay ${popupType === "success" ? "btn-success" : "btn-error"}`}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
