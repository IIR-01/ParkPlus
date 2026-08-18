import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const REFRESH_INTERVAL_MS = 15000;
const DEFAULT_THRESHOLD = 30;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [dashboardError, setDashboardError] = useState('');
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);

  const fetchDashboard = async (thresholdValue) => {
    try {
      const { data } = await api.get('/admin/dashboard', {
        params: { threshold: thresholdValue },
      });
      setDashboard(data);
      setDashboardError('');
    } catch (err) {
      setDashboardError(err.response?.data?.message || 'Failed to load dashboard stats');
    }
  };

  useEffect(() => {
    api.get('/weather').then(({ data }) => setWeather(data)).catch(() => setWeather(null));
  }, []);

  useEffect(() => {
    fetchDashboard(threshold);
    const interval = setInterval(() => fetchDashboard(threshold), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [threshold]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🎡 ParkPlus — Admin Portal</h1>
        <div style={styles.headerRight}>
          <span style={styles.headerUser}>{user?.name} (Admin)</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <main style={styles.main}>
        <h2 style={styles.pageTitle}>Operations Overview</h2>

        {dashboardError && <div style={styles.error}>{dashboardError}</div>}

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🧑‍🤝‍🧑</span>
            <div>
              <p style={styles.statValue}>{dashboard ? dashboard.checkedInVisitors : '—'}</p>
              <p style={styles.statLabel}>Checked-In Visitors</p>
            </div>
          </div>

          <div style={{
            ...styles.statCard,
            ...(dashboard?.openAlerts > 0 ? styles.statCardAlert : {}),
          }}>
            <span style={styles.statIcon}>🚨</span>
            <div>
              <p style={styles.statValue}>{dashboard ? dashboard.openAlerts : '—'}</p>
              <p style={styles.statLabel}>Open Lost-Child Alerts</p>
            </div>
          </div>

          <div style={{
            ...styles.statCard,
            ...(dashboard?.ridesOverThresholdCount > 0 ? styles.statCardWarning : {}),
          }}>
            <span style={styles.statIcon}>⏱️</span>
            <div>
              <p style={styles.statValue}>{dashboard ? dashboard.ridesOverThresholdCount : '—'}</p>
              <p style={styles.statLabel}>Rides Over {threshold}-Min Wait</p>
            </div>
          </div>

          <label style={styles.thresholdControl}>
            Threshold (min)
            <input
              type="number"
              min="0"
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value) || 0)}
              style={styles.thresholdInput}
            />
          </label>
        </div>

        {dashboard?.ridesOverThreshold?.length > 0 && (
          <div style={styles.rideList}>
            <p style={styles.rideListTitle}>Rides currently over threshold:</p>
            <ul style={styles.rideListItems}>
              {dashboard.ridesOverThreshold.map((ride) => (
                <li key={ride._id} style={styles.rideListItem}>
                  <span>{ride.name}</span>
                  <span style={styles.rideListWait}>{ride.waitTime} mins</span>
                </li>
              ))}
            </ul>
          </div>
        )}

          {weather && (
            <div style={{
              background: weather.isAlert ? '#fef3c7' : '#f0fdf4',
              border: `1.5px solid ${weather.isAlert ? '#fbbf24' : '#86efac'}`,
              borderRadius: '12px',
              padding: '1.1rem 1.4rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <span style={{ fontSize: '2rem' }}>{weather.isAlert ? '⛈️' : '☀️'}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
                  Current Conditions: {weather.condition}{weather.temp ? ` · ${weather.temp}°C` : ''}
                </p>
                <p style={{ margin: '0.15rem 0 0', color: '#64748b', fontSize: '0.875rem' }}>
                  {weather.isAlert
                    ? 'Consider closing outdoor rides and directing visitors to indoor zones.'
                    : 'Conditions are normal — no operational changes needed.'}
                </p>
              </div>
            </div>
          )}
        <div style={styles.grid}>
          {[
            { icon: '🎟️', label: 'Entry Ticketing', status: 'Live (Sprint 1)', color: '#dcfce7', border: '#86efac' },
            { icon: '🗺️', label: 'Park Map', status: 'Sprint 2', color: '#fef9c3', border: '#fde047' },
            { icon: '⏱️', label: 'Queue System', status: 'Sprint 2', color: '#fef9c3', border: '#fde047' },
            { icon: '🚨', label: 'Lost-Child Alert', status: 'Sprint 3', color: '#f0f4ff', border: '#93c5fd' },
            { icon: '🎁', label: 'Gift Recommendations', status: 'Sprint 3', color: '#f0f4ff', border: '#93c5fd' },
            { icon: '🏆', label: 'Rewards & Challenges', status: 'Sprint 3', color: '#f0f4ff', border: '#93c5fd' },
            { icon: '🌤️', label: 'Weather Integration', status: 'Sprint 2', color: '#fef9c3', border: '#fde047' },
            { icon: '📊', label: 'Admin Dashboard', status: 'Live', color: '#dcfce7', border: '#86efac' },
          ].map((item, i) => (
            <div key={i} style={{ ...styles.featureCard, background: item.color, border: `1.5px solid ${item.border}` }}>
              <span style={styles.featureIcon}>{item.icon}</span>
              <div>
                <p style={styles.featureName}>{item.label}</p>
                <p style={styles.featureStatus}>{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f0f4ff' },
  header: {
    background: 'linear-gradient(135deg, #1e3a8a, #4f46e5)',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: { margin: 0, fontSize: '1.3rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  headerUser: { fontSize: '0.95rem', opacity: 0.9 },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  main: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  pageTitle: { color: '#1e293b', marginBottom: '0.5rem' },
  subtitle: { color: '#64748b', marginBottom: '1.75rem' },
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
  },
  statCard: {
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
  },
  statCardAlert: { border: '1.5px solid #fca5a5', background: '#fef2f2' },
  statCardWarning: { border: '1.5px solid #fde047', background: '#fefce8' },
  statIcon: { fontSize: '1.75rem' },
  statValue: { margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1e293b' },
  statLabel: { margin: '0.15rem 0 0', color: '#64748b', fontSize: '0.8rem' },
  thresholdControl: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#334155',
  },
  thresholdInput: {
    padding: '0.5rem',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '0.9rem',
    width: '100px',
  },
  rideList: {
    background: '#fff',
    border: '1.5px solid #fde047',
    borderRadius: '12px',
    padding: '1rem 1.4rem',
    marginBottom: '1.5rem',
  },
  rideListTitle: { margin: '0 0 0.5rem', fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' },
  rideListItems: { listStyle: 'none', margin: 0, padding: 0 },
  rideListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.4rem 0',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
    fontSize: '0.9rem',
  },
  rideListWait: { fontWeight: 700, color: '#b45309' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  featureCard: {
    borderRadius: '12px',
    padding: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
  },
  featureIcon: { fontSize: '1.75rem' },
  featureName: { fontWeight: 600, color: '#1e293b', margin: 0, fontSize: '0.9rem' },
  featureStatus: { color: '#64748b', margin: '0.15rem 0 0', fontSize: '0.8rem' },
};

export default AdminDashboard;