import React, { useState,useEffect } from "react";
import { useNavigate,useLocation  } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Popup from "../../components/Popup.jsx";




export default function Auth({ onLogin }) {

  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const [mode, setMode] = useState("login"); 
// "login" | "register" | "forgot"
const location = useLocation();
const [password, setPassword] = useState("");

const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [emailVerified, setEmailVerified] = useState(false);


const [submitAttempted, setSubmitAttempted] = useState(false);

  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    department: "",
    yearOfAdmission: "",
    address: "",
    fatherName: "",
    motherName: "",
    fatherOccupation: "",
    motherOccupation: "",
     fatherNumber: "",
     motherNumber: "",
     personalNumber: "",
     alternativeNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    roomNumber: "",
    blockNumber: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});
const generateEmail = (roll, year, department) => {
  if (roll.length === 16 && year.length === 4) {
    const yearSuffix = roll.substring(0, 2); // "23" or "24"
    const last3 = roll.slice(-3); // last 3 digits

    if (parseInt(year) === 2023) {
      // ✅ Department code mapping for 2023 batch
      const deptMap = {
        IT: "15",
        AIDS: "17",
        CSE: "12",
        ECE: "11",
        EEE: "13",
        CIVIL: "16",
        MECH: "10",
      };
      const deptCode = deptMap[department] || "00"; // fallback "00"
      return `${yearSuffix}${deptCode}${last3}@nec.edu.in`;
    } else if (parseInt(year) >= 2024) {
      // ✅ For 2024 and above → use substring(8, 11)
      const mid3 = roll.substring(8, 11); // e.g. "205"
      return `${yearSuffix}${mid3}${last3}@nec.edu.in`;
    }
  }
  return "";
};

// ✅ Helper to validate password strength
const validatePasswordStrength = (password) => {
  const minLength = /.{8,}/;
  const upper = /[A-Z]/;
  const lower = /[a-z]/;
  const number = /[0-9]/;
  const special = /[!@#$%^&*(),.?":{}|<>]/;

  if (!minLength.test(password))
    return "Password must be at least 8 characters long.";
  if (!upper.test(password))
    return "Password must contain at least one uppercase letter.";
  if (!lower.test(password))
    return "Password must contain at least one lowercase letter.";
  if (!number.test(password))
    return "Password must contain at least one number.";
  if (!special.test(password))
    return "Password must contain at least one special character.";
  
  return ""; // ✅ Strong password
};

 


  // Handle input changes with validations
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    // ✅ Validation rules
    if (name === "fullName") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        newErrors.fullName = "Only alphabets are allowed";
      } else {
        delete newErrors.fullName;
      }
    }

    if (name === "fatherName") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        newErrors.fatherName = "Only alphabets are allowed";
      } else {
        delete newErrors.fatherName;
      }
    }

    if (name === "motherName") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        newErrors.motherName = "Only alphabets are allowed";
      } else {
        delete newErrors.motherName;
      }
    }

    if (name === "rollNumber") {
      if (!/^\d*$/.test(value)) {
        newErrors.rollNumber = "Only numbers are allowed";
      } else if (value.length > 16) {
        newErrors.rollNumber = "Roll number cannot exceed 16 digits";
      } else {
        delete newErrors.rollNumber;
      }
    }

    if (name === "yearOfAdmission") {
      if (!/^\d{0,4}$/.test(value)) {
        newErrors.yearOfAdmission = "Enter a valid 4-digit year";
      } else if (value.length === 4 && (value < 2000 || value > new Date().getFullYear())) {
        newErrors.yearOfAdmission = "Enter a valid admission year";
      } else {
        delete newErrors.yearOfAdmission;
      }
    }

    if (name === "roomNumber") {
      if (!/^\d*$/.test(value)) {
        newErrors.roomNumber = "Room number must be numeric";
      } else {
        delete newErrors.roomNumber;
      }
    }

    if (name === "address") {
      if (value.trim().length < 10) {
        newErrors.address =
          "Please enter complete address (Door No, Block No, Street, District, State)";
      } else {
        delete newErrors.address;
      }
    }
if (name === "fatherNumber" || name === "motherNumber" || name === "personalNumber") {
  if (!/^\d{10}$/.test(value)) {
    newErrors[name] = "Enter a valid 10-digit number";
  } else {
    delete newErrors[name];
  }
}

