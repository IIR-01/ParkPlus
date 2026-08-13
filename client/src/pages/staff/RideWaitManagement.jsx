import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const RideWaitManagement = () => {
  const [rides, setRides] = useState([]);
  const [rideId, setRideId] = useState('');
  const [waitTime, setWaitTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadRides = async () => {
    try {
      setError('');
      const { data } = await api.get('/rides');
      setRides(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRides();
  }, []);

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!rideId || waitTime === '') return;

    setUpdating(true);
    setMessage('');
    setError('');

    try {
      const { data } = await api.put('/rides/wait-time', {
        rideId,
        waitTime: Number(waitTime),
      });

      setMessage(data.message || 'Ride wait time updated successfully');
      setWaitTime('');
      await loadRides();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update ride wait time'
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>ParkPlus Staff Services</p>
          <h1 style={styles.title}>Ride Wait Time Management</h1>
        </div>

        <Link to="/staff" style={styles.backLink}>
          ← Staff Dashboard
        </Link>
      </header>

      <main style={styles.main}>
        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Update Ride Wait Time</h2>

          <form onSubmit={handleUpdate} style={styles.form}>
            <label style={styles.label}>
              Ride
              <select
                value={rideId}
                onChange={(event) => setRideId(event.target.value)}
                style={styles.input}
                required
              >
                <option value="">Select Ride</option>

                {rides.map((ride) => (
                  <option key={ride._id} value={ride._id}>
                    {ride.name}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.label}>
              Wait time in minutes
              <input
                type="number"
                min="0"
                value={waitTime}
                onChange={(event) => setWaitTime(event.target.value)}
                placeholder="Enter wait time"
                style={styles.input}
                required
              />
            </label>

            <button
              type="submit"
              disabled={updating}
              style={styles.updateButton}
            >
              {updating ? 'Updating...' : 'Update Wait Time'}
            </button>
          </form>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Current Ride Status</h2>

          {loading ? (
            <p>Loading rides...</p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Ride</th>
                    <th style={styles.th}>Wait Time</th>
                  </tr>
                </thead>

                <tbody>
                  {rides.map((ride) => (
                    <tr key={ride._id}>
                      <td style={styles.td}>{ride.name}</td>
                      <td style={styles.td}>{ride.waitTime} mins</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0f4ff',
  },
  header: {
    background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
    color: '#fff',
    padding: '1.25rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  eyebrow: {
    margin: 0,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    opacity: 0.8,
    fontWeight: 700,
  },
  title: {
    margin: '0.25rem 0 0',
    fontSize: '1.5rem',
  },
  backLink: {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.5rem 0.9rem',
    border: '1px solid rgba(255,255,255,0.35)',
    borderRadius: '8px',
  },
  main: {
    maxWidth: '900px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
  },
  sectionTitle: {
    color: '#1e293b',
    marginTop: 0,
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    gap: '1rem',
    alignItems: 'end',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    color: '#334155',
    fontWeight: 600,
  },
  input: {
    padding: '0.8rem',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  updateButton: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.85rem 1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '0.8rem',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  td: {
    padding: '0.8rem',
    borderBottom: '1px solid #e2e8f0',
  },
  success: {
    background: '#f0fdf4',
    border: '1px solid #86efac',
    color: '#15803d',
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
};

export default RideWaitManagement;