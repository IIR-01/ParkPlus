import { useEffect, useState } from 'react';
import api from '../../utils/api';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setError('');

      const { data } = await api.get('/queue/reservations/me');

      setReservations(data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to load your reservations'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>ParkPlus Visitor Services</p>
          <h1 style={styles.title}>My Virtual Queue Reservations</h1>
          <p style={styles.subtitle}>
            View your reserved rides and return-time windows.
          </p>
        </div>

        <button onClick={loadReservations} style={styles.refreshBtn}>
          Refresh
        </button>
      </div>

      {loading && (
        <div style={styles.messageCard}>
          Loading reservations...
        </div>
      )}

      {error && (
        <div style={styles.errorCard}>
          {error}
        </div>
      )}

      {!loading && !error && reservations.length === 0 && (
        <div style={styles.messageCard}>
          You do not have any virtual queue reservations yet.
        </div>
      )}

      <div style={styles.grid}>
        {reservations.map((reservation) => (
          <div key={reservation._id} style={styles.card}>
            <h2 style={styles.rideName}>
              🎢 {reservation.ride?.name || 'Ride'}
            </h2>

            <div style={styles.status}>
              {reservation.status}
            </div>

            <div style={styles.timeSection}>
              <span style={styles.label}>Return Window</span>

              <strong>
                {formatTime(reservation.returnTimeStart)}
                {' — '}
                {formatTime(reservation.returnTimeEnd)}
              </strong>
            </div>
          </div>
        ))}
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
    maxWidth: '900px',
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

  grid: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'grid',
    gap: '1rem',
  },

  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
  },

  rideName: {
    margin: '0 0 0.75rem',
    color: '#172033',
  },

  status: {
    display: 'inline-block',
    background: '#dbeafe',
    color: '#1d4ed8',
    padding: '0.35rem 0.7rem',
    borderRadius: '999px',
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'capitalize',
  },

  timeSection: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e2e8f0',
  },

  label: {
    display: 'block',
    color: '#64748b',
    fontSize: '0.85rem',
    marginBottom: '0.35rem',
  },

  messageCard: {
    maxWidth: '900px',
    margin: '0 auto',
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '14px',
    textAlign: 'center',
  },

  errorCard: {
    maxWidth: '900px',
    margin: '0 auto',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    padding: '1.5rem',
    borderRadius: '14px',
  },
};

export default MyReservations;