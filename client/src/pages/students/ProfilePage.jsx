import React, { useEffect, useState } from "react";
import Stu_sidebar from "./Stu_sidebar";
import { motion } from "framer-motion";
import { FaUser, FaUsers, FaCalendarAlt, FaEnvelope, FaMapMarkerAlt, FaIdCard, FaBriefcase, FaGraduationCap } from "react-icons/fa";
import "./studentprofile.css";

export default function ProfilePage() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");

    if (studentId) {
      fetch(`http://localhost:5000/student/profile/${studentId}`)
        .then((res) => res.json())
        .then((data) => setStudent(data))
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, []);

  if (!student) {
    return (
      <div className="profile-layout">
        <Stu_sidebar />
        <div className="profile-content">
          <div className="profile-loading">
            <div className="loading-spinner"></div>
            <p>Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-layout">
      <Stu_sidebar />

      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-header-info">
            <h1 className="profile-name">{student.fullName}</h1>
            <p className="profile-role">Student</p>
            <div className="profile-badges">
              <span className="badge badge-primary">
                <FaIdCard /> {student.rollNumber}
              </span>
              <span className="badge badge-secondary">
                <FaGraduationCap /> {student.department}
              </span>
            </div>
          </div>
        </div>

        {/* Top Row - Personal and Contact Side by Side */}
        <div className="profile-row-two">
          {/* Personal Information */}
          <motion.div
            className="profile-card-horizontal"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="card-header-profile">
              <div className="card-title-wrapper-profile">
                <FaUser className="card-icon-profile" />
                <h3 className="card-title-profile">Personal Information</h3>
              </div>
            </div>
            <div className="card-content-profile">
              <div className="info-group">
                <div className="info-item">
                  <FaUser className="info-icon" />
                  <div className="info-details">
                    <span className="info-label-profile">Full Name</span>
                    <span className="info-value-profile">{student.fullName}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <FaIdCard className="info-icon" />
                  <div className="info-details">
                    <span className="info-label-profile">Roll Number</span>
                    <span className="info-value-profile">{student.rollNumber}</span>
                  </div>
                </div>

                <div className="info-item">
                  <FaGraduationCap className="info-icon" />
                  <div className="info-details">
                    <span className="info-label-profile">Department</span>
                    <span className="info-value-profile">{student.department}</span>
                  </div>
                </div>

                <div className="info-item">
                  <FaCalendarAlt className="info-icon" />
                  <div className="info-details">
                    <span className="info-label-profile">Year of Admission</span>
                    <span className="info-value-profile">{student.yearOfAdmission}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="profile-card-horizontal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="card-header-profile">
              <div className="card-title-wrapper-profile">
                <FaEnvelope className="card-icon-profile" />
                <h3 className="card-title-profile">Contact Information</h3>
              </div>
            </div>
            <div className="card-content-profile">
              <div className="info-group">
                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <div className="info-details">
                    <span className="info-label-profile">Email Address</span>
                    <span className="info-value-profile">{student.email}</span>
                  </div>
                </div>

                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <div className="info-details">
                    <span className="info-label-profile">Address</span>
                    <span className="info-value-profile">{student.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Family Information - Full Width with Two Columns Inside */}
        <motion.div
          className="profile-card-full-width"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="card-header-profile">
            <div className="card-title-wrapper-profile">
              <FaUsers className="card-icon-profile" />
              <h3 className="card-title-profile">Family Information</h3>
            </div>
          </div>
          <div className="card-content-profile">
            <div className="family-row">
              <div className="family-section">
                <h4 className="family-title">Father's Details</h4>
                <div className="info-group">
                  <div className="info-item">
                    <FaUser className="info-icon" />
                    <div className="info-details">
                      <span className="info-label-profile">Name</span>
                      <span className="info-value-profile">{student.fatherName}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaBriefcase className="info-icon" />
                    <div className="info-details">
                      <span className="info-label-profile">Occupation</span>
                      <span className="info-value-profile">
                        {student.fatherOccupation || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="family-section">
                <h4 className="family-title">Mother's Details</h4>
                <div className="info-group">
                  <div className="info-item">
                    <FaUser className="info-icon" />
                    <div className="info-details">
                      <span className="info-label-profile">Name</span>
                      <span className="info-value-profile">{student.motherName}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaBriefcase className="info-icon" />
                    <div className="info-details">
                      <span className="info-label-profile">Occupation</span>
                      <span className="info-value-profile">
                        {student.motherOccupation || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Registration Info - Full Width */}
        <motion.div
          className="profile-card-full-width profile-card-accent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="card-header-profile">
            <div className="card-title-wrapper-profile">
              <FaCalendarAlt className="card-icon-profile" />
              <h3 className="card-title-profile">Registration Details</h3>
            </div>
          </div>
          <div className="card-content-profile">
            <div className="info-item">
              <FaCalendarAlt className="info-icon" />
              <div className="info-details">
                <span className="info-label-profile">Registered On</span>
                <span className="info-value-profile">
                  {student.registrationDate || student.created_at || "Not available"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}