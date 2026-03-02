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
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1c] text-white p-5 text-center font-sans tracking-tight" dir="rtl">
                <div className="w-20 text-center flex items-center justify-center gap-2">
                    <div className="w-4 h-4 bg-[#31d4ed] rounded-full animate-bounce"></div>
                    <div className="w-4 h-4 bg-[#31d4ed] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-4 h-4 bg-[#31d4ed] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <h2 className="text-2xl mt-8 mb-4 font-bold tracking-wider">جاري تحليل أدائك...</h2>
                <p className="text-white/50 max-w-sm leading-relaxed text-lg tracking-wide">نقوم الآن بمراجعة محادثتك مع المعلم لتقييم مستواك واستخراج الملاحظات لتحسين لغتك.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1c] text-white p-5 text-center font-sans tracking-tight" dir="rtl">
                <div className="text-6xl mb-6">⚠️</div>
                <h2 className="text-2xl text-red-500 mb-4 font-bold">عذراً!</h2>
                <p className="text-white/50 mb-8 max-w-md leading-relaxed tracking-wide">{error}</p>
                <button className="bg-[#2994f9] text-white border-none rounded-2xl px-8 py-4 text-lg font-bold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(41,148,249,0.3)] hover:bg-[#2482DB] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(41,148,249,0.3)]" onClick={() => navigate('/')}>
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
        <div className="min-h-screen bg-[#0a0f1c] text-white pb-12 font-sans tracking-tight" dir="rtl">
            <header className="bg-[#131b2f] text-white h-20 flex justify-between items-center px-[5%] shadow-md border-b border-white/5 sticky top-0 z-10">
                <div className="flex items-center gap-3 cursor-pointer transition-opacity hover:opacity-80" onClick={() => navigate('/')}>
                    <img src="/logah-logo.png" alt="Logah" className="w-[120px] h-auto object-contain brightness-0 invert opacity-90" onError={(e) => { e.target.onerror = null; e.target.src = '/vite.svg' }} />
                </div>
                <button className="bg-transparent border-none text-white/50 text-sm font-semibold cursor-pointer transition-colors duration-300 hover:text-red-400" onClick={() => navigate('/')}>
                    إغلاق المراجعة
                </button>
            </header>

            <main className="max-w-4xl mx-auto mt-12 px-6">
                <h1 className="text-3xl font-extrabold mb-10 text-white tracking-wider">تقرير مستوى التحدث</h1>

                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 mb-10">
                    <div className="bg-gradient-to-br from-[#1a2b56] to-[#2994f9]/20 rounded-3xl p-8 text-white text-center shadow-lg border border-white/10 flex flex-col items-center justify-center">
                        <div className="bg-white/10 border-2 border-white/20 backdrop-blur-md w-24 h-24 rounded-full flex items-center justify-center text-4xl font-extrabold mb-5 shadow-inner">{result.level}</div>
                        <h3 className="text-lg text-white/70 mb-2 font-medium">مستواك المتوقع</h3>
                        <p className="text-2xl font-bold tracking-wide">{levelTitle}</p>
                    </div>

                    <div className="bg-[#131b2f] rounded-3xl p-8 shadow-lg border border-white/5 flex flex-col justify-center">
                        <h3 className="text-xl text-white font-bold mb-4 flex items-center gap-2 before:content-['💡']">التقييم العام</h3>
                        <p className="text-white/70 leading-relaxed text-lg tracking-wide">{result.feedback}</p>
                    </div>
                </div>

                {result.level === "-" ? (
                    <div className="bg-[#131b2f] rounded-3xl py-12 px-8 text-center shadow-lg border border-white/5 mt-8">
                        <span className="text-6xl block mb-6">🤐</span>
                        <h3 className="text-2xl text-white font-bold mb-3 tracking-wide">لم نستمع لحديثك!</h3>
                        <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto tracking-wide">يبدو أنك لم تتحدث خلال هذه الجلسة، لذلك لا توجد كلمات أو أخطاء لتقييمها. حاول التحدث أكثر في المرة القادمة!</p>
                    </div>
                ) : result.mistakes && result.mistakes.length > 0 ? (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-white mb-6 tracking-wider">أخطاء يمكنك تحسينها</h2>
                        <div className="flex flex-col gap-5">
                            {result.mistakes.map((mistake, idx) => (
                                <div key={idx} className="bg-[#131b2f] rounded-2xl p-6 shadow-md border border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-1 h-full bg-orange-500/50"></div>
                                    <div className="flex items-start gap-4">
                                        <span className="bg-red-500/10 text-red-500 rounded-xl w-10 h-10 flex items-center justify-center shrink-0 text-sm border border-red-500/20">❌</span>
                                        <div className="flex-1">
                                            <span className="text-red-400 font-semibold text-sm mb-2 block tracking-wider">قلت:</span>
                                            <p className="text-xl text-white/90 font-medium leading-relaxed" dir="ltr">{mistake.error}</p>
                                        </div>
                                    </div>
                                    <div className="h-[1px] bg-white/5 my-5 ml-0 mr-14"></div>
                                    <div className="flex items-start gap-4">
                                        <span className="bg-emerald-500/10 text-emerald-500 rounded-xl w-10 h-10 flex items-center justify-center shrink-0 text-sm border border-emerald-500/20">✅</span>
                                        <div className="flex-1">
                                            <span className="text-emerald-400 font-semibold text-sm mb-2 block tracking-wider">الأفضل أن تقول:</span>
                                            <p className="text-xl text-white/90 font-medium leading-relaxed" dir="ltr">{mistake.correction}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#131b2f] rounded-3xl py-12 px-8 text-center shadow-lg border border-white/5 mt-8">
                        <span className="text-6xl block mb-6">🌟</span>
                        <h3 className="text-2xl text-white font-bold mb-3 tracking-wide">عمل رائع!</h3>
                        <p className="text-white/60 text-lg">لم يتم رصد أخطاء مؤثرة في حديثك خلال هذه الجلسة.</p>
                    </div>
                )}

                <div className="mt-12 flex justify-center">
                    <button className="bg-[#2994f9] text-white border-none rounded-2xl py-4 px-10 text-lg font-bold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(41,148,249,0.3)] hover:bg-[#2482DB] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(41,148,249,0.3)] w-full max-w-md" onClick={() => navigate('/feedback')}>
                        التالي لتقييم المنصة
                    </button>
                </div>
            </main>
        </div>
    );
};

export default SessionReview;
