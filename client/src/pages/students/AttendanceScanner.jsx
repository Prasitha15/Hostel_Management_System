import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import AttendanceConfirmation from './AttendanceConfirmation'; // Import your confirmation component

const AttendanceScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Define markAttendance BEFORE it is used
  const markAttendance = async (scanData) => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        alert("Please log in first");
        return;
      }

      const response = await fetch("http://localhost:5000/api/mark-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, qrData: scanData }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Attendance marked successfully!");
        window.location.href = "/student/attendance";
      } else {
        alert("❌ " + data.message);
        // Optionally, you can go back to the scanner on error
        // setShowConfirmation(false);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("❌ Could not mark attendance. Try again.");
    }
  };

  const handleScan = (result) => {
    if (result && result.length > 0) {
      setScanResult(result[0].rawValue);
      setShowConfirmation(true);
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner error:', err);
  };

  // Function to reset and go back to the scanner
  const handleRescan = () => {
    setShowConfirmation(false);
    setScanResult(null);
  };

  if (showConfirmation) {
    return (
      <AttendanceConfirmation
        scanResult={scanResult}
        onConfirm={markAttendance}
        onRescan={handleRescan} // Pass the rescan function
      />
    );
  }

  return (
    <div>
      <h2>Scan your Attendance QR Code</h2>
      <Scanner
        onScan={handleScan}
        onError={handleError}
      />
    </div>
  );
};

export default AttendanceScanner;