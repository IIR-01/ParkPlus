import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <span style={styles.icon}>🚫</span>
        <h1 style={styles.title}>Access Denied</h1>
        <p style={styles.text}>
          {user
            ? `Your account (${user.role}) doesn't have permission to view that page.`
            : "You don't have permission to view that page."}
        </p>
        {user && <Link to={`/${user.role}`} style={styles.link}>← Back to my dashboard</Link>}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4ff', padding: '1rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', maxWidth: '420px' },
  icon: { fontSize: '3rem' },
  title: { color: '#1e293b', margin: '1rem 0 0.5rem' },
  text: { color: '#64748b', marginBottom: '1.5rem' },
  link: { color: '#2563eb', fontWeight: 600, textDecoration: 'none' },
};

export default Unauthorized;