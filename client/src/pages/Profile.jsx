import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Profile.css";

const Profile = () => {
  const [warden, setWarden] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch warden profile
  useEffect(() => {
    const storedWarden = localStorage.getItem("warden");
    if (storedWarden) {
      const wardenData = JSON.parse(storedWarden);
      fetch(`http://localhost:5000/warden/${wardenData.id}`)
        .then((res) => res.json())
        .then((data) => {
          setWarden(data);
          setFormData(data);
          localStorage.setItem("warden", JSON.stringify(data));
        })
        .catch(() => setError("Could not load profile"));
    } else {
      setError("Could not load profile");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    fetch(`http://localhost:5000/warden/${warden.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("⚠️ " + data.error);
        } else {
          alert(data.message || "Profile updated successfully");
          setWarden(formData);
          setIsEditing(false);
        }
      })
      .catch(() => alert("Server error. Please try again."));
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    fetch(`http://localhost:5000/warden/${warden.id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        localStorage.removeItem("warden");
        navigate("/wardenauth");
      })
      .catch((err) => console.error("Delete error:", err));
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("⚠️ New passwords do not match!");
      return;
    }

    fetch(`http://localhost:5000/warden/${warden.id}/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Password updated successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsChangingPassword(false);
      })
      .catch(() => alert("Server error. Please try again."));
  };

  if (error) return <p className="error">{error}</p>;
  if (!warden) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="profile avatar"
          className="profile-avatar"
        />
        <div>
          <h1>{warden.name}</h1>
          <p className="role">Warden</p>
        </div>
      </div>

      {/* ✅ Profile Info / Edit Section */}
      {isEditing ? (
        <div className="profile-form card">
          <h3>Edit Profile</h3>
          <div className="form-grid">
            <label>
              Full Name
              <input
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              Age
              <input
                name="age"
                value={formData.age || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              Gender
              <input
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              Date of Birth
              <input
                type="date"
                name="dob"
                value={formData.dob || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              Email
              <input
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              Phone
              <input
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </label>
            <label className="full-width">
              Address
              <textarea
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              Aadhaar
              <input
                name="aadhaar"
                value={formData.aadhaar || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              Username
              <input
                name="username"
                value={formData.username || ""}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="btn-group">
            <button className="save" onClick={handleSave}>
              💾 Save
            </button>
            <button className="cancel" onClick={() => setIsEditing(false)}>
              ✖ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-details card">
          <h3>Profile Details</h3>
          <div className="info-grid">
            <p><strong>Full Name:</strong> {warden.name}</p>
            <p><strong>Age:</strong> {warden.age}</p>
            <p><strong>Gender:</strong> {warden.gender}</p>
            <p><strong>Date of Birth:</strong> {warden.dob}</p>
            <p><strong>Email:</strong> {warden.email}</p>
            <p><strong>Phone:</strong> {warden.phone}</p>
            <p className="full-width"><strong>Address:</strong> {warden.address}</p>
            <p><strong>Aadhaar:</strong> {warden.aadhaar}</p>
            <p><strong>Username:</strong> {warden.username}</p>
          </div>

          <div className="btn-group">
            <button className="edit" onClick={() => setIsEditing(true)}>
              ✏️ Edit
            </button>
            <button
              className="password"
              onClick={() => setIsChangingPassword(true)}
            >
              🔒 Change Password
            </button>
            <button className="delete" onClick={handleDelete}>
              🗑 Delete
            </button>
          </div>
        </div>
      )}

      {/* ✅ Change Password Section */}
      {isChangingPassword && (
        <div className="password-card card">
          <h3>Change Password</h3>
          <div className="form-grid">
            <label>
              Current Password
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </label>
            <label>
              New Password
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </label>
            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </label>
          </div>

          <div className="btn-group">
            <button className="save" onClick={handlePasswordSubmit}>
              ✅ Update Password
            </button>
            <button
              className="cancel"
              onClick={() => setIsChangingPassword(false)}
            >
              ✖ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
