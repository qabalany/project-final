import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const OnboardingHeader = ({ currentStep = 1, totalSteps = 4, onBack, showProgress = true, showSkip = true }) => {
    const [showModal, setShowModal] = useState(false);
    const { user, completeOnboarding } = useAuth();
    const { toggle, lang, t, dir } = useLanguage();
    const { isDark, toggleDark } = useTheme();
    const navigate = useNavigate();

    // Calculate progress percentage for the bar
    const progressPercentage = (currentStep / totalSteps) * 100;

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
            <header className="flex w-full h-[70px] bg-white dark:bg-gray-900 items-center justify-between px-6 lg:px-10 shrink-0 border-b border-[#f3f4f8] dark:border-gray-700 shadow-sm z-50">
                {/* Back Button (only show if onBack is provided, i.e., not step 1) */}
                <div className="flex items-center gap-4 w-1/3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="bg-transparent border-none flex items-center gap-2 text-[#858597] dark:text-gray-400 hover:text-[#2994f9] font-sans font-medium text-[15px] cursor-pointer transition-colors"
                            aria-label={t('onboardingHeader.backLabel')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rotate-180">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                            <span className="hidden sm:inline">{t('onboardingHeader.back')}</span>
                        </button>
                    )}
                </div>

                {/* Center: Logo (+ Progress Bar when showProgress is true) */}
                <div className="flex flex-col items-center justify-center w-1/3 gap-3">
                    {/* Non-clickable logo per USER REQUEST to prevent accidental exits */}
                    <div className="flex items-center gap-2 cursor-default select-none">
                        <img src="/favicon.svg" alt="Logah Icon" className="w-[28px] h-[28px]" aria-hidden="true" />
                        <span className="font-bold text-[22px] text-[#1B0444] dark:text-gray-100">Logah</span>
                    </div>

                    {/* Progress Bar — only shown during onboarding steps */}
                    {showProgress && (
                        <div
                            className="w-full max-w-[200px] h-1.5 bg-[#f3f4f8] dark:bg-gray-700 rounded-full overflow-hidden"
                            role="progressbar"
                            aria-valuenow={progressPercentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-label={`الخطوة ${currentStep} من ${totalSteps}`}
                        >
                            <div
                                className="h-full bg-gradient-to-r from-[#2994f9] to-[#31d4ed] rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    )}
                </div>

                {/* Right: Dark toggle + Language toggle + Skip */}
                <div className="flex items-center justify-end w-1/3 gap-2">
                    {/* Dark mode toggle */}
                    <button
                        onClick={toggleDark}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e0e0e8] dark:border-gray-600 text-[#858597] dark:text-gray-300 hover:border-[#2994f9] hover:text-[#2994f9] transition-colors duration-200"
                        aria-label="Toggle dark mode"
                    >
                        {isDark ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                            </svg>
                        )}
                    </button>

                    {/* Language toggle */}
                    <button
                        onClick={toggle}
                        className="text-sm font-medium text-[#2994f9] border border-[#2994f9] rounded-lg px-3 py-1.5 hover:bg-[#2994f9] hover:text-white transition-colors duration-200"
                    >
                        {lang === 'ar' ? 'English' : 'عربي'}
                    </button>

                    {/* Skip button — only shown during onboarding */}
                    {showSkip && (
                        <button
                            className="bg-transparent border-none text-[#858597] dark:text-gray-400 hover:text-[#2994f9] font-sans font-bold text-[15px] cursor-pointer transition-colors px-2 py-2 hidden sm:block"
                            onClick={() => setShowModal(true)}
                            aria-expanded={showModal}
                            aria-haspopup="dialog"
                        >
                            {t('onboardingHeader.skip')}
                        </button>
                    )}
                </div>
            </header>

            {/* Skip Confirmation Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-[#1b0444]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-5"
                    onClick={() => setShowModal(false)}
                    dir={dir}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-[24px] w-full max-w-[420px] p-8 shadow-[0_20px_40px_rgba(27,4,68,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col items-center text-center animate-[fade-in-up_0.3s_ease-out]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Decorative Icon */}
                        <div className="w-16 h-16 bg-[#eef4ff] dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-5" aria-hidden="true">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2994f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>

                        <h3 id="modal-title" className="text-xl font-bold text-[#1b0444] dark:text-gray-100 mb-3">{t('onboardingHeader.skipTitle')}</h3>
                        <p className="text-[#858597] dark:text-gray-400 text-[15px] leading-relaxed mb-8">
                            {t('onboardingHeader.skipWarning')}
                        </p>

                        {/* Modal Actions */}
                        <div className="flex gap-3 w-full">
                            <button
                                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#2994f9] to-[#31d4ed] text-white font-bold text-[15px] border-none cursor-pointer transition-transform hover:-translate-y-0.5 shadow-[0_8px_16px_rgba(41,148,249,0.2)]"
                                onClick={() => setShowModal(false)}
                            >
                                {t('onboardingHeader.continueBtn')}
                            </button>
                            <button
                                className="flex-1 h-12 rounded-xl bg-[#f3f4f8] dark:bg-gray-700 text-[#858597] dark:text-gray-300 font-bold text-[15px] border-none cursor-pointer transition-colors hover:bg-[#e2e4ec] dark:hover:bg-gray-600 hover:text-[#1b0444] dark:hover:text-gray-100"
                                onClick={handleSkip}
                            >
                                {t('onboardingHeader.confirmSkip')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OnboardingHeader;
