import { useState } from 'react';
import api from '../../utils/api';

const ZONES = ['Main Gate', 'Roller Coaster Zone', 'Water Rides', 'Food Court', 'Gift Shop Row', 'Kids Zone'];

const LostChildModal = ({ onClose, onSubmitted }) => {
  const [description, setDescription] = useState('');
  const [lastSeenZone, setLastSeenZone] = useState(ZONES[0]);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhotoUrl(reader.result); // base64 data URL
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/lostchild/report', { description, lastSeenZone, photoUrl });
      onSubmitted();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>🚨 Report a Lost Child</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Description (name, age, clothing)</label>
          <textarea
            style={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. 6-year-old boy, red t-shirt, blue shorts"
            required
          />
          <label style={styles.label}>Last Seen Zone</label>
          <select style={styles.input} value={lastSeenZone} onChange={(e) => setLastSeenZone(e.target.value)}>
            {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          <label style={styles.label}>Photo (optional)</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} style={styles.fileInput} />
          {photoUrl && <img src={photoUrl} alt="preview" style={styles.preview} />}
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Submitting...' : '🚨 Submit Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem',
  },
  modal: { background: '#fff', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '440px' },
  title: { marginTop: 0, color: '#dc2626' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.7rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#374151', margin: '0.9rem 0 0.35rem' },
  textarea: { width: '100%', minHeight: '70px', padding: '0.6rem 0.8rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box', fontFamily: 'inherit' },
  input: { width: '100%', padding: '0.6rem 0.8rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' },
  fileInput: { width: '100%', fontSize: '0.85rem' },
  preview: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.6rem' },
  actions: { display: 'flex', gap: '0.75rem', marginTop: '1.5rem' },
  cancelBtn: { flex: 1, padding: '0.7rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  submitBtn: { flex: 1, padding: '0.7rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 },
};

export default LostChildModal;