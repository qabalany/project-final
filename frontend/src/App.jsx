import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import OnboardingRoute from './components/OnboardingRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import ProtectedLayout from './components/ProtectedLayout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import GoogleAuthCallback from './pages/GoogleAuthCallback.jsx';
import MotherTongue from './pages/MotherTongue.jsx';
import SecondLanguage from './pages/SecondLanguage.jsx';
import Avatar from './pages/Avatar.jsx';
import Personalised from './pages/Personalised.jsx';
import AvatarSession from './pages/AvatarSession.jsx';
import SessionReview from './pages/SessionReview.jsx';
import Feedback from './pages/Feedback.jsx';
import Home from './pages/Home.jsx';
import Settings from './pages/Settings.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Path from './pages/Path.jsx';
import Messages from './pages/Messages.jsx';
import AppFeedbackPage from './pages/AppFeedbackPage.jsx';

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
          <Route
            path="/second-language"
            element={
              <OnboardingRoute>
                <SecondLanguage />
              </OnboardingRoute>
            }
          />
          <Route
            path="/avatar"
            element={
              <OnboardingRoute>
                <Avatar />
              </OnboardingRoute>
            }
          />
          <Route
            path="/personalised"
            element={
              <OnboardingRoute>
                <Personalised />
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
            path="/avatar-session"
            element={
              <PrivateRoute>
                <AvatarSession />
              </PrivateRoute>
            }
          />
          <Route
            path="/review"
            element={
              <PrivateRoute>
                <SessionReview />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <Feedback />
              </PrivateRoute>
            }
          />

          <Route element={<PrivateRoute><ProtectedLayout /></PrivateRoute>}>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/path" element={<Path />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/app-feedback" element={<AppFeedbackPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
