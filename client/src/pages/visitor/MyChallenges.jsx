import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const TYPE_ICONS = {
  zone_checkin: '📍',
  ride_completed: '🎢',
  points: '⭐',
};

const MyChallenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyChallenges();
  }, []);

  const fetchMyChallenges = async () => {
    try {
      const { data } = await api.get('/challenges/me');
      setChallenges(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load challenges.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <p>Loading your challenges...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerLogo}>🎡 ParkPlus</h1>
        <button onClick={() => navigate('/visitor')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </header>

      <main style={styles.main}>
        <h2 style={styles.pageTitle}>🏆 My Challenges</h2>
        <p style={styles.subtitle}>
          Progress updates automatically as you check in to zones and complete rides.
        </p>

        {error && <div style={styles.errorMsg}>{error}</div>}

        {challenges.length === 0 && (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>🏆</div>
            <h3 style={styles.emptyTitle}>No challenges available right now</h3>
            <p style={styles.emptyText}>Check back later for new challenges!</p>
          </div>
        )}

        {challenges.length > 0 && (
          <div style={styles.list}>
            {challenges.map((challenge) => {
              const pct = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
              return (
                <div key={challenge._id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <span style={styles.cardIcon}>{TYPE_ICONS[challenge.type] || '✨'}</span>
                    <div style={{ flex: 1 }}>
                      <p style={styles.cardTitle}>{challenge.title}</p>
                      <p style={styles.cardDesc}>{challenge.description}</p>
                    </div>
                    {challenge.completed && <span style={styles.completedBadge}>✓ Completed</span>}
                  </div>

                  <div style={styles.progressBarTrack}>
                    <div
                      style={{
                        ...styles.progressBarFill,
                        width: `${pct}%`,
                        background: challenge.completed ? '#22c55e' : '#4f46e5',
                      }}
                    />
                  </div>
                  <div style={styles.progressRow}>
                    <span style={styles.progressText}>
                      {challenge.progress} / {challenge.target}
                    </span>
                    <span style={styles.rewardText}>Reward: +{challenge.reward} pts</span>
                  </div>
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
  pageTitle: { color: '#1e293b', marginBottom: '0.4rem', fontSize: '1.5rem' },
  subtitle: { color: '#64748b', marginBottom: '1.75rem' },
  errorMsg: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '0.85rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.25rem',
  },
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
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.25rem 1.5rem',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.85rem',
    marginBottom: '0.9rem',
  },
  cardIcon: { fontSize: '1.75rem' },
  cardTitle: { margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '1rem' },
  cardDesc: { margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.875rem' },
  completedBadge: {
    background: '#dcfce7',
    color: '#15803d',
    padding: '0.25rem 0.7rem',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
  },
  progressBarTrack: {
    height: '10px',
    background: '#e2e8f0',
    borderRadius: '999px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 0.3s ease',
  },
  progressRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.825rem',
  },
  progressText: { color: '#475569', fontWeight: 600 },
  rewardText: { color: '#16a34a', fontWeight: 700 },
};

export default MyChallenges;
