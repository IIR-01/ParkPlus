import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, tickets: 0 });

  useEffect(() => {
    fetchBasicStats();
  }, []);

  const fetchBasicStats = async () => {
    try {
      const { data } = await api.get('/auth/me');
      // Just confirms the admin is logged in — full stats come in Sprint 4
    } catch (err) {
      // Silent fail for now
    }
  };

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
        <p style={styles.subtitle}>
          Full admin dashboard coming in Sprint 4. Features being tracked:
        </p>
        <div style={styles.grid}>
          {[
            { icon: '🎟️', label: 'Entry Ticketing', status: 'Live (Sprint 1)', color: '#dcfce7', border: '#86efac' },
            { icon: '🗺️', label: 'Park Map', status: 'Sprint 2', color: '#fef9c3', border: '#fde047' },
            { icon: '⏱️', label: 'Queue System', status: 'Sprint 2', color: '#fef9c3', border: '#fde047' },
            { icon: '🚨', label: 'Lost-Child Alert', status: 'Sprint 3', color: '#f0f4ff', border: '#93c5fd' },
            { icon: '🎁', label: 'Gift Recommendations', status: 'Sprint 3', color: '#f0f4ff', border: '#93c5fd' },
            { icon: '🏆', label: 'Rewards & Challenges', status: 'Sprint 3', color: '#f0f4ff', border: '#93c5fd' },
            { icon: '🌤️', label: 'Weather Integration', status: 'Sprint 2', color: '#fef9c3', border: '#fde047' },
            { icon: '📊', label: 'Admin Dashboard', status: 'Sprint 4', color: '#fdf4ff', border: '#d8b4fe' },
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