import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import feedbackService from '../api/feedback.service';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

// Arabic DB values — kept stable so analytics mappings in FeedbackCharts stay correct
const EASE_VALUES     = ['سهل جداً', 'سهل لحد ما', 'محايد', 'صعب'];
const QUALITY_VALUES  = ['ممتازة', 'جيدة جداً', 'مقبولة', 'سيئة'];
const USEFUL_VALUES   = ['نعم، مفيد جداً', 'نعم، نوعاً ما', 'لا، لم استفد كثيراً'];
const RECOMMEND_VALUES = ['بالتأكيد 🤩', 'ربما 🤔', 'لا اعتقد 😕'];

const Feedback = () => {
    const navigate = useNavigate();
    const { isDark, toggleDark } = useTheme();
    const { toggle, lang, dir, t } = useLanguage();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        easeOfUse: '',
        websiteDesign: 0,
        sessionQuality: '',
        usefulness: '',
        recommendation: '',
        additionalComments: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await feedbackService.submitFeedback(formData);
            console.log('Feedback saved successfully:', formData);
            setSubmitted(true);
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 3000);
        } catch (error) {
            console.error('Failed to save feedback:', error);
            // Even if it fails we redirect them, so they don't get stuck
            setSubmitted(true);
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center min-h-screen bg-[#f3f4f8] dark:bg-gray-900 font-sans" dir={dir}>
                <header className="absolute top-0 flex w-full h-[70px] bg-white dark:bg-gray-800 items-center justify-between px-6 lg:px-10 shrink-0 border-b border-[#f3f4f8] dark:border-gray-700">
                    {/* Left side */}
                    <div className="flex items-center gap-4 w-1/3"></div>

                    {/* Center: Logo */}
                    <div className="flex flex-col items-center justify-center w-1/3 gap-1">
                        <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80" onClick={() => navigate('/')}>
                            <img src="/favicon.svg" alt="Logah Icon" className="w-[24px] h-[24px]" aria-hidden="true" />
                            <span className="font-bold text-[20px] text-[#1b0444] dark:text-gray-100">Logah</span>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center justify-end w-1/3"></div>
                </header>
                <div className="flex-1 flex items-center justify-center w-full mt-[60px]">
                    <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-[0_20px_40px_rgba(49,212,237,0.08)] dark:shadow-none w-full max-w-[400px] text-center border-t-4 border-[#31d4ed] relative mx-4 flex flex-col items-center">
                        <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#31d4ed]/20 to-[#2994f9]/20 flex items-center justify-center mb-6 text-[#2994f9]">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#1b0444] dark:text-gray-100 mb-4">{t('survey.successTitle')}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{t('survey.successMsg')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#f3f4f8] dark:bg-gray-900 w-full font-sans relative" dir={dir}>
            <header className="sticky top-0 z-50 flex w-full pt-6 pb-2 bg-transparent items-center justify-between shrink-0 px-6">
                <div className="flex items-center gap-2 w-1/3 cursor-pointer transition-opacity hover:opacity-80" onClick={() => navigate('/')}>
                    <img src="/favicon.svg" alt="Logah" className="w-[30px] h-[30px]" />
                    <span className="font-bold text-lg text-[#232360] dark:text-gray-100 font-sans">Logah</span>
                </div>

                {/* Center: Progress Bar */}
                <div className="flex flex-col items-center justify-center w-full max-w-[200px] mx-auto">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">{t('survey.stepLabel')} {step} {t('survey.stepOf')}</span>
                    <div className="w-full h-2 bg-white dark:bg-gray-700 rounded-full overflow-hidden shadow-sm border border-[#e5e7eb] dark:border-gray-600">
                        <div className="h-full bg-gradient-to-r from-[#2994f9] to-[#31d4ed] transition-all duration-500 ease-out" style={{ width: `${(step / 7) * 100}%` }}></div>
                    </div>
                </div>

                <div className="flex items-center justify-end w-1/3 gap-2">
                    <button onClick={toggleDark} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0e0e8] dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-[#1567c4] transition-colors duration-200" aria-label="Toggle dark mode">
                        {isDark ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
                    </button>
                    <button onClick={toggle} className="text-sm font-medium text-[#1567c4] border border-[#1567c4] rounded-lg px-3 py-1.5 hover:bg-[#1567c4] hover:text-white transition-colors duration-200">
                        {lang === 'ar' ? 'English' : 'عربي'}
                    </button>
                    <button className="flex items-center gap-2 bg-transparent border-none text-gray-600 dark:text-gray-400 text-[15px] font-bold cursor-pointer transition-colors hover:text-red-500" onClick={() => navigate('/')}>
                        {t('survey.close')}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                </div>
            </header>

            <main className="w-full max-w-[600px] mx-auto flex flex-col items-center mt-6">
                <h1 className="text-[2rem] font-extrabold text-[#1b0444] dark:text-gray-100 mb-2 text-center tracking-wide">{t('survey.shareOpinion')}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-center text-lg">{t('survey.shareDesc')}</p>

                <div className="bg-white dark:bg-gray-800 p-5 sm:px-6 sm:py-5 rounded-[30px] shadow-[0_8px_20px_rgba(184,184,210,0.27)] dark:shadow-none w-full border border-[#f3f4f8] dark:border-gray-700 relative">
                    {step === 1 && (
                        <div>
                            <h3 className="text-xl text-[#0a0f1c] dark:text-gray-100 mb-3 font-bold">{t('survey.step1.question')}</h3>
                            <input
                                type="text"
                                className="w-full p-4 border-2 border-[#d0c4eb] dark:border-gray-600 rounded-xl text-base outline-none transition-all duration-300 focus:border-[#31D4ED] focus:shadow-[0_0_0_4px_rgba(49,212,237,0.15)] bg-white dark:bg-gray-700 text-[#0a0f1c] dark:text-gray-100 dark:placeholder-gray-400"
                                placeholder={t('survey.step1.placeholder')}
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 className="text-xl text-[#0a0f1c] dark:text-gray-100 mb-3 font-bold">{t('survey.step2.question')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {EASE_VALUES.map((val, i) => (
                                    <button
                                        key={val}
                                        className={`flex items-center justify-start px-3 py-3 min-h-[48px] rounded-xl text-sm transition-all duration-200 text-right ${formData.easeOfUse === val ? 'bg-[#f0f9ff] dark:bg-blue-900/30 border-2 border-[#31D4ED] text-[#0a0f1c] dark:text-gray-100 font-bold shadow-[0_4px_12px_rgba(49,212,237,0.15)]' : 'bg-[#f8f6fb] dark:bg-gray-700 border-2 border-[#d0c4eb] dark:border-gray-600 text-[#4b5563] dark:text-gray-300 font-semibold hover:bg-[#f8fcff] dark:hover:bg-gray-600 hover:border-[#89e5f5] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(49,212,237,0.08)]'}`}
                                        onClick={() => handleChange('easeOfUse', val)}
                                    >
                                        {(t('survey.step2.options') || [])[i] || val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h3 className="text-xl text-[#0a0f1c] dark:text-gray-100 mb-3 font-bold">{t('survey.step3.question')}</h3>
                            <div className="w-full text-center" dir="ltr">
                                <div className="flex justify-center gap-2 flex-row-reverse">
                                    {[5, 4, 3, 2, 1].map(star => (
                                        <span
                                            key={star}
                                            className={`text-5xl cursor-pointer transition-colors duration-200 hover:text-[#fbbf24] ${formData.websiteDesign >= star ? 'text-[#fbbf24]' : 'text-[#e5e7eb] dark:text-gray-600'}`}
                                            onClick={() => handleChange('websiteDesign', star)}
                                        >★</span>
                                    ))}
                                </div>
                                <div className="flex justify-between w-[250px] mx-auto mt-2 text-[#6b7280] text-sm font-semibold" dir="rtl">
                                    <span>{t('survey.step3.best')}</span>
                                    <span>{t('survey.step3.worst')}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h3 className="text-xl text-[#0a0f1c] dark:text-gray-100 mb-3 font-bold">{t('survey.step4.question')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {QUALITY_VALUES.map((val, i) => (
                                    <button
                                        key={val}
                                        className={`flex items-center justify-start px-3 py-3 min-h-[48px] rounded-xl text-sm transition-all duration-200 text-right ${formData.sessionQuality === val ? 'bg-[#f0f9ff] dark:bg-blue-900/30 border-2 border-[#31D4ED] text-[#0a0f1c] dark:text-gray-100 font-bold shadow-[0_4px_12px_rgba(49,212,237,0.15)]' : 'bg-[#f8f6fb] dark:bg-gray-700 border-2 border-[#d0c4eb] dark:border-gray-600 text-[#4b5563] dark:text-gray-300 font-semibold hover:bg-[#f8fcff] dark:hover:bg-gray-600 hover:border-[#89e5f5] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(49,212,237,0.08)]'}`}
                                        onClick={() => handleChange('sessionQuality', val)}
                                    >
                                        {(t('survey.step4.options') || [])[i] || val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div>
                            <h3 className="text-xl text-[#0a0f1c] dark:text-gray-100 mb-3 font-bold">{t('survey.step5.question')}</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {USEFUL_VALUES.map((val, i) => (
                                    <button
                                        key={val}
                                        className={`flex items-center justify-start px-3 py-3 min-h-[48px] rounded-xl text-sm transition-all duration-200 text-right ${formData.usefulness === val ? 'bg-[#f0f9ff] dark:bg-blue-900/30 border-2 border-[#31D4ED] text-[#0a0f1c] dark:text-gray-100 font-bold shadow-[0_4px_12px_rgba(49,212,237,0.15)]' : 'bg-[#f8f6fb] dark:bg-gray-700 border-2 border-[#d0c4eb] dark:border-gray-600 text-[#4b5563] dark:text-gray-300 font-semibold hover:bg-[#f8fcff] dark:hover:bg-gray-600 hover:border-[#89e5f5] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(49,212,237,0.08)]'}`}
                                        onClick={() => handleChange('usefulness', val)}
                                    >
                                        {(t('survey.step5.options') || [])[i] || val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 6 && (
                        <div>
                            <h3 className="text-xl text-[#1b0444] dark:text-gray-100 mb-3 font-bold">{t('survey.step6.question')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {RECOMMEND_VALUES.map((val, i) => (
                                    <button
                                        key={val}
                                        className={`flex items-center justify-start px-3 py-3 min-h-[48px] rounded-xl text-sm transition-all duration-200 text-right ${formData.recommendation === val ? 'bg-[#31d4ed]/10 dark:bg-blue-900/30 border-2 border-[#31d4ed] text-[#1b0444] dark:text-gray-100 font-bold shadow-[0_4px_12px_rgba(49,212,237,0.15)]' : 'bg-[#f3f4f8] dark:bg-gray-700 border-2 border-transparent text-gray-700 dark:text-gray-300 font-semibold hover:bg-[#eef2f6] dark:hover:bg-gray-600 hover:border-[#31d4ed]/50 hover:-translate-y-[2px]'}`}
                                        onClick={() => handleChange('recommendation', val)}
                                    >
                                        {(t('survey.step6.options') || [])[i] || val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 7 && (
                        <div>
                            <h3 className="text-xl text-[#0a0f1c] dark:text-gray-100 mb-3 font-bold">{t('survey.step7.question')}</h3>
                            <textarea
                                className="w-full h-[100px] p-4 border-2 border-[#d0c4eb] dark:border-gray-600 rounded-xl text-base outline-none transition-all duration-300 focus:border-[#31D4ED] focus:shadow-[0_0_0_4px_rgba(49,212,237,0.15)] resize-y bg-white dark:bg-gray-700 text-[#0a0f1c] dark:text-gray-100 dark:placeholder-gray-400"
                                placeholder={t('survey.step7.placeholder')}
                                value={formData.additionalComments}
                                onChange={(e) => handleChange('additionalComments', e.target.value)}
                            />
                        </div>
                    )}

                    <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-600 relative z-10">
                        {step > 1 && (
                            <button className="bg-[#f3f4f8] dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-none px-6 py-4 rounded-xl text-[1.1rem] font-bold cursor-pointer transition-all duration-300 hover:bg-[#e2e4e9] dark:hover:bg-gray-600" onClick={handlePrev}>{t('survey.prev')}</button>
                        )}
                        {step < 7 ? (
                            <button
                                className="flex-1 bg-[#1567c4] text-white border-none p-4 rounded-xl text-[1.1rem] font-bold cursor-pointer transition-all duration-300 hover:bg-[#1057b0] hover:-translate-y-[2px] shadow-[0_4px_15px_rgba(21,103,196,0.2)] hover:shadow-[0_8px_20px_rgba(21,103,196,0.3)] disabled:bg-[#d1d5db] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                onClick={handleNext}
                                disabled={
                                    (step === 2 && !formData.easeOfUse) ||
                                    (step === 3 && !formData.websiteDesign) ||
                                    (step === 4 && !formData.sessionQuality) ||
                                    (step === 5 && !formData.usefulness) ||
                                    (step === 6 && !formData.recommendation)
                                }
                            >
                                {t('survey.next')}
                            </button>
                        ) : (
                            <button className="flex-1 bg-[#1567c4] text-white border-none p-4 rounded-xl text-[1.1rem] font-bold cursor-pointer transition-all duration-300 hover:bg-[#1057b0] hover:-translate-y-[2px] shadow-[0_4px_15px_rgba(21,103,196,0.2)] hover:shadow-[0_8px_20px_rgba(21,103,196,0.3)] disabled:bg-[#d1d5db] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? t('survey.submitting') : t('survey.submit')}
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Feedback;
