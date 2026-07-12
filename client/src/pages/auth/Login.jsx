import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data, data.token);
      // Redirect based on role
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'staff') navigate('/staff');
      else navigate('/visitor');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>🎡</span>
          <h1 style={styles.logoText}>ParkPulse</h1>
        </div>
        <h2 style={styles.subtitle}>Sign In to Your Account</h2>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.linkText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    background: '#fff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '420px',
  },
  logoArea: { textAlign: 'center', marginBottom: '0.5rem' },
  logoIcon: { fontSize: '3rem' },
  logoText: { color: '#2563eb', margin: '0.25rem 0 0', fontSize: '1.75rem' },
  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    fontWeight: 400,
    fontSize: '1rem',
    marginBottom: '1.75rem',
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.25rem',
    fontSize: '0.9rem',
  },
  field: { marginBottom: '1.1rem' },
  label: {
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: 600,
    color: '#374151',
    fontSize: '0.875rem',
  },
  input: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    border: '1.5px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '0.8rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background 0.2s',
  },
  linkText: {
    textAlign: 'center',
    marginTop: '1.25rem',
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  link: { color: '#2563eb', fontWeight: 600 },
};

export default Login;