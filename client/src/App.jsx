import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';


// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Role-specific pages
import VisitorDashboard from './pages/visitor/VisitorDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import MyPoints from './pages/visitor/MyPoints';
import LiveWaitTimes from './pages/visitor/LiveWaitTimes';
import MyReservations from './pages/visitor/MyReservations';
import MyChallenges from './pages/visitor/MyChallenges';
import RideWaitManagement from './pages/staff/RideWaitManagement';
import ChallengeManagement from './pages/admin/ChallengeManagement';

// Protected route wrapper
import ProtectedRoute from './components/common/ProtectedRoute';

import InteractiveParkMap from './components/InteractiveParkMap';


function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* My visitor map feature */}
      <Route
        path="/visitor/park-map"
        element={
          <ProtectedRoute allowedRoles={['visitor']}>
            <InteractiveParkMap />
          </ProtectedRoute>
        }
      />

      {/* My points feature */}
      <Route
        path="/visitor/my-points"
        element={
          <ProtectedRoute allowedRoles={['visitor']}>
            <MyPoints />
          </ProtectedRoute>
        }
      />







      <Route
        path="/visitor/live-wait-times"
        element={
          <ProtectedRoute allowedRoles={['visitor']}>
            <LiveWaitTimes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visitor/my-reservations"
        element={
          <ProtectedRoute allowedRoles={['visitor']}>
            <MyReservations />
          </ProtectedRoute>
        }
      />

      {/* My challenges feature */}
      <Route
        path="/visitor/my-challenges"
        element={
          <ProtectedRoute allowedRoles={['visitor']}>
            <MyChallenges />
          </ProtectedRoute>
        }
      />

      {/* Visitor routes */}
      <Route
        path="/visitor/*"
        element={
          <ProtectedRoute allowedRoles={['visitor']}>
            <VisitorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/ride-wait-times"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <RideWaitManagement />
          </ProtectedRoute>
        }
      />








      {/* Staff routes */}
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin challenges management */}
      <Route
        path="/admin/challenges"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ChallengeManagement />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/park-map-test"
        element={<InteractiveParkMap />}
      />

      {/* Fallback */}
      <Route path="*" element={<div><h1>404 — Page Not Found</h1></div>} />
    </Routes>

  );
}

export default App;