import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Wraps a route and redirects to login if not authenticated
// Usage: <ProtectedRoute allowedRoles={['visitor']}><VisitorDashboard /></ProtectedRoute>

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;