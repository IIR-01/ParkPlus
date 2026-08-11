import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';

const LostChildAlertPanel = () => {
  const [reports, setReports] = useState([]);
  const [markingId, setMarkingId] = useState(null);

  const fetchActiveReports = useCallback(async () => {
    try {
      const { data } = await api.get('/lostchild/active');
      setReports(data);
    } catch (err) {
      // Silent fail on a poll tick — don't spam the UI with errors
    }
  }, []);

  useEffect(() => {
    fetchActiveReports(); // fetch immediately on mount
    const interval = setInterval(fetchActiveReports, 5000); // F13 — poll every 5 seconds
    return () => clearInterval(interval); // cleanup on unmount
  }, [fetchActiveReports]);

  const handleMarkFound = async (id) => {
    setMarkingId(id);
    try {
      await api.patch(`/lostchild/${id}/found`);
      fetchActiveReports(); // refresh immediately after marking
    } catch (err) {
      alert('Failed to update. Please try again.');
    } finally {
      setMarkingId(null);
    }
  };

  if (reports.length === 0) return null;

  return (
    <div style={styles.panel}>
      <h3 style={styles.title}>🚨 Active Lost-Child Alerts ({reports.length})</h3>
      {reports.map((r) => (
        <div key={r._id} style={styles.card}>
          <div style={styles.cardTop}>
            {r.photoUrl && <img src={r.photoUrl} alt="child" style={styles.photo} />}
            <div style={{ flex: 1 }}>
              <p style={styles.description}>{r.description}</p>
              <p style={styles.meta}>
                📍 {r.lastSeenZone} · Reported by {r.submittedBy?.name} ·{' '}
                {new Date(r.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleMarkFound(r._id)}
            disabled={markingId === r._id}
            style={styles.foundBtn}
          >
            {markingId === r._id ? 'Updating...' : '✅ Mark as Found'}
          </button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  panel: { background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' },
  title: { margin: '0 0 1rem', color: '#991b1b', fontSize: '1.05rem' },
  card: { background: '#fff', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' },
  cardTop: { display: 'flex', gap: '0.85rem', marginBottom: '0.75rem' },
  photo: { width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px' },
  description: { margin: 0, fontWeight: 600, color: '#1e293b' },
  meta: { margin: '0.3rem 0 0', color: '#64748b', fontSize: '0.8rem' },
  foundBtn: { width: '100%', padding: '0.6rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
};

export default LostChildAlertPanel;