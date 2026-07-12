import { useEffect, useState } from "react";
import axios from "axios";

function App() {
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
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>ParkPlus Staff Dashboard</h1>

      <h2>Update Ride Wait Time</h2>

      <select
        value={rideId}
        onChange={(e) => setRideId(e.target.value)}
      >
        <option value="">Select Ride</option>

        {rides.map((ride) => (
          <option key={ride.id} value={ride.id}>
            {ride.name}
          </option>
        ))}
      </select>

      <br /><br />

      <input
        type="number"
        placeholder="Wait Time (minutes)"
        value={waitTime}
        onChange={(e) => setWaitTime(e.target.value)}
      />

      <br /><br />

      <button onClick={updateRide}>
        Update Wait Time
      </button>

      <hr />

      <h2>Current Ride Status</h2>

      <table border="1" cellPadding="10">
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
  );
}

export default App;
