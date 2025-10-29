

// src/api.js
import axios from "axios";
const API_URL = "http://localhost:5000";
// ------------------ Warden APIs ------------------

export async function registerWarden(data) {
  const res = await fetch(`${API_URL}/warden/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function loginWarden(data) {
  const res = await fetch(`${API_URL}/warden/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function getWardenProfile(id) {
  const res = await fetch(`${API_URL}/warden/${id}`);
  return await res.json();
}

export async function updateWarden(id, data) {
  const res = await fetch(`${API_URL}/warden/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      aadhaar: data.aadhaar,
      emergency_contact: data.emergency_contact,
      father_name: data.father_name,
      mother_name: data.mother_name,
      spouse_name: data.spouse_name,
    }),
  });
  return await res.json();
}

export async function deleteWarden(id) {
  const res = await fetch(`${API_URL}/warden/${id}`, { method: "DELETE" });
  return await res.json();
}

// ------------------ Notifications APIs ------------------

export async function fetchNotifications() {
  try {
    const res = await fetch(`${API_URL}/notifications`);
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return await res.json();
  } catch (err) {
    console.error("❌ Fetch notifications error:", err);
    return [];
  }
}
export async function addNotification(data) {
  try {
    const res = await fetch(`${API_URL}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    console.log("🚀 Add Notification Response:", result); // debug
    return result;
  } catch (err) {
    console.error("❌ Add notification error:", err);
    return { error: "Server error" };
  }
}

// ------------------ Student & Attendance APIs ------------------
// ✅ Fetch all students (with optional search + category)
export async function fetchStudents({ search = "", category = "" } = {}) {
  try {
    let url = `${API_URL}/api/students`;

    // ✅ Build query params safely
    const params = new URLSearchParams();
    if (search.trim() !== "") params.append("search", search.trim());
    if (category.trim() !== "") params.append("category", category.trim());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch students");

    const data = await res.json();

    // ✅ Normalize response keys
    return data.map((s) => ({
      id: s.id,
      fullName: s.fullName,
      department: s.department,
      rollNumber: s.rollNumber,
      roomNumber: s.roomNumber || s.room_no,
      blockNumber: s.blockNumber || s.block_no,
      attendance: s.attendance,
    }));
  } catch (err) {
    console.error("❌ Failed to fetch students:", err);
    throw err;
  }
}


export async function markAttendance(id, status) {
  const res = await fetch(`${API_URL}/attendance/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to mark attendance");
  return await res.json();
}

export async function toggleAttendance(id, status) {
  const res = await fetch(`${API_URL}/attendance/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update attendance");
  return await res.json();
}


// ------------------ Warden Enable/Disable Attendance ------------------

// ✅ Get Warden Status
export async function getWardenStatus() {
  try {
    const res = await fetch(`${API_URL}/api/warden-status`);
    if (!res.ok) throw new Error("Failed to fetch warden status");
    return await res.json();
  } catch (err) {
    console.error("❌ Fetch warden status error:", err);
    return { wardenEnabled: false };
  }
}

// ✅ Update Warden Status
export async function setWardenStatus(enabled) {
  try {
    const res = await fetch(`${API_URL}/api/warden-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    if (!res.ok) throw new Error("Failed to update warden status");
    return await res.json();
  } catch (err) {
    console.error("❌ Set warden status error:", err);
    return { error: "⚠️ Could not update warden status" };
  }
}

// ------------------ Dashboard APIs ------------------


export const fetchDashboardStats = async () => {
  try {
    const res = await fetch(`${API_URL}/students/stats`);
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// ------------------ Warden OTP APIs ------------------

// Step 1: Register Warden (send OTP to email)
export async function registerWardenmail(data) {
  const res = await fetch(`${API_URL}/warden/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

// Step 2: Verify OTP (finalize registration & save in DB)
export async function verifyWardenOTP(email, otp) {
  const res = await fetch(`${API_URL}/warden/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return await res.json();
}

// Step 3: Login Warden
export async function loginWardenmail(data) {
  const res = await fetch(`${API_URL}/warden/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}



// ------------------ Password Reset APIs ------------------

// 1. Request OTP

export async function requestOtp(email) {
  try {
    const res = await axios.post(`${API_URL}/request-otp`, { email });
    return res.data; // returns { message: "OTP sent successfully" }
  } catch (err) {
    console.error("Error in requestOtp:", err);
    throw err.response?.data || { error: "Request OTP failed" };
  }
}

// ✅ Verify OTP
export async function verifyOtp(email, otp) {
  try {
    const res = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return res;
  } catch (err) {
    console.error("Error in verifyOtp:", err);
    throw err.response?.data || { error: "Verify OTP failed" };
  }
}

// ✅ Reset Password
export async function resetPassword(email, newPassword) {
  try {
    const res = await axios.post(`${API_URL}/reset-password`, {
      email,
      newPassword,
    });
    return res;
  } catch (err) {
    console.error("Error in resetPassword:", err);
    throw err.response?.data || { error: "Reset password failed" };
  }
}
export const fetchAttendanceStats = async () => {
  const res = await fetch("http://localhost:5000/api/attendance-stats");
  return await res.json();
};

export const fetchAttendanceOverall = async () => {
  const res = await fetch("http://localhost:5000/api/attendance-overall");
  return await res.json();
};
// leave
// Fetch all pending leave/outing requests
export const fetchPendingRequests = async () => {
  const res = await fetch("http://localhost:5000/api/pending-requests");
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
};

// Approve a specific request
export const approveRequest = async (requestId) => {
  const res = await fetch(`http://localhost:5000/api/approve-request/${requestId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to approve request");
  return res.json();
};

export const fetchAttendanceHistory = async ({ date, month, studentId }) => {
  let url = `/api/attendance-history?`;
  if (date) url += `date=${date}&`;
  if (month) url += `month=${month}&`;
  if (studentId) url += `studentId=${studentId}&`;

  const res = await fetch(url);
  return res.json();
};

