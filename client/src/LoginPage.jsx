import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/Login.css";
import { Building2, Home, Users2, Wifi, Utensils, CheckCircle2, School } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  const [showRoleCard, setShowRoleCard] = useState(false);

  const go = (r) => {
    if (r === "student") navigate("/auth");
    else navigate("/wardenauth");
  };

  return (
    <div className="nec-homepage">
      {/* Header */}
      <header className="site-header">
        <div className="brand">
          <div className="brand-badge" aria-hidden="true">
            <Building2 className="brand-icon" size={40} />
          </div>
          <div className="brand-text">
            <div className="college-name">National Engineering College</div>
            <div className="tagline">Smart Attendance • Smarter Hostel</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="accent">NEC Hostel Portal</span>
            </h1>
            <p className="hero-text">
              Manage hostel attendance, stay requests, and reports effortlessly.
            </p>

            {/* Role Selection */}
            <div className="role-selection-section">
              <h3 className="role-title">Choose Your Role</h3>
              <p className="role-subtitle">
                Access the system as a Student or Warden/Faculty.
              </p>

              <div className="role-cards">
                <div
                  className={`role-card ${role === "student" ? "selected" : ""}`}
                  onClick={() => setRole("student")}
                >
                  <div className="role-icon"><School size={36} /></div>
                  <h4>Student</h4>
                  <p>Mark attendance, submit requests, and view reports</p>
                  <ul className="role-features">
                    <li>QR Code Attendance</li>
                    <li>Stay & Leave Requests</li>
                    <li>Attendance Analytics</li>
                  </ul>
                </div>

                <div
                  className={`role-card ${role === "warden" ? "selected" : ""}`}
                  onClick={() => setRole("warden")}
                >
                  <div className="role-icon"><Users2 size={36} /></div>
                  <h4>Warden / Faculty</h4>
                  <p>Monitor and manage hostel attendance efficiently</p>
                  <ul className="role-features">
                    <li>Approve Student Requests</li>
                    <li>Generate Reports</li>
                    <li>Real-Time Insights</li>
                  </ul>
                </div>
              </div>

              {/* Continue Button */}
              <button
                className="btn primary sign-in-btn"
                onClick={() => setShowRoleCard(true)}
                aria-label="Continue"
              >
                Continue as {role === "student" ? "Student" : "Warden"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-container">
          <div className="info-text">
            <h2>About NEC Hostel</h2>
            <p>
              NEC Hostel provides a secure, comfortable, and digitally managed
              environment for students. The Smart Attendance system ensures
              transparent and efficient tracking of attendance and stay requests.
            </p>
            <ul>
              <li><CheckCircle2 size={16} /> Digital Attendance System</li>
              <li><CheckCircle2 size={16} /> Warden Dashboard for Approvals</li>
              <li><CheckCircle2 size={16} /> Safe & Hygienic Accommodation</li>
              <li><CheckCircle2 size={16} /> 24x7 Internet & Security</li>
            </ul>
          </div>
          <div className="info-icon">
            <Home size={120} className="info-icon-style" />
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="facilities-section">
        <h2>Our Hostel Facilities</h2>
        <div className="facilities-grid">
          <div className="facility-card">
            <Building2 size={40} />
            <h4>Spacious Rooms</h4>
            <p>Well-ventilated, student-friendly accommodations.</p>
          </div>
          <div className="facility-card">
            <Utensils size={40} />
            <h4>Healthy Mess</h4>
            <p>Nutritious meals served with hygiene and care.</p>
          </div>
          <div className="facility-card">
            <Wifi size={40} />
            <h4>Wi-Fi Access</h4>
            <p>High-speed internet access for all residents.</p>
          </div>
          <div className="facility-card">
            <Home size={40} />
            <h4>Clean Campus</h4>
            <p>Regular maintenance ensures a fresh environment.</p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
<section className="why-choose-section">
  <h2>Why Choose the NEC Hostel Management System?</h2>
  <p className="why-subtitle">
    A modern, efficient, and transparent approach to managing hostel operations — built to make life easier for students, wardens, and administrators.
  </p>

  <div className="why-grid">
    <div className="why-card">
      <h4>⚙️ Streamlined Process</h4>
      <p>
        From room allocation to stay approvals, everything is digitized. Say goodbye to manual registers and piles of paperwork.
      </p>
    </div>

    <div className="why-card">
      <h4>📱 Accessible Anytime</h4>
      <p>
        The portal is available 24×7 from any device. Students can apply, wardens can review, and admins can monitor — all remotely.
      </p>
    </div>

    <div className="why-card">
      <h4>💡 Transparent & Secure</h4>
      <p>
        Every approval and request is recorded with timestamps. No lost documents, no confusion — full accountability ensured.
      </p>
    </div>

    <div className="why-card">
      <h4>📊 Real-Time Updates</h4>
      <p>
        Notifications, analytics, and dashboards give live insights into hostel capacity, attendance, and student requests.
      </p>
    </div>
  </div>
</section>

{/* EFFICIENCY COMPARISON SECTION */}
<section className="comparison-section">
  <h2>Traditional vs Digital: A Smarter Choice</h2>
  <div className="comparison-table">
    <div className="comparison-row header">
      <div>Feature</div>
      <div>Traditional Method</div>
      <div>Digital System</div>
    </div>
    <div className="comparison-row">
      <div>Room Allocation</div>
      <div>Manual entries & paper forms</div>
      <div>Instant database updates</div>
    </div>
    <div className="comparison-row">
      <div>Stay Approval</div>
      <div>Warden signs paper forms</div>
      <div>Online request & one-click approval</div>
    </div>
    <div className="comparison-row">
      <div>Student Record</div>
      <div>Physical ledgers prone to damage</div>
      <div>Secure, backed-up digital records</div>
    </div>
    <div className="comparison-row">
      <div>Notifications</div>
      <div>No instant updates</div>
      <div>Real-time email/SMS alerts</div>
    </div>
  </div>
</section>

{/* IMPACT SECTION */}
<section className="impact-section">
  <h2>Driving Efficiency and Innovation in Hostel Management</h2>
  <p className="impact-subtitle">
    The NEC Hostel Portal isn’t just a management system — it’s a step toward a smarter, paperless, and student-friendly campus.
  </p>

  <div className="impact-grid">
    <div className="impact-card">
      <h4>🌍 Eco-Friendly Approach</h4>
      <p>
        By eliminating manual registers and paperwork, the system significantly reduces paper waste and promotes a sustainable campus environment.
      </p>
    </div>

    <div className="impact-card">
      <h4>💼 Administrative Efficiency</h4>
      <p>
        Warden and faculty workloads are reduced by automating approvals, attendance tracking, and report generation — enabling them to focus on what truly matters: student welfare.
      </p>
    </div>

    <div className="impact-card">
      <h4>📈 Scalable for Future Growth</h4>
      <p>
        Designed with modular architecture, the system can easily integrate with future academic or hostel management tools, ensuring long-term usability.
      </p>
    </div>

    <div className="impact-card">
      <h4>🧠 Data-Driven Insights</h4>
      <p>
        Real-time analytics provide valuable data on attendance trends, helping administrators make informed policy decisions for better hostel governance.
      </p>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="site-footer">
        <div>
          Made with ❤️ by NEC Hostel Team • © {new Date().getFullYear()} <br />
          National Engineering College, Kovilpatti
        </div>
      </footer>

      {/* Role Confirmation Modal */}
      {showRoleCard && (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="role-card-modal">
            <button
              className="close"
              onClick={() => setShowRoleCard(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <h2>Confirm Your Role</h2>
            <p className="role-confirm-text">
              You've selected to continue as a{" "}
              <strong>{role === "student" ? "Student" : "Warden / Faculty"}</strong>
            </p>

            <div className="role-preview">
              <div className={`role-preview-card ${role === "student" ? "active" : ""}`}>
                <div className="preview-icon">
                  {role === "student" ? <School size={48} /> : <Users2 size={48} />}
                </div>
                <h3>{role === "student" ? "Student Portal" : "Warden / Faculty Portal"}</h3>
                <p>
                  {role === "student"
                    ? "Access your attendance, submit requests, and stay updated."
                    : "Approve student requests, manage attendance, and view reports."}
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowRoleCard(false)}>
                Change Role
              </button>
              <button
                className="btn primary"
                onClick={() => {
                  setShowRoleCard(false);
                  go(role);
                }}
              >
                Proceed to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
