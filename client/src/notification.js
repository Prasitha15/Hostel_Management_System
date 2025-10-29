const API_URL = "http://localhost:5000/api";

export async function fetchNotifications() {
  try {
    const res = await fetch(`${API_URL}/notifications`);
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return await res.json();
  } catch (err) {
    console.error("❌ Fetch notifications error:", err);
    return [];
  }
}

export async function addNotification(data) {
  try {
    const res = await fetch(`${API_URL}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error("❌ Add notification error:", err);
    return { error: "⚠️ Server error. Please try again." };
  }
}
