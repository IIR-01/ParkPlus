import { useState } from "react";
import { parkMarkers } from "../data/parkData";
import GiftRecommendations from "./GiftRecommendations";
import "./InteractiveParkMap.css";

const markerIcons = {
  ride: "🎢",
  water: "💦",
  food: "🍔",
  restroom: "🚻",
  shop: "🎁",
};

function InteractiveParkMap() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [checkInHistory, setCheckInHistory] = useState([]);
  const [lastCheckedInZone, setLastCheckedInZone] = useState("");

  const handleCheckIn = (marker) => {
    setLastCheckedInZone(marker.zone);

    if (!checkInHistory.includes(marker.zone)) {
      setCheckInHistory((prev) => [...prev, marker.zone]);
    }
  };

  return (
    <div className="interactive-map-page">
      <h1>Interactive Park Map</h1>
      <p>Click a marker to view information and check in to that area.</p>

      <div className="map-layout">
        <div className="park-map">
          {/* Decorative faint background icons */}
          <span className="bg-item bg-car">🚗</span>
          <span className="bg-item bg-human">🚶</span>
          <span className="bg-item bg-children">🧒👧</span>
          <span className="bg-item bg-coaster">🎢</span>
          <span className="bg-item bg-burger">🍔</span>

          {lastCheckedInZone && (
            <div className="last-checkin-banner">
              Last Checked-In Zone: <strong>{lastCheckedInZone}</strong>
            </div>
          )}

          {parkMarkers.map((marker) => {
            const isCheckedIn = lastCheckedInZone === marker.zone;

            return (
              <div
                key={marker.id}
                className="marker-wrapper"
                style={{
                  left: `${marker.x}%`,
                  top: `${marker.y}%`,
                }}
              >
                <button
                  type="button"
                  className={`map-marker ${marker.type} ${
                    isCheckedIn ? "checked-in-marker" : ""
                  }`}
                  title={marker.name}
                  onClick={() => setSelectedMarker(marker)}
                >
                  <span>{markerIcons[marker.type]}</span>
                </button>

                <span className="marker-label">{marker.name}</span>

                {isCheckedIn && (
                  <span className="you-are-here">You are here</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="marker-details">
          <h2>Location Details</h2>

          {selectedMarker ? (
            <>
              <h3>{selectedMarker.name}</h3>

              <p>
                <strong>Type:</strong> {selectedMarker.type}
              </p>

              <p>
                <strong>Zone:</strong> {selectedMarker.zone}
              </p>

              <p>
                <strong>Restriction:</strong> {selectedMarker.restriction}
              </p>

              <p>
                <strong>Status:</strong> {selectedMarker.status}
              </p>

              <button
                className="checkin-button"
                type="button"
                onClick={() => handleCheckIn(selectedMarker)}
              >
                Check In to {selectedMarker.zone}
              </button>
            </>
          ) : (
            <p>Select a marker from the map.</p>
          )}
        </div>
      </div>

      <div className="check-in-section">
        <h2>Check-in History</h2>

        {checkInHistory.length === 0 ? (
          <p>No check-ins yet.</p>
        ) : (
          <ul>
            {checkInHistory.map((zone) => (
              <li key={zone}>{zone}</li>
            ))}
          </ul>
        )}
      </div>

      <GiftRecommendations checkInHistory={checkInHistory} />
    </div>
  );
}

export default InteractiveParkMap;
