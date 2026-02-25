import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OnboardingHeader = ({ step = 1, totalSteps = 4, onBack }) => {
    const [showModal, setShowModal] = useState(false);
    const { user, completeOnboarding } = useAuth();
    const navigate = useNavigate();

    // Calculate progress percentage for the bar
    const progressPercentage = (step / totalSteps) * 100;

    const handleSkip = async () => {
        // If they are a demo user testing the app, just mock the onboarding completion
        if (user?.isDemoUser) {
            sessionStorage.setItem('demoOnboardingDone', 'true');
            navigate('/');
        } else {
            // Otherwise, hit the real backend
            try {
                if (completeOnboarding) {
                    await completeOnboarding();
                }
                navigate('/');
            } catch (error) {
                console.error('Failed to complete onboarding:', error);
                navigate('/');
            }
        }
    };

    return (
        <>
            {/* The main header bar */}
            <header className="flex w-full h-[70px] bg-white items-center justify-between px-6 lg:px-10 shrink-0 border-b border-[#f3f4f8] shadow-sm z-50">
                {/* Back Button (only show if onBack is provided, i.e., not step 1) */}
                <div className="flex items-center gap-4 w-1/3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="bg-transparent border-none flex items-center gap-2 text-[#858597] hover:text-[#2994f9] font-sans font-medium text-[15px] cursor-pointer transition-colors"
                            aria-label="العودة للخطوة السابقة"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rotate-180">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                            <span className="hidden sm:inline" dir="rtl">رجوع</span>
                        </button>
                    )}
                </div>

                {/* Center: Progress Bar & Logo */}
                <div className="flex flex-col items-center justify-center w-1/3 gap-3">
                    {/* Non-clickable logo per USER REQUEST to prevent accidental exits */}
                    <div className="flex items-center gap-2 cursor-default select-none">
                        <img src="/favicon.svg" alt="Logah Icon" className="w-[28px] h-[28px]" aria-hidden="true" />
                        <span className="font-bold text-[22px] text-[#1B0444]">Logah</span>
                    </div>

                    {/* Progress Bar (Visual only, ARIA tells the screen reader the real progress) */}
                    <div
                        className="w-full max-w-[200px] h-1.5 bg-[#f3f4f8] rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={progressPercentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label={`الخطوة ${step} من ${totalSteps}`}
                    >
                        <div
                            className="h-full bg-gradient-to-r from-[#2994f9] to-[#31d4ed] rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Skip Button */}
                <div className="flex items-center justify-end w-1/3">
                    <button
                        className="bg-transparent border-none text-[#858597] hover:text-[#2994f9] font-sans font-bold text-[15px] cursor-pointer transition-colors px-4 py-2"
                        onClick={() => setShowModal(true)}
                        aria-expanded={showModal}
                        aria-haspopup="dialog"
                    >
                        تخطي
                    </button>
                </div>
            </header>

            {/* Skip Confirmation Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-[#1b0444]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-5"
                    onClick={() => setShowModal(false)}
                    dir="rtl"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        className="bg-white rounded-[24px] w-full max-w-[420px] p-8 shadow-[0_20px_40px_rgba(27,4,68,0.1)] flex flex-col items-center text-center animate-[fade-in-up_0.3s_ease-out]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Decorative Icon */}
                        <div className="w-16 h-16 bg-[#eef4ff] rounded-full flex items-center justify-center mb-5" aria-hidden="true">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2994f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>

                        <h3 id="modal-title" className="text-xl font-bold text-[#1b0444] mb-3">تخطي التجربة؟</h3>
                        <p className="text-[#858597] text-[15px] leading-relaxed mb-8">
                            إذا قمت بالتخطي الآن، لن تتمكن من تجربة مميزات الموقع مثل جلسة المحادثة مع المدرب الذكي وإعطائنا رأيك. هل أنت متأكد؟
                        </p>

                        {/* Modal Actions */}
                        <div className="flex gap-3 w-full">
                            <button
                                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#2994f9] to-[#31d4ed] text-white font-bold text-[15px] border-none cursor-pointer transition-transform hover:-translate-y-0.5 shadow-[0_8px_16px_rgba(41,148,249,0.2)]"
                                onClick={() => setShowModal(false)}
                            >
                                إكمال التجربة 🚀
                            </button>
                            <button
                                className="flex-1 h-12 rounded-xl bg-[#f3f4f8] text-[#858597] font-bold text-[15px] border-none cursor-pointer transition-colors hover:bg-[#e2e4ec] hover:text-[#1b0444]"
                                onClick={handleSkip}
                            >
                                تأكيد التخطي
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OnboardingHeader;
