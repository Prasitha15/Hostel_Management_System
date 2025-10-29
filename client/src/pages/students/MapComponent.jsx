/*import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

// NEC Ladies Hostel Location (default center)
const NEC_HOSTEL_LOCATION = { lat: 9.0026, lng: 77.4010 };

export default function MapComponent() {
  const [location, setLocation] = useState(null);

  // ✅ Load Google Maps API + Places
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // 👈 single key
    libraries: ["places"], // 👈 includes Places API
  });

  // ✅ Get user's GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (err) => console.error("Location error:", err)
      );
    }
  }, []);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={location || NEC_HOSTEL_LOCATION}
      zoom={15}
    >
      
      {location && <Marker position={location} />}
    
      <Marker position={NEC_HOSTEL_LOCATION} />
    </GoogleMap>
  );
}
*/
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// Default marker icon
const defaultIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// User location marker icon
const userIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [30, 46],
  iconAnchor: [15, 46],
  popupAnchor: [1, -34],
});

// NEC Hostel (reference)
const NEC_HOSTEL_LOCATION = { lat: 9.1484, lng: 77.8322, name: "NEC Ladies Hostel" };

// Recenter map when user location changes
function RecenterMap({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 16);
    }
  }, [location, map]);
  return null;
}

export default function UserLocationMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Fetch system location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
        setLocationError(null);
      },
      (err) => {
        console.error("Location error:", err);
        let msg = "Unable to get your location.";
        if (err.code === err.PERMISSION_DENIED) msg = "Location access denied.";
        else if (err.code === err.POSITION_UNAVAILABLE) msg = "Location unavailable.";
        else if (err.code === err.TIMEOUT) msg = "Location request timed out.";
        setLocationError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  // Render nothing until user location is fetched
  if (!userLocation) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        {locationError ? (
          <>
            <p style={{ color: "red" }}>{locationError}</p>
            <button onClick={getUserLocation}>Retry</button>
          </>
        ) : (
          <p>Fetching your current location...</p>
        )}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "700px", margin: "20px auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>📍 NEC Hostel Reference Map</h2>

      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={16}
        style={{ height: "400px", width: "100%", borderRadius: "10px", border: "2px solid #ddd" }}
      >
        <RecenterMap location={userLocation} />

        {/* Map Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* NEC Hostel Marker */}
        <Marker position={[NEC_HOSTEL_LOCATION.lat, NEC_HOSTEL_LOCATION.lng]} icon={defaultIcon}>
          <Popup>
            <strong>🏠 {NEC_HOSTEL_LOCATION.name}</strong><br />
            Lat: {NEC_HOSTEL_LOCATION.lat}, Lng: {NEC_HOSTEL_LOCATION.lng}
          </Popup>
        </Marker>

        {/* User Location Marker */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <strong>📍 Your Current Location</strong><br />
            Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}<br />
            Accuracy: ±{userLocation.accuracy.toFixed(1)} meters
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
