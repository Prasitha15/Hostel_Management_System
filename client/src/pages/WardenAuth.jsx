import React, { useState } from "react";
import "../Styles/WardenAuth.css";
import { registerWardenmail, loginWardenmail, verifyWardenOTP } from "../api.js";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Popup from "../components/Popup.jsx";


export default function WardenAuth({ onLogin }) {
  console.log("WardenAuth rendered at:", window.location.pathname);

  const [isNewWarden, setIsNewWarden] = useState(false);
  const [otpStage, setOtpStage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    aadhaar: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  // Regex
  const nameRegex = /^[A-Za-z\s]{1,50}$/;
  const phoneRegex = /^[0-9]{10}$/;
  const aadhaarRegex = /^[0-9]{12}$/;
  const strongPasswordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && value !== "" && !nameRegex.test(value)) return;

    if (name === "phone") {
      if (value !== "" && !/^[0-9]*$/.test(value)) return;
      if (value.length > 10) return;
    }

    if (name === "aadhaar") {
      if (value !== "" && !/^[0-9]*$/.test(value)) return;
      if (value.length > 12) return;
    }

    if (name === "dob") {
      const calculatedAge = calculateAge(value);
      setFormData({ ...formData, dob: value, age: calculatedAge });
      return;
    }

    if (name === "password") {
      if (strongPasswordRegex.test(value)) {
        setPasswordStrength("Strong ✅");
      } else {
        setPasswordStrength(
          "Weak ❌ (Use letters, numbers & special chars, min 8)"
        );
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!nameRegex.test(formData.name)) return "Invalid Name";
    if (formData.age <= 0) return "Invalid Age";
    if (!phoneRegex.test(formData.phone)) return "Phone must be 10 digits";
    if (!aadhaarRegex.test(formData.aadhaar))
      return "Aadhaar must be 12 digits";
    if (!strongPasswordRegex.test(formData.password))
      return "Password is weak. Use letters, numbers & special chars, min 8";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isNewWarden && !otpStage) {
        // Registration Step
        const errorMsg = validateForm();
        if (errorMsg) {
          toast.error("⚠️ " + errorMsg);
          return;
        }

        const res = await registerWardenmail(formData);
        if (res.error) {
          toast.success(res.error);
        } else {
          
          toast.success("✅ OTP sent to your email. Please verify.");
          setOtpStage(true);
        }
      } else if (isNewWarden && otpStage) {
        // OTP Verification Step
        const res = await verifyWardenOTP(formData.email, otp);
        if (res.error) {
          toast.success(res.error);
        } else {
          setPopup({ show: true, message: "Registration Successful", type: "success" });
          setIsNewWarden(false);
          setOtpStage(false);
        }
      } else {
        // Login Step
        const res = await loginWardenmail({
          username: formData.username,
          password: formData.password,
        });

        if (res.error) {
          if (
            res.error === "Invalid username" ||
            res.error === "Invalid password" ||
            res.error === "User does not exist"
          ) {
            toast.success("⚠️ User does not exist");
          } else {
            toast.success("⚠️ " + res.error);
          }
        } else {
          setPopup({ show: true, message: "Login Successful", type: "success" });

          localStorage.setItem("wardenId", res.warden.id);
          onLogin(res.warden);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000); // 2 seconds to show popup

        }
      }
    } catch (err) {
      console.error(err);
     toast.success("⚠️ Server error. Please try again.");
    }
  };

  return (
    <div className="warden-auth-container">
      <div className="auth-card">
        <h2>
          {isNewWarden
            ? otpStage
              ? "Verify OTP"
              : "Warden Registration"
            : "Warden Login"}
        </h2>

        <form onSubmit={handleSubmit} className="warden-form">
          {/* Registration Form */}
          {isNewWarden && !otpStage && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />

              {/* Auto-filled Age */}
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                readOnly
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <textarea
                name="address"
                placeholder="Residential Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="aadhaar"
                placeholder="Aadhaar / ID Number"
                value={formData.aadhaar}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />

              {/* Password + Eye toggle */}
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              {formData.password && (
                <p className="password-strength">{passwordStrength}</p>
              )}

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* OTP Stage */}
          {isNewWarden && otpStage && (
            <>
              <p>Enter the OTP sent to your email:</p>
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </>
          )}

          {/* Login Form */}
          {!isNewWarden && !otpStage && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {/* Forgot Password link */}
              <p
                className="forgot-text"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </p>
            </>
          )}

          <button type="submit" className="auth-btn">
            {isNewWarden ? (otpStage ? "Verify OTP" : "Register") : "Login"}
          </button>
        </form>

        {/* Toggle between login & registration */}
        <p className="toggle-text">
          {isNewWarden ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setIsNewWarden(false);
                  setOtpStage(false);
                }}
              >
                Login here
              </span>
            </>
          ) : (
            <>
              New warden?{" "}
              <span onClick={() => setIsNewWarden(true)}>Register here</span>
            </>
          )}
        </p>
      </div>

      {popup.show && (
          <Popup
            message={popup.message}
            type={popup.type}
            onClose={() => setPopup({ show: false, message: "", type: "" })}
          />
        )}

    </div>

    
  );
}
