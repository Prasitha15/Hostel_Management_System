import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const StudentQRScan = () => {
  const [scanResult, setScanResult] = useState("");
  const [message, setMessage] = useState("");
  const [scannerStarted, setScannerStarted] = useState(false);
  const scannerRef = useRef(null);

  const startScanner = async () => {
    setMessage("⌛ Starting scanner...");
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    try {
      const student = JSON.parse(localStorage.getItem("student"));
      if (!student?.id) {
        setMessage("❌ Student ID not found in localStorage.");
        return;
      }

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          setScanResult(decodedText);

          try {
            const res = await fetch("http://localhost:5000/api/mark-attendance", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                studentId: student.id,
                qrValue: decodedText, // match backend key
              }),
            });

            const result = await res.json();
            if (res.ok) setMessage("✅ Attendance marked successfully!");
            else setMessage(`❌ ${result.message}`);
          } catch (err) {
            console.error(err);
            setMessage("❌ Error marking attendance. Try again.");
          }
        },
        (errorMessage) => {
          console.warn("QR scan error:", errorMessage);
        }
      );

      setScannerStarted(true);
      setMessage("✅ Scanner started. Point your camera at the QR code.");
    } catch (err) {
      console.error("Unable to start QR scanner:", err);
      if (err.name === "NotAllowedError") {
        setMessage(
          "❌ Camera access denied. Please allow camera in browser settings and retry."
        );
      } else {
        setMessage("❌ QR scanner failed to start.");
      }
      setScannerStarted(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Scan QR Code to Mark Attendance</h2>
      <div id="reader" style={{ width: "300px", margin: "auto" }}></div>

      {!scannerStarted && (
        <button
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#1e90ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={startScanner}
        >
          Start Scanner
        </button>
      )}

      {scanResult && (
        <p>
          <strong>Scanned Data:</strong> {scanResult}
        </p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default StudentQRScan;
