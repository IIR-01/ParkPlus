import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const VisitorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch visitor's existing ticket on load
  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      const { data } = await api.get('/tickets/my');
      // Show the most recent ticket
      if (data.length > 0) setTicket(data[0]);
    } catch (err) {
      // No tickets yet — that's fine
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTicket = async () => {
    setGenerating(true);
    setError('');
    setMessage('');
    try {
      const { data } = await api.post('/tickets/generate');
      setTicket(data.ticket);
      setMessage('🎉 Your entry ticket has been generated!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate ticket. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerLogo}>🎡 ParkPlus</h1>
        <div style={styles.headerRight}>
          <span style={styles.headerUser}>Hello, {user?.name} 👋</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={styles.main}>
        <h2 style={styles.pageTitle}>My Entry Ticket</h2>

        {message && <div style={styles.successMsg}>{message}</div>}
        {error && <div style={styles.errorMsg}>{error}</div>}

        {/* No ticket yet */}
        {!ticket && (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>🎟️</div>
            <h3 style={styles.emptyTitle}>No ticket for today</h3>
            <p style={styles.emptyText}>
              Generate your entry ticket to gain access to the park.
            </p>
            <button
              onClick={handleGenerateTicket}
              disabled={generating}
              style={styles.generateBtn}
            >
              {generating ? '⏳ Generating...' : '🎟️ Generate My Entry Ticket'}
            </button>
          </div>
        )}

        {/* Ticket exists */}
        {ticket && (
          <div style={styles.ticketCard}>
            <div style={styles.ticketTop}>
              <div>
                <h3 style={styles.ticketTitle}>🎟️ Entry Ticket</h3>
                <p style={styles.ticketDate}>
                  Valid: {new Date(ticket.validDate).toLocaleDateString('en-BD', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <span style={ticket.isUsed ? styles.badgeUsed : styles.badgeValid}>
                {ticket.isUsed ? '✓ USED' : '● VALID'}
              </span>
            </div>

            <div style={styles.divider} />

            <div style={styles.ticketBody}>
              <div style={styles.ticketInfo}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Ticket ID</span>
                  <span style={styles.ticketId}>{ticket.ticketId}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Name</span>
                  <span>{user?.name}</span>
                </div>
                {ticket.isUsed && (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Entry Time</span>
                    <span>{new Date(ticket.entryTimestamp).toLocaleTimeString()}</span>
                  </div>
                )}
              </div>

              <div style={styles.qrSection}>
                <img
                  src={ticket.qrCode}
                  alt="Entry QR Code"
                  style={styles.qrImage}
                />
                <p style={styles.qrHint}>Show this at the gate</p>
              </div>
            </div>
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
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  headerUser: { fontSize: '0.95rem', opacity: 0.9 },
  logoutBtn: {
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
  successMsg: {
    background: '#f0fdf4',
    border: '1px solid #86efac',
    color: '#15803d',
    padding: '0.85rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.25rem',
    fontWeight: 500,
  },
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
  emptyText: { color: '#64748b', marginBottom: '2rem' },
  generateBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '0.85rem 2rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  ticketCard: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    overflow: 'hidden',
  },
  ticketTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
    color: '#fff',
  },
  ticketTitle: { margin: '0 0 0.3rem', fontSize: '1.1rem' },
  ticketDate: { margin: 0, opacity: 0.85, fontSize: '0.875rem' },
  badgeValid: {
    background: '#22c55e',
    color: '#fff',
    padding: '0.3rem 0.85rem',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
  },
  badgeUsed: {
    background: 'rgba(255,255,255,0.25)',
    color: '#fff',
    padding: '0.3rem 0.85rem',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.8rem',
  },
  divider: { height: '1px', background: '#e2e8f0' },
  ticketBody: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  ticketInfo: { flex: 1 },
  infoRow: { marginBottom: '0.85rem' },
  infoLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 600,
    marginBottom: '0.15rem',
  },
  ticketId: {
    fontFamily: 'monospace',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1e293b',
    letterSpacing: '0.05em',
  },
  qrSection: { textAlign: 'center' },
  qrImage: {
    width: '160px',
    height: '160px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  qrHint: { color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.4rem' },
};

export default VisitorDashboard;