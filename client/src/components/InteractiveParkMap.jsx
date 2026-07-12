import { useState } from "react";
import { parkMarkers } from "../data/parkData";
import GiftRecommendations from "./GiftRecommendations";
import "./InteractiveParkMap.css";

function InteractiveParkMap() {
  // Which marker is currently selected/open on the map
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Every zone the visitor has "checked in" to so far today.
  // GiftRecommendations uses this to decide which gifts to suggest.
  const [checkInHistory, setCheckInHistory] = useState([]);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCheckIn = (zone) => {
    // Avoid duplicate entries if the visitor checks into the same zone twice
    if (!checkInHistory.includes(zone)) {
      setCheckInHistory([...checkInHistory, zone]);
    }
  };

  const lastZone = checkInHistory[checkInHistory.length - 1];

  return (
    <div className="page-container">
      <h1>Interactive Park Map</h1>
      <p className="intro-text">
        Tap a marker to see what's there, then check in to unlock gift
        recommendations for that zone.
      </p>

      <div className="qr-section">
        <p>Quick check-in:</p>
        {parkMarkers.map((marker) => (
          <button
            key={marker.id}
            onClick={() => handleCheckIn(marker.zone)}
          >
            {marker.zone}
          </button>
        ))}
      </div>

      {lastZone && (
        <div className="last-zone">
          Last checked in: <strong>{lastZone}</strong>
        </div>
      )}

      <div className="map-box">
        {parkMarkers.map((marker) => (
          <button
            key={marker.id}
            className={`map-marker ${marker.type}`}
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            onClick={() => handleMarkerClick(marker)}
          >
            {marker.name}
          </button>
        ))}

        {lastZone && <div className="visitor-zone">You are near: {lastZone}</div>}
      </div>

      {selectedMarker && (
        <div className="marker-card">
          <h3>{selectedMarker.name}</h3>
          <p><strong>Zone:</strong> {selectedMarker.zone}</p>
          <p><strong>Status:</strong> {selectedMarker.status}</p>
          <p><strong>Restriction:</strong> {selectedMarker.restriction}</p>
          <button onClick={() => handleCheckIn(selectedMarker.zone)}>
            Check in here
          </button>
        </div>
      )}

      <GiftRecommendations checkInHistory={checkInHistory} />
    </div>
  );
}

export default InteractiveParkMap;
