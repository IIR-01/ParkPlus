import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import RideCard from "../components/RideCard";
import "../styles/liveWaitTimes.css";

const API_URL = "http://localhost:5000/api/rides";
const REFRESH_INTERVAL = 10000;

function LiveWaitTimes() {
  const [rides, setRides] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRides = useCallback(async () => {
    try {
      setError("");

      const response = await axios.get(API_URL);
      setRides(response.data);
      setLastUpdated(new Date());
    } catch (requestError) {
      console.error("Could not load ride wait times:", requestError);
      setError(
        "Live wait times are temporarily unavailable. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRides();

    const intervalId = setInterval(loadRides, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [loadRides]);

  return (
    <main className="visitor-page">
      <header className="visitor-header">
        <div>
          <p className="visitor-header__eyebrow">ParkPlus Visitor Services</p>
          <h1>Live Ride Wait Times</h1>
          <p>
            Plan your next ride using current wait-time estimates from park
            staff.
          </p>
        </div>

        <button
          className="refresh-button"
          type="button"
          onClick={loadRides}
          disabled={isLoading}
        >
          Refresh now
        </button>
      </header>

      <section className="status-panel">
        <div>
          <span>Auto refresh</span>
          <strong>Every 10 seconds</strong>
        </div>

        <div>
          <span>Last updated</span>
          <strong>
            {lastUpdated
              ? lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "Waiting for data"}
          </strong>
        </div>
      </section>

      {isLoading && rides.length === 0 && (
        <section className="message-card">
          <h2>Loading live wait times...</h2>
          <p>Please wait while the latest ride information is retrieved.</p>
        </section>
      )}

      {error && (
        <section className="message-card message-card--error">
          <h2>Unable to load wait times</h2>
          <p>{error}</p>
          <button type="button" onClick={loadRides}>
            Try again
          </button>
        </section>
      )}

      {!isLoading && !error && rides.length === 0 && (
        <section className="message-card">
          <h2>No ride information available</h2>
          <p>Wait-time information has not been published yet.</p>
        </section>
      )}

      {rides.length > 0 && (
        <section className="ride-grid" aria-label="Current ride wait times">
          {rides.map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))}
        </section>
      )}

      <section className="wait-guide">
        <h2>Wait-time guide</h2>

        <div className="wait-guide__items">
          <span className="wait-guide__item wait-low">
            0–15 min: Short
          </span>
          <span className="wait-guide__item wait-medium">
            16–30 min: Moderate
          </span>
          <span className="wait-guide__item wait-high">
            31+ min: Long
          </span>
        </div>
      </section>
    </main>
  );
}

export default LiveWaitTimes;