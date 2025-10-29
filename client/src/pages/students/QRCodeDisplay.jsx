/*import React, { useEffect, useState } from "react";

export default function QRCodeDisplay() {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQR = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/get-qr");
      const data = await res.json();

      if (data.qrImage) {
        setQrImage(data.qrImage);
      } else {
        setQrImage(null);
      }
    } catch (err) {
      console.error("❌ Error fetching QR:", err);
      setQrImage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQR();
    const interval = setInterval(fetchQR, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>⏳ Loading QR...</p>;
  if (!qrImage) return <p>⚠ QR not active</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={qrImage}
        alt="Attendance QR"
        style={{
          width: "250px",
          height: "250px",
          border: "2px solid #007bff",
          borderRadius: "10px",
        }}
      />
      <p style={{ color: "green", marginTop: "10px" }}>
        📸 Scan this QR to mark attendance
      </p>
    </div>
  );
}

import React from "react";

export default function QRCodeDisplay({ qrDataUrl }) {
  if (!qrDataUrl) return <p>⚠ QR not active</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={qrDataUrl}
        alt="Attendance QR"
        style={{
          width: "250px",
          height: "250px",
          border: "2px solid #007bff",
          borderRadius: "10px",
        }}
      />
      <p style={{ color: "green", marginTop: "10px" }}>
        📸 Scan this QR to mark attendance
      </p>
    </div>
  );
}*/
import React from "react";

export default function QRCodeDisplay({ qrDataUrl }) {
  if (!qrDataUrl) return <p>⚠ QR not active</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={qrDataUrl}
        alt="Attendance QR"
        style={{
          width: "250px",
          height: "250px",
          border: "2px solid #007bff",
          borderRadius: "10px",
        }}
      />
      <p style={{ color: "green", marginTop: "10px" }}>
        📸 Scan this QR to mark attendance
      </p>
    </div>
  );
}