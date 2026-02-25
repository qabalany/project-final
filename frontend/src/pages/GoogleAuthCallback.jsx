import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api/auth.service';

const GoogleAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // Securely store the token temporarily to fetch the profile
            localStorage.setItem('token', token);

            // Fetch the user's complete profile using the new Google token
            fetch(`${API_URL}/users/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(userData => {
                    // Combine the profile data with the token
                    const fullUser = { ...userData, token };

                    // Our AuthContext login method handles saving this to state & storage
                    login(fullUser);

                    // --- ROLE-BASED REDIRECTION ---
                    // Admins go to their dashboard
                    if (userData.role === 'admin') {
                        navigate('/admin/dashboard');
                        // Users who haven't completed the setup wizard go to onboarding
                    } else if (userData.onboardingCompleted === false) {
                        navigate('/mother-tongue');
                        // Returning users go straight to the app
                    } else {
                        navigate('/');
                    }
                })
                .catch(error => {
                    console.error("Error fetching Google profile:", error);
                    // Even if fetching the visual profile fails, the token is valid, so go to home
                    navigate('/');
                });
        } else {
            // If someone navigates to this page manually without a token in the URL, bounce them
            navigate('/login');
        }
    }, [searchParams, navigate, login]);

    // This is the loading screen the user sees for a split second while we fetch their data
    return (
        <div
            className="flex items-center justify-center min-h-screen bg-white"
            // LIGHTHOUSE ACCESSIBILITY: Tells screen readers this area is dynamically updating and keep the user informed
            role="status"
            aria-live="polite"
        >
            <div className="flex flex-col items-center gap-4">
                {/* Tailwind animated spinning loader */}
                <div className="w-12 h-12 border-4 border-[#eaeaff] border-t-[#2994f9] rounded-full animate-spin" aria-hidden="true" />
                <p className="font-sans text-[18px] text-[#1b0444] font-medium" dir="rtl">
                    جاري التحقق من الحساب...
                </p>
                {/* Visually hidden text specifically for screen readers since the spinner is aria-hidden */}
                <span className="sr-only">جاري تحميل بيانات حساب جوجل</span>
            </div>
        </div>
    );
};

export default GoogleAuthCallback;
