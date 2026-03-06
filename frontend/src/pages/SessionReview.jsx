import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import avatarService from '../api/avatar.service';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const SessionReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isOnboarding = location.state?.isOnboarding;
    const { toggle, lang, dir } = useLanguage();
    const { isDark, toggleDark } = useTheme();

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let currentTranscripts = location.state?.transcripts;
        const hasFreshTranscripts = !!(currentTranscripts && currentTranscripts.length > 0);

        if (!hasFreshTranscripts) {
            const savedTranscripts = sessionStorage.getItem('logah_session_transcripts');
            if (savedTranscripts) {
                try {
                    currentTranscripts = JSON.parse(savedTranscripts);
                } catch (e) { }
            }
        } else {
            // New session just ended — clear any stale cached result so we re-analyse
            sessionStorage.removeItem('logah_review_result');
            sessionStorage.setItem('logah_session_transcripts', JSON.stringify(currentTranscripts));
        }

        if (!currentTranscripts || currentTranscripts.length === 0) {
            const emptyResult = {
                level: "-",
                feedback: "لم يتم التقاط أي حديث خلال هذه الجلسة لتحليله.",
                mistakes: []
            };
            setResult(emptyResult);
            sessionStorage.setItem('logah_review_result', JSON.stringify(emptyResult));
            setLoading(false);
            return;
        }

        // Only use cached result when there are NO fresh transcripts (i.e. page was refreshed)
        if (!hasFreshTranscripts) {
            const savedResult = sessionStorage.getItem('logah_review_result');
            if (savedResult) {
                try {
                    const parsedResult = JSON.parse(savedResult);
                    setResult(parsedResult);
                    setLoading(false);
                    return;
                } catch (e) { }
            }
        }

        const fetchAnalysis = async () => {
            try {
                const analysisResult = await avatarService.analyzeSession(currentTranscripts);
                setResult(analysisResult);
                sessionStorage.setItem('logah_review_result', JSON.stringify(analysisResult));
                setLoading(false);
            } catch (err) {
                console.error('Analysis error:', err);
                setError('حدث خطأ أثناء تحليل الجلسة. يرجى المحاولة لاحقاً.');
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [location.state, navigate]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f3f4f8] dark:bg-gray-900 text-[#1b0444] dark:text-gray-100 p-5 text-center font-sans tracking-tight" dir={dir}>
                <div className="w-20 text-center flex items-center justify-center gap-2">
                    <div className="w-4 h-4 bg-[#31d4ed] rounded-full animate-bounce"></div>
                    <div className="w-4 h-4 bg-[#31d4ed] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-4 h-4 bg-[#31d4ed] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <h2 className="text-2xl mt-8 mb-4 font-bold tracking-wider">جاري تحليل أدائك...</h2>
                <p className="text-[#858597] max-w-sm leading-relaxed text-lg tracking-wide">نقوم الآن بمراجعة محادثتك مع المعلم لتقييم مستواك واستخراج الملاحظات لتحسين لغتك.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f3f4f8] dark:bg-gray-900 text-[#1b0444] dark:text-gray-100 p-5 text-center font-sans tracking-tight" dir={dir}>
                <div className="text-6xl mb-6">⚠️</div>
                <h2 className="text-2xl text-red-500 mb-4 font-bold">عذراً!</h2>
                <p className="text-[#858597] mb-8 max-w-md leading-relaxed tracking-wide">{error}</p>
                <button className="bg-[#2994f9] text-white border-none rounded-2xl px-8 py-4 text-lg font-bold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(41,148,249,0.3)] hover:bg-[#2482DB] hover:-translate-y-1" onClick={() => navigate('/')}>
                    العودة للرئيسية
                </button>
            </div>
        );
    }

    if (!result) return null;

    // A mapping for CEFR levels to Arabic terms for better UI
    const levelLabels = {
        'A1': 'مبتدئ جداً',
        'A2': 'مبتدئ',
        'B1': 'متوسط',
        'B2': 'فوق المتوسط',
        'C1': 'متقدم',
        'C2': 'متمرس (كلغة أم)'
    };

    const levelTitle = levelLabels[result.level] || result.level;

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-[#f3f4f8] dark:bg-gray-900 text-[#1b0444] dark:text-gray-100 pb-12 font-sans tracking-tight relative" dir={dir}>
            <header className="flex w-full pt-6 pb-2 bg-transparent items-center justify-between shrink-0 sticky top-0 z-50 px-6">
                <div className="flex items-center gap-2 w-1/3 cursor-pointer transition-opacity hover:opacity-80" onClick={() => navigate('/')}>
                    <img src="/favicon.svg" alt="Logah" className="w-[30px] h-[30px]" />
                    <span className="font-bold text-lg text-[#232360] dark:text-gray-100 font-sans">Logah</span>
                </div>

                <div className="w-1/3"></div>

                <div className="flex items-center justify-end w-1/3 gap-2">
                    <button
                        onClick={toggleDark}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e0e0e8] dark:border-gray-600 text-[#858597] dark:text-gray-300 hover:text-[#2994f9] transition-colors duration-200"
                        aria-label="Toggle dark mode"
                    >
                        {isDark ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        )}
                    </button>
                    <button
                        onClick={toggle}
                        className="text-sm font-medium text-[#2994f9] border border-[#2994f9] rounded-lg px-3 py-1.5 hover:bg-[#2994f9] hover:text-white transition-colors duration-200"
                    >
                        {lang === 'ar' ? 'English' : 'عربي'}
                    </button>
                    <button className="flex items-center gap-2 bg-transparent border-none text-[#858597] dark:text-gray-400 text-[15px] font-bold cursor-pointer transition-colors hover:text-red-500" onClick={() => navigate('/')}>
                        {lang === 'ar' ? 'إغلاق' : 'Close'}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center w-full max-w-[800px] mx-auto mt-6 px-4 sm:px-6 md:px-8">
                <h1 className="text-[2rem] font-extrabold mb-3 text-[#1b0444] dark:text-gray-100 tracking-wide text-center w-full">تقرير مستوى التحدث</h1>

                <div className="flex flex-col sm:flex-row gap-4 mb-2 w-full justify-center">
                    <div className="bg-gradient-to-br from-[#31d4ed] to-[#2994f9] rounded-3xl p-6 text-white text-center shadow-[0_8px_30px_rgba(41,148,249,0.15)] flex flex-col items-center justify-center shrink-0 sm:w-[280px]">
                        <div className="bg-white/20 border-2 border-white/30 backdrop-blur-md w-24 h-24 rounded-full flex items-center justify-center text-4xl font-extrabold mb-5 shadow-inner">{result.level}</div>
                        <h3 className="text-lg text-white/90 mb-2 font-medium">مستواك المتوقع</h3>
                        <p className="text-2xl font-bold tracking-wide">{levelTitle}</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-[0_8px_20px_rgba(184,184,210,0.27)] dark:shadow-none border border-[#f3f4f8] dark:border-gray-700 flex flex-col justify-center flex-1 relative gap-4">
                        <div className="flex items-center gap-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2994f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
                            <h3 className="text-xl text-[#1b0444] dark:text-gray-100 font-bold m-0">التقييم العام</h3>
                        </div>
                        <p className="text-[#858597] dark:text-gray-400 leading-relaxed text-[17px] tracking-wide text-center sm:text-right">{result.feedback}</p>
                    </div>
                </div>

                {result.level === "-" ? (
                    <div className="bg-white dark:bg-gray-800 rounded-[30px] py-6 px-6 shadow-[0_8px_20px_rgba(184,184,210,0.27)] dark:shadow-none border border-[#f3f4f8] dark:border-gray-700 mt-4 w-full relative flex flex-col items-center justify-center">
                        <div className="w-[80px] h-[80px] rounded-full bg-[#f4f3fd] dark:bg-gray-700 flex items-center justify-center mb-6 text-[#858597] dark:text-gray-400">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="2" x2="22" y2="22" /><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" /><path d="M5 10v2a7 7 0 0 0 12 5l-1.5 1.5a5 5 0 0 1-9-5v-2" /><path d="M16 16l1.5-1.5C18.4 13.5 19 12.8 19 12v-2c0-1.5-.5-2.6-1.3-3.3" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /></svg>
                        </div>
                        <h3 className="text-2xl text-[#1b0444] dark:text-gray-100 font-bold mb-3 tracking-wide">لم نستمع لحديثك!</h3>
                        <p className="text-[#858597] text-lg leading-relaxed max-w-xl mx-auto tracking-wide">يبدو أنك لم تتحدث خلال هذه الجلسة، لذلك لا توجد كلمات أو أخطاء لتقييمها. حاول التحدث أكثر في المرة القادمة!</p>
                    </div>
                ) : result.mistakes && result.mistakes.length > 0 ? (
                    <div className="mt-4 w-full">
                        <h2 className="text-2xl font-bold text-[#1b0444] dark:text-gray-100 mb-6 tracking-wider text-center">أخطاء يمكنك تحسينها</h2>
                        <div className="flex flex-col gap-4 w-full">
                            {result.mistakes.map((mistake, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-[0_8px_20px_rgba(184,184,210,0.27)] dark:shadow-none border border-[#f3f4f8] dark:border-gray-700 relative overflow-hidden w-full">
                                    <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-[#ff6b6b] to-[#ff8e8e]"></div>
                                    <div className="flex items-start gap-4">
                                        <span className="bg-red-50 text-red-500 rounded-full w-12 h-12 flex items-center justify-center shrink-0 shadow-sm border border-red-100">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </span>
                                        <div className="flex-1 pt-1 overflow-hidden">
                                            <span className="text-red-500 font-bold text-[15px] mb-2 block tracking-wider">قلت:</span>
                                            <p className="text-xl text-[#1b0444] dark:text-gray-100 font-medium leading-relaxed break-words" dir="ltr">{mistake.error}</p>
                                        </div>
                                    </div>
                                    <div className="h-[1px] bg-[#f3f4f8] my-4 ml-0 mr-16"></div>
                                    <div className="flex items-start gap-4">
                                        <span className="bg-emerald-50 text-emerald-500 rounded-full w-12 h-12 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </span>
                                        <div className="flex-1 pt-1 overflow-hidden">
                                            <span className="text-emerald-500 font-bold text-[15px] mb-2 block tracking-wider">الأفضل أن تقول:</span>
                                            <p className="text-xl text-[#1b0444] dark:text-gray-100 font-medium leading-relaxed break-words" dir="ltr">{mistake.correction}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-[30px] py-6 px-6 shadow-[0_8px_20px_rgba(184,184,210,0.27)] dark:shadow-none border border-[#f3f4f8] dark:border-gray-700 mt-4 w-full relative flex flex-col items-center justify-center">
                        <div className="w-[80px] h-[80px] rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center mb-6 text-yellow-500 border border-yellow-100 dark:border-yellow-800">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        </div>
                        <h3 className="text-2xl text-[#1b0444] dark:text-gray-100 font-bold mb-3 tracking-wide">عمل رائع!</h3>
                        <p className="text-[#858597] text-lg">لم يتم رصد أخطاء مؤثرة في حديثك خلال هذه الجلسة.</p>
                    </div>
                )}

                <div className="mt-4 w-full flex justify-center">
                    <button className="bg-gradient-to-r from-[#2994f9] to-[#31d4ed] text-white border-none rounded-2xl py-4 flex items-center justify-center gap-3 px-10 text-[1.1rem] font-bold cursor-pointer transition-all duration-300 shadow-[0_8px_20px_rgba(41,148,249,0.3)] hover:shadow-[0_12px_25px_rgba(41,148,249,0.4)] hover:-translate-y-1 w-full" onClick={() => navigate('/feedback')}>
                        التالي لتقييم المنصة
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default SessionReview;
