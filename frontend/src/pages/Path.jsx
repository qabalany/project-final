import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const DONE_FLAGS = [true, true, true, false, false, false];

const Path = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t, dir } = useLanguage();

    const steps = t('path.steps').map((s, i) => ({
        ...s,
        id: i + 1,
        done: DONE_FLAGS[i],
    }));

    return (
        <div className="flex-1 p-8 font-cairo" dir={dir}>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-[#1b0444] dark:text-gray-100 mb-1">{t('path.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{t('path.subtitle')}</p>
            </div>

            {/* Progress Summary */}
            <div className="bg-gradient-to-br from-[#1567c4] to-[#0d6ed1] rounded-2xl p-6 text-white mb-8 shadow-[0_8px_24px_rgba(21,103,196,0.25)]">
                <p className="text-white/80 text-sm mb-1">{t('path.greeting')} {user?.name || (dir === 'rtl' ? 'متعلم' : 'Learner')}!</p>
                <h2 className="text-xl font-extrabold mb-3">{t('path.progressIntro')}</h2>
                <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/30 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: '50%' }}></div>
                    </div>
                    <span className="text-sm font-bold whitespace-nowrap">3 / 6 {t('path.progressLabel')}</span>
                </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-3 max-w-lg">
                {steps.map((step, idx) => (
                    <div
                        key={step.id}
                    className={`flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] dark:shadow-none px-5 py-4 transition-all duration-200
                            ${step.done ? 'opacity-70 dark:opacity-100' : ''}
                            ${step.cta ? 'border-2 border-[#2994f9]' : 'border border-[#f0f0f8] dark:border-gray-700'}
                        `}
                    >
                        {/* Step indicator */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold
                            ${step.done
                                ? 'bg-[#e8f5e9] text-green-600'
                                : step.cta
                                    ? 'bg-[#1567c4] text-white'
                                    : 'bg-[#f4f3fd] text-[#b0b0c3]'}
                        `}>
                            {step.done ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            ) : (
                                step.id
                            )}
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                            <p className={`text-sm font-bold ${step.done ? 'text-gray-500 dark:text-gray-400' : 'text-[#1b0444] dark:text-gray-100'}`}>{step.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{step.sublabel}</p>
                        </div>

                        {/* CTA Button */}
                        {step.cta && (
                            <button
                                onClick={() => navigate('/avatar-session')}
                                className="shrink-0 px-4 py-1.5 rounded-xl bg-[#1567c4] text-white text-xs font-bold shadow-sm hover:bg-[#1057b0] transition"
                            >
                                {t('path.startBtn')}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Path;
