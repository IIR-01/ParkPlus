import { useEffect, useMemo, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { parkMarkers } from "../data/parkData";
import GiftRecommendations from "./GiftRecommendations";
import api from "../utils/api";
import "./InteractiveParkMap.css";

const markerIcons = {
  ride: "🎢",
  water: "💦",
  food: "🍔",
  restroom: "🚻",
  shop: "🎁",
};

function QrIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M15 15h2v2h-2z" />
      <path d="M19 15h2v6h-2" />
      <path d="M15 19h2v2h-2" />
    </svg>
  );
}

function InteractiveParkMap() {
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Logged-in visitor's MongoDB-backed check-in history
  const [checkInHistory, setCheckInHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  // QR scanner state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [qrMessage, setQrMessage] = useState("");

  // =========================================================
  // LOAD THIS VISITOR'S SAVED CHECK-IN HISTORY
  // =========================================================
  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const { data } = await api.get("/checkins");
        setCheckInHistory(data);
      } catch (error) {
        setHistoryError(
          error.response?.data?.message ||
            "Couldn't load your check-in history."
        );
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchCheckIns();
  }, []);

  // Backend returns latest check-in first
  const lastCheckIn =
    checkInHistory.length > 0 ? checkInHistory[0] : null;

  // GiftRecommendations expects zone names
  const visitedZones = useMemo(() => {
    return [...new Set(checkInHistory.map((item) => item.zone))];
  }, [checkInHistory]);

  // =========================================================
  // SELECT LOCATION
  // =========================================================
  const handleSelectMarker = (marker) => {
    setSelectedMarker(marker);
    setQrMessage("");
  };

  // =========================================================
  // OPEN QR SCANNER
  // =========================================================
  const openScanner = () => {
    if (!selectedMarker) {
      setQrMessage(
        "📍 Please select a location from the park map first."
      );
      return;
    }

    setQrMessage("");
    setScannerOpen(true);
  };

  // =========================================================
  // QR SCANNER
  //
  // DEMO LOGIC:
  // Any readable QR is accepted.
  // The selected map marker decides where the visitor checks in.
  // =========================================================
  useEffect(() => {
    if (!scannerOpen || !selectedMarker) return;

    let scanner = null;
    let processing = false;

    // Capture the selected location when scanner opens
    const markerForCheckIn = selectedMarker;

    const timer = setTimeout(() => {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: {
            width: 240,
            height: 240,
          },
          rememberLastUsedCamera: true,
        },
        false
      );

      scanner.render(
        async (decodedText) => {
          if (processing) return;

          // QR only needs to be readable.
          // Its actual content does NOT determine the location.
          if (!decodedText || !decodedText.trim()) {
            setQrMessage("❌ QR code could not be read. Try again.");
            return;
          }

          processing = true;

          // Stop scanner after a successful QR read
          try {
            if (scanner) {
              await scanner.clear();
            }
          } catch (error) {
            // Scanner may already be stopping
          }

          setScannerOpen(false);

          try {
            // Save selected location to this logged-in visitor's history
            const { data } = await api.post("/checkins", {
              markerId: markerForCheckIn.id,
              locationName: markerForCheckIn.name,
              zone: markerForCheckIn.zone,
            });

            // Newest check-in appears first
            setCheckInHistory((current) => [
              data.item,
              ...current,
            ]);

            setSelectedMarker(markerForCheckIn);
            setHistoryError("");

            setQrMessage(
              `✅ Checked in successfully: ${markerForCheckIn.name} — ${markerForCheckIn.zone}`
            );
          } catch (error) {
            setQrMessage(
              `❌ ${
                error.response?.data?.message ||
                "Couldn't save your check-in."
              }`
            );
          }
        },

        () => {
          // Ignore normal camera frame scan errors
        }
      );
    }, 100);

    return () => {
      clearTimeout(timer);

      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [scannerOpen, selectedMarker]);

  // =========================================================
  // DELETE ONE CHECK-IN
  // =========================================================
  const handleDeleteCheckIn = async (checkInId) => {
    try {
      await api.delete(`/checkins/${checkInId}`);

      setCheckInHistory((current) =>
        current.filter((item) => item._id !== checkInId)
      );

      setHistoryError("");
    } catch (error) {
      setHistoryError(
        error.response?.data?.message ||
          "Couldn't remove this check-in."
      );
    }
  };

  // =========================================================
  // CLEAR ENTIRE HISTORY FOR THIS VISITOR
  // =========================================================
  const handleClearHistory = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your entire check-in history?"
    );

    if (!confirmed) return;

    try {
      await api.delete("/checkins/all");

      setCheckInHistory([]);
      setHistoryError("");
      setQrMessage("");
    } catch (error) {
      setHistoryError(
        error.response?.data?.message ||
          "Couldn't clear your check-in history."
      );
    }
  };

  return (
    <div className="interactive-map-page">
      <h1>Interactive Park Map</h1>

      <p>
        Select a park location, then scan any QR code to confirm your
        check-in.
      </p>

      {/* =====================================================
          QR CHECK-IN TOP SECTION
      ====================================================== */}
      <div className="qr-checkin-area">
        <button
          className="qr-scan-button"
          type="button"
          onClick={openScanner}
        >
          <QrIcon />
          Scan QR to Check In
        </button>

        {selectedMarker && (
          <div className="current-checkin-card">
            <span>📌 Selected Location</span>

            <strong>{selectedMarker.name}</strong>

            <span>{selectedMarker.zone}</span>
          </div>
        )}

        {lastCheckIn && (
          <div className="current-checkin-card">
            <span>📍 Last Checked-In</span>

            <strong>{lastCheckIn.locationName}</strong>

            <span>{lastCheckIn.zone}</span>

            <small>
              {new Date(lastCheckIn.createdAt).toLocaleString()}
            </small>
          </div>
        )}
      </div>

      {/* QR SUCCESS / ERROR MESSAGE */}
      {qrMessage && (
        <div className="qr-message">
          {qrMessage}
        </div>
      )}

      {/* =====================================================
          QR SCANNER
      ====================================================== */}
      {scannerOpen && selectedMarker && (
        <div className="qr-scanner-panel">
          <div className="qr-scanner-header">
            <div>
              <h2>Scan QR to Check In</h2>

              <p>
                Checking in at{" "}
                <strong>{selectedMarker.name}</strong>
              </p>

              <p>
                {selectedMarker.zone}
              </p>
            </div>

            <button
              type="button"
              className="scanner-close-button"
              onClick={() => setScannerOpen(false)}
            >
              ✕
            </button>
          </div>

          <div id="qr-reader" />

          <p className="qr-format-note">
            Demo mode: any readable QR code confirms check-in at the
            selected location.
          </p>
        </div>
      )}

      {/* =====================================================
          PARK MAP
      ====================================================== */}
      <div className="map-layout">
        <div className="park-map">
          {/* Decorative background */}
          <span className="bg-item bg-car">🚗</span>
          <span className="bg-item bg-human">🚶</span>
          <span className="bg-item bg-children">🧒👧</span>
          <span className="bg-item bg-coaster">🎢</span>
          <span className="bg-item bg-burger">🍔</span>

          {/* LAST CHECK-IN BANNER */}
          {lastCheckIn && (
            <div className="last-checkin-banner">
              Last Checked-In Zone:{" "}
              <strong>{lastCheckIn.zone}</strong>
            </div>
          )}

          {/* PARK MARKERS */}
          {parkMarkers.map((marker) => {
            const isCurrentLocation =
              lastCheckIn?.markerId === marker.id;

            const isSelected =
              selectedMarker?.id === marker.id;

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
                    isCurrentLocation
                      ? "checked-in-marker"
                      : ""
                  } ${
                    isSelected
                      ? "selected-marker"
                      : ""
                  }`}
                  title={marker.name}
                  onClick={() => handleSelectMarker(marker)}
                >
                  <span>{markerIcons[marker.type]}</span>
                </button>

                <span className="marker-label">
                  {marker.name}
                </span>

                {isCurrentLocation && (
                  <span className="you-are-here">
                    You are here
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* =================================================
            LOCATION DETAILS
        ================================================== */}
        <div className="marker-details">
          <h2>Location Details</h2>

          {selectedMarker ? (
            <>
              <h3>{selectedMarker.name}</h3>

              <p>
                <strong>Type:</strong>{" "}
                {selectedMarker.type}
              </p>

              <p>
                <strong>Zone:</strong>{" "}
                {selectedMarker.zone}
              </p>

              <p>
                <strong>Restriction:</strong>{" "}
                {selectedMarker.restriction}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedMarker.status}
              </p>

              <button
                type="button"
                className="checkin-button"
                onClick={openScanner}
              >
                <QrIcon />
                Scan QR to Check In
              </button>
            </>
          ) : (
            <>
              <p>
                Select a location marker from the park map.
              </p>

              <p>
                After selecting a location, scan any QR code to
                check in there.
              </p>
            </>
          )}
        </div>
      </div>

      {/* =====================================================
          VISITOR'S SAVED CHECK-IN HISTORY
      ====================================================== */}
      <div className="check-in-section">
        <div className="checkin-history-header">
          <div>
            <h2>My Check-In History</h2>

            <p>
              Your history is saved to your visitor account.
            </p>
          </div>

          {checkInHistory.length > 0 && (
            <button
              type="button"
              className="clear-history-button"
              onClick={handleClearHistory}
            >
              Clear History
            </button>
          )}
        </div>

        {historyError && (
          <p className="history-error">
            {historyError}
          </p>
        )}

        {historyLoading ? (
          <p>Loading your check-in history...</p>
        ) : checkInHistory.length === 0 ? (
          <div className="empty-checkin-history">
            <span>📍</span>

            <p>No check-ins yet.</p>

            <small>
              Select a location and scan any QR code to create your
              first check-in.
            </small>
          </div>
        ) : (
          <div className="checkin-history-list">
            {checkInHistory.map((item, index) => (
              <div
                className="checkin-history-item"
                key={item._id}
              >
                <div className="checkin-number">
                  {index + 1}
                </div>

                <div className="checkin-history-info">
                  <strong>
                    {item.locationName}
                  </strong>

                  <span>
                    📍 {item.zone}
                  </span>

                  <small>
                    {new Date(
                      item.createdAt
                    ).toLocaleString()}
                  </small>
                </div>

                <button
                  type="button"
                  className="remove-checkin-button"
                  onClick={() =>
                    handleDeleteCheckIn(item._id)
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          GIFT RECOMMENDATIONS
      ====================================================== */}
      <GiftRecommendations
        checkInHistory={visitedZones}
      />
    </div>
  );
}

export default InteractiveParkMap;