import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const TYPE_LABELS = {
  zone_checkin: 'Zone check-ins',
  ride_completed: 'Rides completed',
  points: 'Points earned',
};

const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'zone_checkin',
  target: 5,
  reward: 50,
};

const ChallengeManagement = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data } = await api.get('/challenges');
      setChallenges(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load challenges.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'target' || name === 'reward' ? Number(value) : value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await api.post('/challenges', form);
      setMessage(`Challenge "${form.title}" created.`);
      setForm(EMPTY_FORM);
      fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create challenge.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (challenge) => {
    try {
      await api.put(`/challenges/${challenge._id}`, {
        isActive: !challenge.isActive,
      });
      fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update challenge.');
    }
  };

  const handleDelete = async (challenge) => {
    if (!window.confirm(`Delete "${challenge.title}"? This also clears every visitor's progress on it.`)) {
      return;
    }
    try {
      await api.delete(`/challenges/${challenge._id}`);
      fetchChallenges();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete challenge.');
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🎡 ParkPlus — Admin Portal</h1>
        <button onClick={() => navigate('/admin')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </header>

      <main style={styles.main}>
        <h2 style={styles.pageTitle}>🏆 Challenges & Rewards</h2>
        <p style={styles.subtitle}>
          Define challenges for visitors — progress is tracked automatically
          from zone check-ins, ride completions, and points earned.
        </p>

        {error && <div style={styles.errorMsg}>{error}</div>}
        {message && <div style={styles.successMsg}>{message}</div>}

        {/* Create form */}
        <form onSubmit={handleCreate} style={styles.form}>
          <h3 style={styles.formTitle}>New Challenge</h3>
          <div style={styles.formRow}>
            <label style={styles.label}>
              Title
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Park Explorer"
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}>
              Description
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="e.g. Check in to 5 different zones"
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.formGrid}>
            <label style={styles.label}>
              Tracks
              <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label style={styles.label}>
              Target
              <input
                type="number"
                name="target"
                min="1"
                value={form.target}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Reward (points)
              <input
                type="number"
                name="reward"
                min="0"
                value={form.reward}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>
          </div>
          <button type="submit" disabled={saving} style={styles.submitBtn}>
            {saving ? 'Creating...' : '+ Create Challenge'}
          </button>
        </form>

        {/* List */}
        <h3 style={styles.sectionTitle}>All Challenges</h3>

        {loading && <p>Loading challenges...</p>}

        {!loading && challenges.length === 0 && (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>No challenges yet — create one above.</p>
          </div>
        )}

        {!loading && challenges.length > 0 && (
          <div style={styles.list}>
            {challenges.map((challenge) => (
              <div key={challenge._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <p style={styles.cardTitle}>{challenge.title}</p>
                    <p style={styles.cardDesc}>{challenge.description}</p>
                  </div>
                  <span style={challenge.isActive ? styles.badgeActive : styles.badgeInactive}>
                    {challenge.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={styles.cardMeta}>
                  <span>{TYPE_LABELS[challenge.type]}</span>
                  <span>Target: {challenge.target}</span>
                  <span>Reward: +{challenge.reward} pts</span>
                </div>
                <div style={styles.cardActions}>
                  <button onClick={() => handleToggleActive(challenge)} style={styles.toggleBtn}>
                    {challenge.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(challenge)} style={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
  backBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  main: { maxWidth: '760px', margin: '2rem auto', padding: '0 1rem' },
  pageTitle: { color: '#1e293b', marginBottom: '0.4rem' },
  subtitle: { color: '#64748b', marginBottom: '1.75rem' },
  errorMsg: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '0.85rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.25rem',
  },
  successMsg: {
    background: '#f0fdf4',
    border: '1px solid #86efac',
    color: '#15803d',
    padding: '0.85rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.25rem',
    fontWeight: 500,
  },
  form: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    marginBottom: '2rem',
  },
  formTitle: { margin: '0 0 1rem', color: '#1e293b' },
  formRow: { marginBottom: '1rem' },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1.25rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#475569',
  },
  input: {
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.9rem',
    fontWeight: 400,
    color: '#1e293b',
  },
  submitBtn: {
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    padding: '0.7rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  sectionTitle: { color: '#1e293b', marginBottom: '1rem', fontSize: '1.1rem' },
  emptyCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
  },
  emptyText: { color: '#64748b', margin: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.25rem 1.5rem',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.6rem',
  },
  cardTitle: { margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '1rem' },
  cardDesc: { margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.875rem' },
  badgeActive: {
    background: '#dcfce7',
    color: '#15803d',
    padding: '0.25rem 0.7rem',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
  },
  badgeInactive: {
    background: '#f1f5f9',
    color: '#64748b',
    padding: '0.25rem 0.7rem',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
  },
  cardMeta: {
    display: 'flex',
    gap: '1.25rem',
    color: '#475569',
    fontSize: '0.85rem',
    marginBottom: '0.85rem',
    flexWrap: 'wrap',
  },
  cardActions: { display: 'flex', gap: '0.6rem' },
  toggleBtn: {
    background: '#eef2ff',
    color: '#4338ca',
    border: '1px solid #c7d2fe',
    padding: '0.4rem 0.9rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  deleteBtn: {
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    padding: '0.4rem 0.9rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
};

export default ChallengeManagement;
