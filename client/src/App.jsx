/*import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import WardenAuth from "./pages/WardenAuth";
import Layout from "./components/Layout"; 
import Auth from "./pages/students/Auth";
import LoginPage from "./LoginPage";

import Students from "./pages/Students"; 



function App() {
  const [warden, setWarden] = useState(null);

  useEffect(() => {
    const savedWarden = localStorage.getItem("warden");
    if (savedWarden) {
      setWarden(JSON.parse(savedWarden));
    }
  }, []);

  const handleLogin = (wardenData) => {
    setWarden(wardenData);
    localStorage.setItem("warden", JSON.stringify(wardenData));
  };

  const handleLogout = () => {
    setWarden(null);
    localStorage.removeItem("warden");
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<WardenAuth onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            warden ? (
              <Layout>
                <Dashboard onLogout={handleLogout} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            warden ? (
              <Layout>
                <Notifications />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/reports"
          element={
            warden ? (
              <Layout>
                <Reports />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            warden ? (
              <Layout>
                <Profile warden={warden} onUpdate={setWarden} onDelete={handleLogout} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/auth" element={<Auth />} />

         <Route
          path="/students"
          element={
            warden ? (
              <Layout>
                <Students />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
/*
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import WardenAuth from "./pages/WardenAuth";
import Layout from "./components/Layout"; 
import Auth from "./pages/students/Auth";
import Students from "./pages/Students"; 
import LoginPage from "./LoginPage";
import StudentDashboard from "./pages/students/StudentDashboard";
import Stu_sidebar from "./pages/students/Stu_sidebar" ;// ✅ correct import (not inside /pages)
import Attendance from "./pages/students/Attendance";
import History from "./pages/students/History";
import ProfilePage from "./pages/students/ProfilePage";
import StudentLayout from "./components/StudentLayout";



function App() {
  const [warden, setWarden] = useState(null);
const [student, setStudent] = useState(null);

// Load student from localStorage on refresh
useEffect(() => {
  const savedStudent = localStorage.getItem("student");
  if (savedStudent) {
    setStudent(JSON.parse(savedStudent));
  }
}, []);

  // Load warden from localStorage on refresh
  useEffect(() => {
    const savedWarden = localStorage.getItem("warden");
    if (savedWarden) {
      setWarden(JSON.parse(savedWarden));
    }
  }, []);

  // Save warden data after login
  const handleLogin = (wardenData) => {
    setWarden(wardenData);
    localStorage.setItem("warden", JSON.stringify(wardenData));
  };

  // Clear warden data after logout
  const handleLogout = () => {
    setWarden(null);
    localStorage.removeItem("warden");
  };
  

  return (
    <Router>
      <Routes>
  
        <Route path="/" element={<Navigate to="/role" replace />} />

        <Route path="/role" element={<LoginPage />} />

        <Route path="/auth" element={<Auth />} />

        <Route path="/wardenauth" element={<WardenAuth onLogin={handleLogin} />} />

<Route
  path="/students/studentdashboard"
  element={
    student ? (
      <StudentLayout>
        <StudentDashboard />
      </StudentLayout>
    ) : (
      <Navigate to="/auth" replace />
    )
  }
/>

<Route
  path="/students/attendance"
  element={
    student ? (
      <StudentLayout>
        <Attendance />
      </StudentLayout>
    ) : (
      <Navigate to="/auth" replace />
    )
  }
/>

<Route
  path="/students/history"
  element={
    student ? (
      <StudentLayout>
        <History />
      </StudentLayout>
    ) : (
      <Navigate to="/auth" replace />
    )
  }
/>

<Route
  path="/students/profile"
  element={
    student ? (
      <StudentLayout>
        <ProfilePage />
      </StudentLayout>
    ) : (
      <Navigate to="/auth" replace />
    )
  }
/>


<Route path="/" element={<Navigate to="/auth" replace />} />

<Route path="*" element={<h1>404 - Page Not Found</h1>} />

        <Route
          path="/dashboard"
          element={
            warden ? (
              <Layout>
                <Dashboard onLogout={handleLogout} />
              </Layout>
            ) : (
              <Navigate to="/wardenauth" replace />
            )
          }
        />

        <Route
          path="/notifications"
          element={
            warden ? (
              <Layout>
                <Notifications />
              </Layout>
            ) : (
              <Navigate to="/wardenauth" replace />
            )
          }
        />

        <Route
          path="/reports"
          element={
            warden ? (
              <Layout>
                <Reports />
              </Layout>
            ) : (
              <Navigate to="/wardenauth" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            warden ? (
              <Layout>
                <Profile
                  warden={warden}
                  onUpdate={setWarden}
                  onDelete={handleLogout}
                />
              </Layout>
            ) : (
              <Navigate to="/wardenauth" replace />
            )
          }
        />

        <Route
          path="/students"
          element={
            warden ? (
              <Layout>
                <Students />
              </Layout>
            ) : (
              <Navigate to="/wardenauth" replace />
            )
          }
        />

        
      </Routes>
    </Router>
  );
}

export default App;
*/