if (name === "alternativeNumber") {
  if (value && !/^\d{10}$/.test(value)) {
    newErrors.alternativeNumber = "Enter a valid 10-digit number";
  } else {
    delete newErrors.alternativeNumber;
  }
}

    if (name === "blockNumber") {
      if (!["B", "C", "D", "E"].includes(value) && value !== "") {
        newErrors.blockNumber = "Block must be one of B, C, D, E";
      } else {
        delete newErrors.blockNumber;
      }
    }
    const updatedData = { ...formData, [name]: value };

// ✅ Auto-generate email whenever rollNumber + yearOfAdmission change

if (name === "password") {
  const passwordError = validatePasswordStrength(value);
  if (passwordError) {
    newErrors.password = passwordError;
  } else {
    delete newErrors.password;
  }
}



  
    setErrors(newErrors);
    setFormData({ ...formData, [name]: value });
  };
React.useEffect(() => {
  if (
    formData.rollNumber.length === 16 &&
    formData.yearOfAdmission.length === 4 &&
    formData.department
  ) {
    const genEmail = generateEmail(
      formData.rollNumber,
      formData.yearOfAdmission,
      formData.department
    );

    setFormData((prev) => ({ ...prev, email: genEmail }));
    setEmailVerified(false); // student must tick box
  } else {
    setEmailVerified(false);
  }
}, [formData.rollNumber, formData.yearOfAdmission, formData.department]);

    
  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
   setSubmitAttempted(true);
     if (!emailVerified) {
    return; // stop form submission
  }
    setLoading(true);
 try {
  if (mode === "forgot") {
    const res = await fetch("http://localhost:5000/student/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });
    const data = await res.json();

    if (res.ok) {
      toast.success("✅ Reset link sent to your email!");
      setMode("login");
    } else {
      toast.error("❌ " + (data.error || "Failed to send reset link"));
    }
  }

  if (mode === "register") {
      if (!otpSent) {
        if (formData.password !== formData.confirmPassword) {
          toast.error("❌ Passwords do not match!");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/student/request-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.ok) {
          toast.info("📩 OTP sent to your email!");
          setOtpSent(true);
        } else {
          toast.error("❌ " + (data.error || "Failed to send OTP"));
        }
      } else {
        const res = await fetch("http://localhost:5000/student/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp }),
        });

        const data = await res.json();
        if (res.ok) {
          setPopup({ show: true, message: "🎉 Registered successfully!", type: "success" });

          localStorage.setItem("student", JSON.stringify(data));
          localStorage.setItem("studentId", data.id);

          setTimeout(() => {
            navigate("/students/studentdashboard");
          }, 2000);
        } else {
          toast.error("❌ " + (data.error || "OTP verification failed"));
        }
      }
      return;
    }


  if (mode === "login") {
    const res = await fetch("http://localhost:5000/student/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();
    if (res.ok) {
  // ✅ Show centered toast
 setPopup({ show: true, message: "🎉 Login successful!", type: "success" });


  // Save user data
  localStorage.setItem("student", JSON.stringify(data));
  localStorage.setItem("studentId", data.id);
  onLogin(data);

  // Wait 2 seconds for the toast to show before redirect
  setTimeout(() => {
    navigate("/students/studentdashboard");
  }, 2000);
}
else {
      toast.error("❌ " + (data.error || "Login failed"));
    }
  }
} catch (err) {
  console.error(err);
  toast.error("❌ Server error");
}

    
    finally{

    setLoading(false);
    }
    return;
  };

  // Helper: field border style
  const getBorderStyle = (field, value) => {
    if (errors[field]) return "2px solid red";
    if (value) return "2px solid green";
    return "1px solid #ccc";
  };


  return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f4f4",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        {mode === "register"
          ? "Student Registration"
          : mode === "forgot"
          ? "Forgot Password"
          : "Student Login"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* ================== REGISTER FIELDS ================== */}
        {mode === "register" && !otpSent && (
          <>
            {/* Full Name & Roll Number */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name (Give full name)"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: getBorderStyle("fullName", formData.fullName),
                  }}
                  required
                />
                {errors.fullName && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  name="rollNumber"
                  placeholder="Roll Number (up to 16 digits)"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: getBorderStyle("rollNumber", formData.rollNumber),
                  }}
                  required
                />
                {errors.rollNumber && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.rollNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Department & Year */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={{ flex: 1, padding: "8px" }}
                required
              >
                <option value="">Select department</option>
                <option value="IT">IT</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="AIDS">AIDS</option>
              </select>

              <input
                type="text"
                name="yearOfAdmission"
                placeholder="Year of Admission (YYYY)"
                value={formData.yearOfAdmission}
                onChange={handleChange}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "5px",
                  border: getBorderStyle("yearOfAdmission", formData.yearOfAdmission),
                }}
                required
              />
            </div>
            {errors.yearOfAdmission && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.yearOfAdmission}
              </p>
            )}

            {/* Address */}
            <div style={{ marginBottom: "10px" }}>
              <textarea
                name="address"
                placeholder="Door No, Block No, Street, District, State"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: getBorderStyle("address", formData.address),
                }}
                required
              ></textarea>
              {errors.address && (
                <p style={{ color: "red", fontSize: "12px" }}>{errors.address}</p>
              )}
            </div>

            {/* Parents */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  name="fatherName"
                  placeholder="Father's Name"
                  value={formData.fatherName}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: getBorderStyle("fatherName", formData.fatherName),
                  }}
                  required
                />
              </div>

              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  name="motherName"
                  placeholder="Mother's Name"
                  value={formData.motherName}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: getBorderStyle("motherName", formData.motherName),
                  }}
                  required
                />
              </div>
            </div>

            {/* Occupations */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                name="fatherOccupation"
                placeholder="Father's Occupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                style={{ flex: 1, padding: "8px" }}
              />
              <input
                type="text"
                name="motherOccupation"
                placeholder="Mother's Occupation"
                value={formData.motherOccupation}
                onChange={handleChange}
                style={{ flex: 1, padding: "8px" }}
              />
            </div>
{/* Parents Numbers */}
<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
  <div style={{ flex: 1 }}>
    <input
      type="text"
      name="fatherNumber"
      placeholder="Father's Phone Number"
      value={formData.fatherNumber}
      onChange={handleChange}
      style={{ width: "100%", padding: "8px", borderRadius: "5px", border: getBorderStyle("fatherNumber", formData.fatherNumber) }}
      required
    />
    {errors.fatherNumber && <p style={{ color: "red", fontSize: "12px" }}>{errors.fatherNumber}</p>}
  </div>
  <div style={{ flex: 1 }}>
    <input
      type="text"
      name="motherNumber"
      placeholder="Mother's Phone Number"
      value={formData.motherNumber}
      onChange={handleChange}
      style={{ width: "100%", padding: "8px", borderRadius: "5px", border: getBorderStyle("motherNumber", formData.motherNumber) }}
      required
    />
    {errors.motherNumber && <p style={{ color: "red", fontSize: "12px" }}>{errors.motherNumber}</p>}
  </div>
</div>

{/* Personal Number & Alternative */}
<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
  <div style={{ flex: 1 }}>
    <input
      type="text"
      name="personalNumber"
      placeholder="Your Phone Number"
      value={formData.personalNumber}
      onChange={handleChange}
      style={{ width: "100%", padding: "8px", borderRadius: "5px", border: getBorderStyle("personalNumber", formData.personalNumber) }}
      required
    />
    {errors.personalNumber && <p style={{ color: "red", fontSize: "12px" }}>{errors.personalNumber}</p>}
  </div>
  <div style={{ flex: 1 }}>
    <input
      type="text"
      name="alternativeNumber"
      placeholder="Alternative Number (Optional)"
      value={formData.alternativeNumber}
      onChange={handleChange}
      style={{ width: "100%", padding: "8px", borderRadius: "5px", border: getBorderStyle("alternativeNumber", formData.alternativeNumber) }}
    />
    {errors.alternativeNumber && <p style={{ color: "red", fontSize: "12px" }}>{errors.alternativeNumber}</p>}
  </div>
</div>

            {/* Room & Block */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  name="roomNumber"
                  placeholder="Room Number"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: getBorderStyle("roomNumber", formData.roomNumber),
                  }}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <select
                  name="blockNumber"
                  value={formData.blockNumber}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: getBorderStyle("blockNumber", formData.blockNumber),
                  }}
                  required
                >
                  <option value="">Select Block</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* ================== EMAIL FIELD ================== */}
        <input
          type="email"
          name="email"
          placeholder="your.email@nec.edu.in"
          value={formData.email}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "5px",
            borderRadius: "5px",
            border: getBorderStyle("email", formData.email),
          }}
          required
        />
  {submitAttempted && !emailVerified && (
    <small style={{ color: "red", display: "block", marginTop: "4px" }}>
      ⚠️ Please verify your email before continuing.
    </small>

)}





        {/* ================== FORGOT PASSWORD ================== */}
        {mode === "forgot" && (
          <>
            {!otpSent ? (
              <p style={{ fontSize: "14px", marginBottom: "10px" }}>
                Enter your registered NEC email, we’ll send you a reset link.
              </p>
            ) : (
              <>
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
              </>
            )}
          </>
        )}

        {/* ================== EMAIL VERIFY CHECKBOX ================== */}
        {formData.email && mode !== "forgot" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "6px",
              marginBottom: "14px",
              padding: "6px 10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              background: "#f9f9f9",
              width: "fit-content",
            }}
          >
            <input
              type="checkbox"
              id="verifyEmail"
              checked={emailVerified}
              onChange={(e) => {
                if (/@nec\.edu\.in$/.test(formData.email)) {
                  setEmailVerified(e.target.checked);
                } else {
                  alert("❌ Invalid email format. Must end with @nec.edu.in");
                }
              }}
              style={{
                width: "16px",
                height: "16px",
                accentColor: emailVerified ? "green" : "red",
                marginRight: "8px",
                cursor: "pointer",
              }}
            />
            <label
              htmlFor="verifyEmail"
              style={{
                color: emailVerified ? "green" : "red",
                fontWeight: "600",
                fontSize: "10px",
                cursor: "pointer",
              }}
            >
              {emailVerified ? "Email Verified" : "Email not verified"}
            </label>
          </div>
        )}

        {/* ================== PASSWORD FIELD ================== */}
        {mode !== "forgot" && !otpSent && (
          <>
            <div style={{ position: "relative", marginBottom: "10px" }}>
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    style={{
      width: "100%",
      padding: "8px",
      borderRadius: "5px",
      border: getBorderStyle("password", formData.password),
    }}
    required
  />
  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
    }}
  >
    {showPassword ? "👁️" : "🙈"}
  </span>

  {/* ✅ Password strength feedback */}
  {errors.password && (
    <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
      {errors.password}
    </p>
  )}
