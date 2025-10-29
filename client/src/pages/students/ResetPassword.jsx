import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL (example: /reset-password/:token)
  useEffect(() => {
    if (location.pathname.startsWith("/reset-password/")) {
      const t = location.pathname.split("/reset-password/")[1];
      setToken(t);
    }
  }, [location]);

 const handleReset = async (e) => {
  e.preventDefault();
  if (newPassword !== confirmPassword) {
    alert("❌ Passwords do not match");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`http://localhost:5000/student/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Password reset successful. Please login.");
      navigate("/auth"); // go back to login
    } else {
      alert("❌ " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Server error. Try again later.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center" }}>🔑 Reset Password</h2>
      <form onSubmit={handleReset}>
        <p style={{ fontSize: "14px", marginBottom: "10px" }}>
          Enter your new password below.
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "gray" : "blue",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