import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Warden Pages
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Students from "./pages/Students";
import Profile from "./pages/Profile";
import WardenAuth from "./pages/WardenAuth";
import Sidebar from "./components/Sidebar";
import ResetPassword from "./pages/students/ResetPassword";
// Student Pages
import Auth from "./pages/students/Auth";
import StudentDashboard from "./pages/students/StudentDashboard";
import Attendance from "./pages/students/Attendance";
import History from "./pages/students/History";
import ProfilePage from "./pages/students/ProfilePage";
import StudentLayout from "./components/StudentLayout";
import ForgotPassword from "./pages/ForgotPassword";
import WardenPendingRequests from "./pages/WardenPendingRequests";

import WardenAttendanceHistory from "./pages/WardenAttendanceHistory"; 
import StudentQRScan from "./pages/students/StudentQRScan";
import AttendanceMark from "./pages/students/AttendanceMark";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Role selection
import LoginPage from "./LoginPage";
import StayRequest from "./pages/students/StayRequest";
import WardenStayRequests from "./pages/WardenStayRequests";
import WardenCreateHoliday from "./pages/WardenCreateHoliday";

function App() {
  const [warden, setWarden] = useState(null);
  const [student, setStudent] = useState(null);
  
  const [loading, setLoading] = useState(true); // ✅ added

 useEffect(() => {
  const savedStudent = localStorage.getItem("student");
  const savedWarden = localStorage.getItem("warden");

  if (savedStudent) setStudent(JSON.parse(savedStudent));
  if (savedWarden) setWarden(JSON.parse(savedWarden));

  setLoading(false); // ✅ Important! — without this, "Loading..." will never go away
}, []);


  // Warden login/logout
  const handleLogin = (wardenData) => {
    setWarden(wardenData);
    localStorage.setItem("warden", JSON.stringify(wardenData));
  };
  const handleLogout = () => {
    setWarden(null);
    localStorage.removeItem("warden");
  };

  // Student login
  const handleStudentLogin = (studentData) => {
    setStudent(studentData);
    localStorage.setItem("student", JSON.stringify(studentData));
  };

   // ✅ Show nothing (or a loader) while checking localStorage
  if (loading) return <div>Loading...</div>;

  return (
    <>
    
    <Router>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/role" replace />} />
        <Route path="/role" element={<LoginPage />} />

        {/* Student Auth */}
        <Route path="/auth" element={<Auth onLogin={handleStudentLogin} />} />

        {/* Warden Auth */}
        <Route path="/wardenauth" element={<WardenAuth onLogin={handleLogin} />} />

        {/* Student Routes */}
        <Route
          path="/students/studentdashboard"
          element={
            student ? (
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/students/attendance"
          element={
            student ? (
              <StudentLayout>
                <Attendance />
              </StudentLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
       <Route
          path="/students/stay-request"
          element={
            student ? (
              <StudentLayout>
                <StayRequest/>
              </StudentLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/students/history"
          element={
            student ? (
              <StudentLayout>
                <History />
              </StudentLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/students/profile"
          element={
            student ? (
              <StudentLayout>
                <ProfilePage />
              </StudentLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Warden Routes */}

        <Route
          path="/dashboard"
          element={
            warden ? (
              
              <Sidebar>
                <Dashboard onLogout={handleLogout} />
              </Sidebar>
            ) : (
              <Navigate to="/wardenauth" replace />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            warden ? (
              <Sidebar>
                <Notifications />
              </Sidebar>
            ) : (
              <Navigate to="/wardenauth" replace />
            )
          }
        />
         <Route
          path="/pending-requests"
          element={
            student ? (
              <Sidebar>
                <WardenPendingRequests />
              </Sidebar>
            ) : (
              <Navigate to="/wardeauth" replace />
            )
          }
        />

         <Route
          path="/attendance-history"
          element={
            warden ? (
              <Sidebar>
                <WardenAttendanceHistory />
              </Sidebar>
            ) : (
              <Navigate to="/wardenauth" replace />
            )
          }
        />
        
        <Route
          path="/profile"
          element={
            warden ? (
              <Sidebar>
                <Profile
                  warden={warden}
                  onUpdate={setWarden}
                  onDelete={handleLogout}
                />
              </Sidebar>
            ) : (
              <Navigate to="/wardenauth" replace />
            )
          }
        />
<Route path="/forgot-password" element={<ForgotPassword />} />

        
        <Route
          path="/students"
          element={
            warden ? (
              <Sidebar>
                <Students />
              </Sidebar>
            ) : (
              <Navigate to="/wardenauth" replace />
            )
          }
        />

      <Route
          path="/warden/stay-requests"
          element={
            warden ? (
              <Sidebar>
                <WardenStayRequests/>
              </Sidebar>
            ) : (
              <Navigate to="/wardenauth" replace />
            )
          }
        />

         <Route
          path="/warden/create-holiday"
          element={
            warden ? (
              <Sidebar>
                <WardenCreateHoliday/>
              </Sidebar>
            ) : (
              <Navigate to="/wardenauth" replace />
            )
          }
        />

   <Route path="/reset-password/:token" element={<ResetPassword />} />
<Route path="/student/scanner" element={<StudentQRScan />} />
 <Route path="/student/attendance-mark" element={<AttendanceMark />} />
        {/* Fallback */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />

      </Routes>
      

    </Router>

    <ToastContainer
  position="top-center" // still required, but we'll override with CSS
  autoClose={2500}
  hideProgressBar={false}
  closeOnClick
  draggable
  pauseOnHover
  toastStyle={{
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    color: "white",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "16px",
    padding: "14px 22px",
    backdropFilter: "blur(5px)",
  }}
/>

</>




  );
}

export default App;