</div>


            {/* Forgot password link */}
            {mode === "login" && (
              <p style={{ textAlign: "right", marginBottom: "10px" }}>
                <span
                  onClick={() => {
                    setMode("forgot");
                    setOtpSent(false);
                    setOtp("");
                  }}
                  style={{ color: "blue", cursor: "pointer" }}
                >
                  Forgot Password?
                </span>
              </p>
            )}
{/* ================== RESET PASSWORD ================== */}

 


            {/* Confirm Password only in register */}
            {mode === "register" && (
              <div style={{ position: "relative", marginBottom: "10px" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                  }}
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
                  {showConfirmPassword ? "👁️" : "🙈"}
                </span>
              </div>
            )}
          </>
        )}

        {/* OTP input only after OTP sent (register flow) */}
        {mode === "register" && otpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            required
          />
        )}

        {/* ================== SUBMIT BUTTON ================== */}
       <button
  type="submit"
  disabled={loading || (otpSent && otp.trim() === "")} 
  style={{
    width: "100%",
    background:
        loading || (otpSent && !otp)
        ? "gray"
        : "blue",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor:
      loading 
        ? "not-allowed"
        : "pointer",
    marginBottom: "10px",
  }}
>
  {loading
    ? mode === "register"
      ? otpSent
        ? "Verifying..."
        : "Sending OTP..."
      : mode === "forgot"
      ? "Sending link..."
      : mode === "reset"
      ? "Resetting..."
      : "Logging in..."
    : mode === "register"
    ? otpSent
      ? "Verify OTP"
      : "Request OTP"
    : mode === "forgot"
    ? otpSent
      ? "Reset Password"
      : "Send Reset Link"
    : mode === "reset"
    ? "Reset Password"
    : "Login"}
</button>

      </form>

      {/* ================== SWITCH MODE LINKS ================== */}
      <p style={{ textAlign: "center" }}>
        {mode === "login"
          ? "Don’t have an account? "
          : mode === "register"
          ? "Already have an account? "
          : "Remembered your password? "}
        <span
          onClick={() => {
            setMode(
              mode === "login"
                ? "register"
                : mode === "register"
                ? "login"
                : "login"
            );
            setOtpSent(false);
            setOtp("");
          }}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {mode === "login" ? "Register" : "Login"}
        </span>
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