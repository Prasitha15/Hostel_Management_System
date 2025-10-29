import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { requestOtp, verifyOtp, resetPassword } from "../api";
import "../Styles/ForgotPassword.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const [stage, setStage] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    if (!email) {
      toast.warn("⚠️ Please enter your email");
      return;
    }
    try {
      const response = await requestOtp(email);
      toast.success(response.message);
      setStage("otp");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error requesting OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warn("⚠️ Please enter OTP");
      return;
    }
    try {
      const res = await verifyOtp(email, otp);
      toast.success(res.data.message);
      setStage("reset");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error verifying OTP");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.warn("⚠️ Fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warn("⚠️ Passwords do not match");
      return;
    }
    try {
      const res = await resetPassword(email, newPassword);
      toast.success(res.data.message);

      setTimeout(() => {
        navigate("/WardenAuth");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error resetting password");
    }
  };

  return (
    <div className="warden-auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>

        {stage === "email" && (
          <>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button onClick={handleRequestOtp}>Send OTP</button>
          </>
        )}

        {stage === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
          </>
        )}

        {stage === "reset" && (
          <>
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <div style={{ position: "relative", marginBottom: "10px" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <button onClick={handleResetPassword}>Reset Password</button>
          </>
        )}
      </div>

      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
}
