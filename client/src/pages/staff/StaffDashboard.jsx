import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [ticketId, setTicketId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleValidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/tickets/validate', {
        ticketId: ticketId.trim().toUpperCase(),
      });
      setResult({ success: true, ...data });
      // Add to session history
      setHistory((prev) => [
        { ticketId: ticketId.trim().toUpperCase(), success: true, time: new Date(), name: data.ticket?.visitor?.name },
        ...prev.slice(0, 9), // Keep last 10
      ]);
    } catch (err) {
      const msg = err.response?.data?.message || 'Validation failed';
      setResult({ success: false, message: msg });
      setHistory((prev) => [
        { ticketId: ticketId.trim().toUpperCase(), success: false, time: new Date() },
        ...prev.slice(0, 9),
      ]);
    } finally {
      setLoading(false);
      setTicketId('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerLogo}>🎡 ParkPlus — Staff Portal</h1>
        <div style={styles.headerRight}>
          <span style={styles.headerUser}>{user?.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.grid}>
          {/* Left — validation form */}
          <div>
            <h2 style={styles.sectionTitle}>🚪 Gate Entry Validation</h2>
            <div style={styles.card}>
              <p style={styles.cardHint}>
                Enter the Ticket ID shown on the visitor's screen
              </p>
              <form onSubmit={handleValidate}>
                <input
                  style={styles.ticketInput}
                  type="text"
                  placeholder="e.g. PARK-ABC123-XY789"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading || !ticketId}
                  style={styles.validateBtn}
                >
                  {loading ? '⏳ Checking...' : '✅ Validate Ticket'}
                </button>
              </form>
            </div>

            {/* Result */}
            {result && (
              <div style={result.success ? styles.successResult : styles.failResult}>
                <h3 style={styles.resultTitle}>
                  {result.success ? '✅ Entry Granted' : '❌ Entry Denied'}
                </h3>
                <p style={styles.resultMsg}>{result.message}</p>
                {result.success && result.ticket && (
                  <div style={styles.resultDetails}>
                    <p><strong>Visitor:</strong> {result.ticket.visitor?.name}</p>
                    <p><strong>Email:</strong> {result.ticket.visitor?.email}</p>
                    <p><strong>Entry Time:</strong> {new Date(result.ticket.entryTimestamp).toLocaleTimeString()}</p>
                    <p><strong>Ticket ID:</strong> <span style={{ fontFamily: 'monospace' }}>{result.ticket.ticketId}</span></p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — session history */}
          <div>
            <h2 style={styles.sectionTitle}>📋 Today's Scan History</h2>
            <div style={styles.card}>
              {history.length === 0 ? (
                <p style={styles.noHistory}>No scans yet this session.</p>
              ) : (
                <div>
                  {history.map((entry, i) => (
                    <div key={i} style={styles.historyRow}>
                      <div>
                        <span style={styles.historyId}>{entry.ticketId}</span>
                        {entry.name && <span style={styles.historyName}> — {entry.name}</span>}
                        <p style={styles.historyTime}>
                          {entry.time.toLocaleTimeString()}
                        </p>
                      </div>
                      <span style={entry.success ? styles.historyBadgeOk : styles.historyBadgeFail}>
                        {entry.success ? 'OK' : 'FAIL'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f0f4ff' },
  header: {
    background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  headerLogo: { margin: 0, fontSize: '1.3rem' },
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
  main: { maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' },
  sectionTitle: { color: '#1e293b', marginBottom: '1rem', fontSize: '1.2rem' },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
  },
  cardHint: { color: '#64748b', marginBottom: '1.25rem', fontSize: '0.9rem' },
  ticketInput: {
    width: '100%',
    padding: '0.9rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem',
    fontFamily: 'monospace',
    letterSpacing: '0.05em',
    marginBottom: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    textTransform: 'uppercase',
  },
  validateBtn: {
    width: '100%',
    padding: '0.9rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  successResult: {
    marginTop: '1rem',
    background: '#f0fdf4',
    border: '2px solid #86efac',
    borderRadius: '12px',
    padding: '1.25rem',
  },
  failResult: {
    marginTop: '1rem',
    background: '#fef2f2',
    border: '2px solid #fca5a5',
    borderRadius: '12px',
    padding: '1.25rem',
  },
  resultTitle: { margin: '0 0 0.5rem', fontSize: '1.1rem' },
  resultMsg: { color: '#475569', margin: '0 0 0.75rem' },
  resultDetails: {
    borderTop: '1px solid #d1fae5',
    paddingTop: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    fontSize: '0.9rem',
  },
  noHistory: { color: '#94a3b8', textAlign: 'center', padding: '1rem' },
  historyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.6rem 0',
    borderBottom: '1px solid #f1f5f9',
  },
  historyId: { fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600 },
  historyName: { color: '#64748b', fontSize: '0.85rem' },
  historyTime: { color: '#94a3b8', fontSize: '0.8rem', margin: '0.15rem 0 0' },
  historyBadgeOk: {
    background: '#dcfce7',
    color: '#16a34a',
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  historyBadgeFail: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
};

export default StaffDashboard;