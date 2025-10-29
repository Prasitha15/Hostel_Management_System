// src/components/StudentLayout.jsx
import React from "react";
import Stu_sidebar from "../pages/students/Stu_sidebar";

export default function StudentLayout({ children, onLogout }) {
  return (
    <div className="student-layout">
      <Stu_sidebar onLogout={onLogout} />
      <div className="student-content">{children}</div>
    </div>
  );
}
