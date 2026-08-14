import { useCallback, useEffect, useState } from 'react';
import api from '../../utils/api';

const REFRESH_INTERVAL = 10000;

const getWaitStatus = (waitTime) => {
  if (waitTime <= 15) {
    return { label: 'Short wait', color: '#166534', bg: '#dcfce7' };
  }

  if (waitTime <= 30) {
    return { label: 'Moderate wait', color: '#92400e', bg: '#fef3c7' };
  }

  return { label: 'Long wait', color: '#991b1b', bg: '#fee2e2' };
};

const LiveWaitTimes = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const [reservingRideId, setReservingRideId] = useState(null);
  const [reservationMessage, setReservationMessage] = useState('');
  const [reservationError, setReservationError] = useState('');

  const loadRides = useCallback(async () => {
    try {
      setError('');

      const { data } = await api.get('/rides');

      setRides(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to load ride wait times'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRides();

    const interval = setInterval(loadRides, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [loadRides]);

  const reserveRide = async (rideId) => {
    try {
      setReservingRideId(rideId);
      setReservationMessage('');
      setReservationError('');

      const { data } = await api.post('/queue/reservations', {
        rideId,
      });

      const reservation = data.reservation;

      const startTime = new Date(
        reservation.returnTimeStart
      ).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const endTime = new Date(
        reservation.returnTimeEnd
      ).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      setReservationMessage(
        `${reservation.ride.name} reserved successfully. Return between ${startTime} and ${endTime}.`
      );
    } catch (err) {
      setReservationError(
        err.response?.data?.message || 'Unable to reserve this ride'
      );
    } finally {
      setReservingRideId(null);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>ParkPlus Visitor Services</p>

          <h1 style={styles.title}>Live Ride Wait Times</h1>

          <p style={styles.subtitle}>
            Check the latest estimated wait times and reserve a virtual queue
            return time.
          </p>
        </div>

        <button onClick={loadRides} style={styles.refreshBtn}>
          Refresh Now
        </button>
      </div>

      <div style={styles.infoBar}>
        <div>
          <span style={styles.infoLabel}>Auto refresh</span>
          <strong>Every 10 seconds</strong>
        </div>

        <div>
          <span style={styles.infoLabel}>Last updated</span>

          <strong>
            {lastUpdated
              ? lastUpdated.toLocaleTimeString()
              : 'Waiting for data'}
          </strong>
        </div>
      </div>

      {reservationMessage && (
        <div style={styles.successCard}>
          {reservationMessage}
        </div>
      )}

      {reservationError && (
        <div style={styles.errorCard}>
          <h3>Reservation failed</h3>
          <p>{reservationError}</p>
        </div>
      )}

      {loading && rides.length === 0 && (
        <div style={styles.messageCard}>
          Loading ride wait times...
        </div>
      )}

      {error && (
        <div style={styles.errorCard}>
          <h3>Unable to load wait times</h3>
          <p>{error}</p>
        </div>
      )}

      <div style={styles.grid}>
        {rides.map((ride) => {
          const status = getWaitStatus(ride.waitTime);

          return (
            <div key={ride._id} style={styles.card}>
              <div style={styles.icon}>🎢</div>

              <h2 style={styles.rideName}>{ride.name}</h2>

              <span
                style={{
                  ...styles.badge,
                  color: status.color,
                  background: status.bg,
                }}
              >
                {status.label}
              </span>

              <div style={styles.waitTime}>
                <strong>{ride.waitTime}</strong>
                <span>minutes</span>
              </div>

              <button
                onClick={() => reserveRide(ride._id)}
                disabled={reservingRideId === ride._id}
                style={{
                  ...styles.reserveBtn,
                  opacity: reservingRideId === ride._id ? 0.6 : 1,
                }}
              >
                {reservingRideId === ride._id
                  ? 'Reserving...'
                  : 'Reserve Virtual Queue'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4f7fb',
    padding: '2rem',
  },

  header: {
    maxWidth: '1100px',
    margin: '0 auto 1.5rem',
    padding: '2rem',
    background: '#fff',
    borderRadius: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },

  eyebrow: {
    color: '#2563eb',
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: '0.8rem',
  },

  title: {
    margin: '0.25rem 0',
    color: '#172033',
  },

  subtitle: {
    color: '#64748b',
  },

  refreshBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    fontWeight: 700,
  },

  infoBar: {
    maxWidth: '1100px',
    margin: '0 auto 1.5rem',
    background: '#172033',
    color: '#fff',
    padding: '1rem 1.5rem',
    borderRadius: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },

  infoLabel: {
    display: 'block',
    color: '#cbd5e1',
    fontSize: '0.85rem',
    marginBottom: '0.25rem',
  },

  grid: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.25rem',
  },

  card: {
    background: '#fff',
    borderRadius: '18px',
    padding: '1.5rem',
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
  },

  icon: {
    fontSize: '2rem',
  },

  rideName: {
    color: '#172033',
    margin: '0.75rem 0',
  },

  badge: {
    display: 'inline-block',
    padding: '0.4rem 0.7rem',
    borderRadius: '999px',
    fontSize: '0.85rem',
    fontWeight: 700,
  },

  waitTime: {
    marginTop: '1.25rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
  },

  reserveBtn: {
    width: '100%',
    marginTop: '1.25rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '0.8rem 1rem',
    cursor: 'pointer',
    fontWeight: 700,
  },

  successCard: {
    maxWidth: '1100px',
    margin: '0 auto 1.5rem',
    background: '#dcfce7',
    border: '1px solid #86efac',
    color: '#166534',
    padding: '1rem 1.5rem',
    borderRadius: '14px',
    fontWeight: 600,
  },

  messageCard: {
    maxWidth: '1100px',
    margin: '0 auto',
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '14px',
    textAlign: 'center',
  },

  errorCard: {
    maxWidth: '1100px',
    margin: '0 auto 1.5rem',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    padding: '1.5rem',
    borderRadius: '14px',
  },
};

export default LiveWaitTimes;