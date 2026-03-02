import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import avatarService from '../api/avatar.service';

const SessionReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isOnboarding = location.state?.isOnboarding;

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let currentTranscripts = location.state?.transcripts;

        if (!currentTranscripts || currentTranscripts.length === 0) {
            const savedTranscripts = sessionStorage.getItem('logah_session_transcripts');
            if (savedTranscripts) {
                try {
                    currentTranscripts = JSON.parse(savedTranscripts);
                } catch (e) { }
            }
        } else {
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

        const savedResult = sessionStorage.getItem('logah_review_result');
        if (savedResult) {
            try {
                const parsedResult = JSON.parse(savedResult);
                setResult(parsedResult);
                setLoading(false);
                return;
            } catch (e) { }
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f3f4f8] text-[#1b0444] p-5 text-center font-sans tracking-tight" dir="rtl">
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f3f4f8] text-[#1b0444] p-5 text-center font-sans tracking-tight" dir="rtl">
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
        <div className="flex flex-col items-center w-full min-h-screen bg-[#f3f4f8] text-[#1b0444] pb-12 font-sans tracking-tight relative" dir="rtl">
            <header className="flex w-full h-[70px] bg-white items-center justify-between px-6 lg:px-10 shrink-0 border-b border-[#f3f4f8] shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4 w-1/3"></div>

                <div className="flex flex-col items-center justify-center w-1/3 gap-1">
                    <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80" onClick={() => navigate('/')}>
                        <img src="/favicon.svg" alt="Logah Icon" className="w-[24px] h-[24px]" aria-hidden="true" />
                        <span className="font-bold text-[20px] text-[#1b0444]">Logah</span>
                    </div>
                    <div className="w-full max-w-[150px] h-1.5 bg-[#f3f4f8] rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-gradient-to-r from-[#2994f9] to-[#31d4ed] transition-all duration-500" style={{ width: '50%' }}></div>
                    </div>
                </div>

                <div className="flex items-center justify-end w-1/3">
                    <button className="bg-transparent border-none text-[#858597] text-[15px] font-bold cursor-pointer transition-colors hover:text-red-500" onClick={() => navigate('/')}>
                        إغلاق
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center w-full max-w-[800px] mx-auto mt-12 px-4 sm:px-6 md:px-8">
                <h1 className="text-[2rem] font-extrabold mb-10 text-[#1b0444] tracking-wide text-center w-full">تقرير مستوى التحدث</h1>

                <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full justify-center">
                    <div className="bg-gradient-to-br from-[#31d4ed] to-[#2994f9] rounded-3xl p-8 text-white text-center shadow-[0_8px_30px_rgba(41,148,249,0.15)] flex flex-col items-center justify-center shrink-0 sm:w-[280px]">
                        <div className="bg-white/20 border-2 border-white/30 backdrop-blur-md w-24 h-24 rounded-full flex items-center justify-center text-4xl font-extrabold mb-5 shadow-inner">{result.level}</div>
                        <h3 className="text-lg text-white/90 mb-2 font-medium">مستواك المتوقع</h3>
                        <p className="text-2xl font-bold tracking-wide">{levelTitle}</p>
                    </div>

                    <div className="bg-white rounded-[30px] p-6 sm:p-8 shadow-[0_8px_20px_rgba(184,184,210,0.27)] border border-[#f3f4f8] flex flex-col justify-center flex-1 relative">
                        <h3 className="text-xl text-[#1b0444] font-bold mb-4 flex items-center gap-2 before:content-['💡']">التقييم العام</h3>
                        <p className="text-[#858597] leading-relaxed text-[17px] tracking-wide text-center sm:text-right">{result.feedback}</p>
                    </div>
                </div>

                {result.level === "-" ? (
                    <div className="bg-white rounded-[30px] py-12 px-6 sm:px-8 text-center shadow-[0_8px_20px_rgba(184,184,210,0.27)] border border-[#f3f4f8] mt-8 w-full relative">
                        <span className="text-6xl block mb-6">🤐</span>
                        <h3 className="text-2xl text-[#1b0444] font-bold mb-3 tracking-wide">لم نستمع لحديثك!</h3>
                        <p className="text-[#858597] text-lg leading-relaxed max-w-xl mx-auto tracking-wide">يبدو أنك لم تتحدث خلال هذه الجلسة، لذلك لا توجد كلمات أو أخطاء لتقييمها. حاول التحدث أكثر في المرة القادمة!</p>
                    </div>
                ) : result.mistakes && result.mistakes.length > 0 ? (
                    <div className="mt-8 w-full">
                        <h2 className="text-2xl font-bold text-[#1b0444] mb-8 tracking-wider text-center">أخطاء يمكنك تحسينها</h2>
                        <div className="flex flex-col gap-6 w-full">
                            {result.mistakes.map((mistake, idx) => (
                                <div key={idx} className="bg-white rounded-[30px] p-6 sm:p-8 shadow-[0_8px_20px_rgba(184,184,210,0.27)] border border-[#f3f4f8] relative overflow-hidden w-full">
                                    <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-[#ff6b6b] to-[#ff8e8e]"></div>
                                    <div className="flex items-start gap-4">
                                        <span className="bg-red-50 text-red-500 rounded-2xl w-12 h-12 flex items-center justify-center shrink-0 text-xl shadow-sm border border-red-100">❌</span>
                                        <div className="flex-1 pt-1 overflow-hidden">
                                            <span className="text-red-500 font-bold text-[15px] mb-2 block tracking-wider">قلت:</span>
                                            <p className="text-xl text-[#1b0444] font-medium leading-relaxed break-words" dir="ltr">{mistake.error}</p>
                                        </div>
                                    </div>
                                    <div className="h-[1px] bg-[#f3f4f8] my-6 ml-0 mr-16"></div>
                                    <div className="flex items-start gap-4">
                                        <span className="bg-emerald-50 text-emerald-500 rounded-2xl w-12 h-12 flex items-center justify-center shrink-0 text-xl shadow-sm border border-emerald-100">✅</span>
                                        <div className="flex-1 pt-1 overflow-hidden">
                                            <span className="text-emerald-500 font-bold text-[15px] mb-2 block tracking-wider">الأفضل أن تقول:</span>
                                            <p className="text-xl text-[#1b0444] font-medium leading-relaxed break-words" dir="ltr">{mistake.correction}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[30px] py-12 px-6 sm:px-8 text-center shadow-[0_8px_20px_rgba(184,184,210,0.27)] border border-[#f3f4f8] mt-8 w-full relative">
                        <span className="text-6xl block mb-6">🌟</span>
                        <h3 className="text-2xl text-[#1b0444] font-bold mb-3 tracking-wide">عمل رائع!</h3>
                        <p className="text-[#858597] text-lg">لم يتم رصد أخطاء مؤثرة في حديثك خلال هذه الجلسة.</p>
                    </div>
                )}

                <div className="mt-12 w-full flex justify-center">
                    <button className="bg-gradient-to-r from-[#2994f9] to-[#31d4ed] text-white border-none rounded-2xl py-4 flex items-center justify-center gap-3 px-10 text-[1.1rem] font-bold cursor-pointer transition-all duration-300 shadow-[0_8px_20px_rgba(41,148,249,0.3)] hover:shadow-[0_12px_25px_rgba(41,148,249,0.4)] hover:-translate-y-1 w-full max-w-[300px]" onClick={() => navigate('/feedback')}>
                        التالي لتقييم المنصة
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default SessionReview;
