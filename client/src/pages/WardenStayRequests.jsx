import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "../Styles/WardenStayRequests.css"; // ✅ Import your CSS

const API_URL = "http://localhost:5000";

export default function WardenStayRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [updatingId, setUpdatingId] = useState(null);
  const wardenId = 1;

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/warden/stay-requests/${wardenId}`);
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching stay requests:", err);
      setMessage("Failed to fetch stay requests.");
      setPopupType("error");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await axios.put(`${API_URL}/warden/update-stay-status/${id}`, { status: newStatus });

      if (res.status === 200) {
        const backendMessage = res.data.message || (newStatus === "approved" ? "Request accepted" : "Request rejected");
        setMessage(backendMessage);
        setPopupType(newStatus === "approved" ? "success" : "error");
        setShowPopup(true);

        // Animate removal using AnimatePresence
        setRequests((prev) => prev.filter((req) => req.id !== id));
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setMessage(err.response?.data?.message || "Failed to update status.");
      setPopupType("error");
      setShowPopup(true);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Loading stay requests...</p>;

  return (
    <div className="warden-stay-requests">
      <h2>🏠 Stay Requests</h2>

      {requests.length === 0 ? (
        <p>No stay requests yet.</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Department</th>
              <th>Holiday</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {requests.map((req) => (
                <motion.tr
                  key={req.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
                >
                  <td data-label="Student Name">{req.student_name}</td>
                  <td data-label="Roll Number">{req.roll_number}</td>
                  <td data-label="Department">{req.department}</td>
                  <td data-label="Holiday">{req.holiday_title}</td>
                  <td data-label="Reason">{req.reason}</td>
                  <td data-label="Status">{req.status || "pending"}</td>
                  <td data-label="Created At">{new Date(req.created_at).toLocaleString()}</td>
                  <td data-label="Actions">
                    <button
                      className="approve-btn"
                      onClick={() => handleStatusChange(req.id, "approved")}
                      disabled={req.status === "approved" || updatingId === req.id}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleStatusChange(req.id, "rejected")}
                      disabled={req.status === "rejected" || updatingId === req.id}
                    >
                      Reject
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      )}

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <div className={`tick-mark ${popupType === "success" ? "success" : "error"}`}>
              {popupType === "success" ? "✔" : "✖"}
            </div>
            <p>{message}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
