import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import OnboardingRoute from './components/OnboardingRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import GoogleAuthCallback from './pages/GoogleAuthCallback.jsx';
import MotherTongue from './pages/MotherTongue.jsx';

// Placeholder Pages for routing layout
const Home = () => <div style={{ padding: '2rem', textAlign: 'center' }}><h1>Logah Frontend is running!</h1><p>Home Dashboard (Protected)</p></div>;
const AdminDashboard = () => <div style={{ padding: '2rem', textAlign: 'center' }}><h1>Admin Dashboard</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public / Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* OAuth Callback */}
          <Route path="/api/users/google/callback" element={<GoogleAuthCallback />} />

          {/* Onboarding Routes */}
          <Route
            path="/mother-tongue"
            element={
              <OnboardingRoute>
                <MotherTongue />
              </OnboardingRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Protected Main Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
