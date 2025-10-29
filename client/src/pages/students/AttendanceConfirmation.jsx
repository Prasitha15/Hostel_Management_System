const AttendanceConfirmation = ({ scanResult, onConfirm, onRescan }) => {
  const today = new Date().toLocaleDateString();

  const handleConfirm = () => {
    onConfirm(scanResult);
  };

  return (
    <div className="confirmation-page">
      <h2>✅ Attendance Confirmation</h2>
      <p>You are marking attendance for <strong>{today}</strong>.</p>
      <p>Scanned code: {scanResult}</p>
      <button onClick={handleConfirm}>
        Mark Attendance
      </button>
      {/* Add a button to go back and scan again */}
      <button onClick={onRescan} style={{ marginLeft: '10px' }}>
        Rescan QR Code
      </button>
    </div>
  );
};
export default AttendanceConfirmation;