import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontFamily: 'Cairo, sans-serif'
            }}>
                <h2>جاري التحميل...</h2>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Demo users: only allow dashboard if onboarding was completed this session
    if (user?.isDemoUser && !sessionStorage.getItem('demoOnboardingDone')) {
        // Do not redirect if the demo user is currently going through the onboarding session itself
        const isAllowedOnboardingRoute = location.pathname.startsWith('/avatar-session') ||
            location.pathname.startsWith('/review') ||
            location.pathname.startsWith('/feedback');

        if (!isAllowedOnboardingRoute) {
            return <Navigate to="/mother-tongue" replace />;
        }
    }

    return children;
};

export default PrivateRoute;
