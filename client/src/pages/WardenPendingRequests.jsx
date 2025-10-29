/*import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // for modal
import "../styles/WardenPendingRequests.css";

Modal.setAppElement("#root"); // accessibility

export default function WardenPendingRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingId, setApprovingId] = useState(null); // prevents double click

  // Fetch pending requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:5000/api/pending-requests");
        if (!res.ok) throw new Error("Failed to fetch pending requests");

        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  // View details in modal
  const handleView = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  // Approve request
  const handleApprove = async (id) => {
    if (approvingId) return; // prevent double clicks
    setApprovingId(id);

    try {
      const res = await fetch(`http://localhost:5000/api/approve-request/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Request approved!");
        setRequests(requests.filter((r) => r.id !== id));
        setModalOpen(false);
      } else {
        alert(data.message || "❌ Failed to approve request");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="warden-requests-container">
      <h2 className="text-2xl font-bold mb-4">Pending Leave & Outing Requests</h2>

      {loading && <p>Loading pending requests...</p>}
      {error && <p className="text-red-500 mb-2">Error: {error}</p>}

      {!loading && requests.length === 0 && !error && <p>No pending requests.</p>}

      {!loading && requests.length > 0 && (
        <div className="request-list space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="card bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p><strong>Name:</strong> {req.studentName}</p>
                <p><strong>Department:</strong> {req.department}</p>
                <p><strong>Year:</strong> {req.currentYear}</p>
                <p><strong>Type:</strong> {req.type}</p>
                <p><strong>From:</strong> {new Date(req.fromDate).toLocaleString()}</p>
                <p><strong>To:</strong> {new Date(req.toDate).toLocaleString()}</p>
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => handleView(req)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="modal p-6 bg-white rounded-xl shadow-xl max-w-lg mx-auto mt-20"
      >
        {selectedRequest ? (
          <>
            <h3 className="text-xl font-bold mb-3">
              {selectedRequest.studentName} - Details
            </h3>
            <p><strong>Department:</strong> {selectedRequest.department}</p>
            <p><strong>Year:</strong> {selectedRequest.currentYear}</p>
            <p><strong>Room:</strong> {selectedRequest.roomNumber}</p>
            <p><strong>Block:</strong> {selectedRequest.blockNumber}</p>
            <p><strong>Father's Number:</strong> {selectedRequest.fatherNumber}</p>
            <p><strong>Mother's Number:</strong> {selectedRequest.motherNumber}</p>
            <p><strong>Personal Number:</strong> {selectedRequest.personalNumber}</p>
            <p><strong>Reason:</strong> {selectedRequest.reason}</p>
            {selectedRequest.notes && <p><strong>Notes:</strong> {selectedRequest.notes}</p>}

            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                onClick={() => handleApprove(selectedRequest.id)}
                disabled={approvingId === selectedRequest.id}
              >
                {approvingId === selectedRequest.id ? "Approving..." : "Approve"}
              </button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
}
*/
import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // for modal
import "../styles/WardenPendingRequests.css";

Modal.setAppElement("#root"); // accessibility

export default function WardenPendingRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingId, setApprovingId] = useState(null); // prevents double click

  // Fetch pending requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:5000/api/pending-requests");
        if (!res.ok) throw new Error("Failed to fetch pending requests");

        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  // View details in modal
  const handleView = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  // Approve request
  const handleApprove = async (id) => {
    if (approvingId) return; // prevent double clicks
    setApprovingId(id);

    try {
      const res = await fetch(`http://localhost:5000/api/approve-request/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Request approved!");
        setRequests(requests.filter((r) => r.id !== id));
        setModalOpen(false);
      } else {
        alert(data.message || "❌ Failed to approve request");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="warden-requests-container">
      <h2 className="text-2xl font-bold mb-4">Pending Leave & Outing Requests</h2>

      {loading && <p>Loading pending requests...</p>}
      {error && <p className="text-red-500 mb-2">Error: {error}</p>}

      {!loading && requests.length === 0 && !error && <p>No pending requests.</p>}

      {!loading && requests.length > 0 && (
        <div className="request-list space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="card">
              <div className="request-details">
                <p><strong>Name:</strong> {req.studentName}</p>
                <p><strong>Department:</strong> {req.department}</p>
                <p><strong>Year:</strong> {req.currentYear}</p>
                <p><strong>Type:</strong> {req.type}</p>
                <p><strong>From:</strong> {new Date(req.fromDate).toLocaleString()}</p>
                <p><strong>To:</strong> {new Date(req.toDate).toLocaleString()}</p>
              </div>
              <button onClick={() => handleView(req)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for request details */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="modal p-6 bg-white rounded-xl shadow-xl max-w-lg mx-auto mt-20"
      >
        {selectedRequest ? (
          <>
            <h3 className="text-xl font-bold mb-3">
              {selectedRequest.studentName} - Details
            </h3>
            <p><strong>Department:</strong> {selectedRequest.department}</p>
            <p><strong>Year:</strong> {selectedRequest.currentYear}</p>
            <p><strong>Room:</strong> {selectedRequest.roomNumber}</p>
            <p><strong>Block:</strong> {selectedRequest.blockNumber}</p>
            <p><strong>Father's Number:</strong> {selectedRequest.fatherNumber}</p>
            <p><strong>Mother's Number:</strong> {selectedRequest.motherNumber}</p>
            <p><strong>Personal Number:</strong> {selectedRequest.personalNumber}</p>
            <p><strong>Reason:</strong> {selectedRequest.reason}</p>
            {selectedRequest.notes && <p><strong>Notes:</strong> {selectedRequest.notes}</p>}

            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                onClick={() => handleApprove(selectedRequest.id)}
                disabled={approvingId === selectedRequest.id}
              >
                {approvingId === selectedRequest.id ? "Approving..." : "Approve"}
              </button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
}