import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const OnboardingRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();

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

    // Require authentication to even be in the onboarding flow
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check if onboarding is already completed
    let isCompleted = false;
    if (user?.isDemoUser) {
        // Demo users must complete it every session
        isCompleted = sessionStorage.getItem('demoOnboardingDone');
    } else {
        // Regular users complete it once
        isCompleted = user?.onboardingCompleted === true || user?.onboardingCompleted === 'true';
    }

    // If completed, redirect to the dashboard
    if (isCompleted) {
        return <Navigate to="/" replace />;
    }

    // Otherwise, allow them to view the onboarding steps
    return children;
};

export default OnboardingRoute;
