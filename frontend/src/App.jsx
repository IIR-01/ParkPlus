import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Route, Routes } from "react-router-dom";
import LiveWaitTimes from "./pages/LiveWaitTimes";
import "./App.css";

function StaffDashboard() {
  const [rides, setRides] = useState([]);
  const [rideId, setRideId] = useState("");
  const [waitTime, setWaitTime] = useState("");

  const loadRides = async () => {
    const res = await axios.get("http://localhost:5000/api/rides");
    setRides(res.data);
  };

  useEffect(() => {
    loadRides();
  }, []);

  const updateRide = async () => {
    if (!rideId || !waitTime) return;

    await axios.put("http://localhost:5000/api/rides/update", {
      id: Number(rideId),
      waitTime: Number(waitTime),
    });

    setWaitTime("");
    loadRides();
  };

  return (
    <main className="staff-dashboard">
      <section className="staff-dashboard__card">
        <p className="staff-dashboard__eyebrow">ParkPlus Staff Services</p>
        <h1>ParkPlus Staff Dashboard</h1>

        <h2>Update Ride Wait Time</h2>

        <div className="staff-form">
          <label>
            Ride
            <select
              value={rideId}
              onChange={(event) => setRideId(event.target.value)}
            >
              <option value="">Select Ride</option>

              {rides.map((ride) => (
                <option key={ride.id} value={ride.id}>
                  {ride.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Wait time in minutes
            <input
              type="number"
              min="0"
              placeholder="Enter wait time"
              value={waitTime}
              onChange={(event) => setWaitTime(event.target.value)}
            />
          </label>

          <button type="button" onClick={updateRide}>
            Update Wait Time
          </button>
        </div>

        <h2>Current Ride Status</h2>

        <div className="staff-table-wrapper">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Ride</th>
                <th>Wait Time</th>
              </tr>
            </thead>

            <tbody>
              {rides.map((ride) => (
                <tr key={ride.id}>
                  <td>{ride.name}</td>
                  <td>{ride.waitTime} mins</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <>
      <nav className="app-nav">
        <Link to="/">Staff Dashboard</Link>
        <Link to="/live-wait-times">Visitor Live Wait Times</Link>
      </nav>

      <Routes>
        <Route path="/" element={<StaffDashboard />} />
        <Route path="/live-wait-times" element={<LiveWaitTimes />} />
      </Routes>
    </>
  );
}

export default App;