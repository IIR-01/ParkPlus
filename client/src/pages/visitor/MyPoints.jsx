import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const ACTIVITY_LABELS = {
  zone_checkin: { icon: '📍', label: 'Zone check-in' },
  ride_completed: { icon: '🎢', label: 'Ride completed' },
};

const MyPoints = () => {
  const navigate = useNavigate();
  const [totalPoints, setTotalPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyPoints();
  }, []);

  const fetchMyPoints = async () => {
    try {
      const { data } = await api.get('/points/me');
      setTotalPoints(data.totalPoints);
      setHistory(data.history);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your points.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <p>Loading your points...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerLogo}>🎡 ParkPlus</h1>
        <button onClick={() => navigate('/visitor')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </header>

      <main style={styles.main}>
        <h2 style={styles.pageTitle}>My Points</h2>

        {error && <div style={styles.errorMsg}>{error}</div>}

        {/* Total points card */}
        <div style={styles.totalCard}>
          <div style={styles.totalIcon}>⭐</div>
          <div>
            <p style={styles.totalLabel}>Total Points</p>
            <p style={styles.totalValue}>{totalPoints}</p>
          </div>
        </div>

        {/* Activity history */}
        <h3 style={styles.sectionTitle}>Activity History</h3>

        {history.length === 0 && (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>🏆</div>
            <h3 style={styles.emptyTitle}>No activity yet</h3>
            <p style={styles.emptyText}>
              Check in to zones and complete rides to start earning points!
            </p>
          </div>
        )}

        {history.length > 0 && (
          <div style={styles.historyList}>
            {history.map((item) => {
              const meta = ACTIVITY_LABELS[item.type] || { icon: '✨', label: item.type };
              return (
                <div key={item._id} style={styles.historyRow}>
                  <div style={styles.historyLeft}>
                    <span style={styles.historyIcon}>{meta.icon}</span>
                    <div>
                      <p style={styles.historyLabel}>{meta.label}</p>
                      <p style={styles.historyRef}>{item.refName}</p>
                      <p style={styles.historyDate}>
                        {new Date(item.createdAt).toLocaleString('en-BD', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                  <span style={styles.historyPoints}>+{item.points}</span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f0f4ff' },
  loadingPage: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  header: {
    background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  headerLogo: { margin: 0, fontSize: '1.4rem' },
  backBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  main: { maxWidth: '640px', margin: '2rem auto', padding: '0 1rem' },
  pageTitle: { color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.5rem' },
  errorMsg: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '0.85rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.25rem',
  },
  totalCard: {
    background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
    color: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
  },
  totalIcon: { fontSize: '3rem' },
  totalLabel: { margin: 0, opacity: 0.85, fontSize: '0.9rem' },
  totalValue: { margin: 0, fontSize: '2.5rem', fontWeight: 800 },
  sectionTitle: { color: '#1e293b', marginBottom: '1rem', fontSize: '1.1rem' },
  emptyCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '3rem 2rem',
    textAlign: 'center',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
  },
  emptyIcon: { fontSize: '4rem', marginBottom: '1rem' },
  emptyTitle: { color: '#1e293b', marginBottom: '0.5rem' },
  emptyText: { color: '#64748b' },
  historyList: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    overflow: 'hidden',
  },
  historyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.1rem 1.5rem',
    borderBottom: '1px solid #e2e8f0',
  },
  historyLeft: { display: 'flex', alignItems: 'flex-start', gap: '0.85rem' },
  historyIcon: { fontSize: '1.5rem' },
  historyLabel: { margin: '0 0 0.1rem', fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' },
  historyRef: { margin: '0 0 0.1rem', color: '#475569', fontSize: '0.875rem' },
  historyDate: { margin: 0, color: '#94a3b8', fontSize: '0.75rem' },
  historyPoints: { color: '#16a34a', fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap' },
};

export default MyPoints;