import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import feedbackService from '../api/feedback.service';

const Feedback = () => {
    const navigate = useNavigate();
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
            <div className="flex flex-col items-center min-h-screen bg-[#f3f4f8] font-sans" dir="rtl">
                <header className="absolute top-0 flex w-full h-[70px] bg-white items-center justify-between px-6 lg:px-10 shrink-0 border-b border-[#f3f4f8]">
                    {/* Left side */}
                    <div className="flex items-center gap-4 w-1/3"></div>

                    {/* Center: Logo */}
                    <div className="flex flex-col items-center justify-center w-1/3 gap-1">
                        <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80" onClick={() => navigate('/')}>
                            <img src="/favicon.svg" alt="Logah Icon" className="w-[24px] h-[24px]" aria-hidden="true" />
                            <span className="font-bold text-[20px] text-[#1b0444]">Logah</span>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center justify-end w-1/3"></div>
                </header>
                <div className="flex-1 flex items-center justify-center w-full mt-[60px]">
                    <div className="bg-white p-10 rounded-3xl shadow-[0_20px_40px_rgba(49,212,237,0.08)] w-full max-w-[400px] text-center border-t-4 border-[#31d4ed] relative mx-4 flex flex-col items-center">
                        <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#31d4ed]/20 to-[#2994f9]/20 flex items-center justify-center mb-6 text-[#2994f9]">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#1b0444] mb-4">شكراً على مشاركتك!</h2>
                        <p className="text-[#858597]">تم تسجيل تقييمك بنجاح. سنقوم بتحويلك للصفحة الرئيسية الآن...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#f3f4f8] w-full font-sans relative" dir="rtl">
            <header className="sticky top-0 z-50 flex w-full pt-6 pb-2 bg-transparent items-center justify-between shrink-0 px-6">
                <div className="flex items-center gap-2 w-1/3 cursor-pointer transition-opacity hover:opacity-80" onClick={() => navigate('/')}>
                    <img src="/favicon.svg" alt="Logah" className="w-[30px] h-[30px]" />
                    <span className="font-bold text-lg text-[#232360] font-sans">Logah</span>
                </div>

                {/* Center: Progress Bar */}
                <div className="flex flex-col items-center justify-center w-full max-w-[200px] mx-auto">
                    <span className="text-sm font-bold text-[#858597] mb-2">الخطوة {step} من 7</span>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-sm border border-[#e5e7eb]">
                        <div className="h-full bg-gradient-to-r from-[#2994f9] to-[#31d4ed] transition-all duration-500 ease-out" style={{ width: `${(step / 7) * 100}%` }}></div>
                    </div>
                </div>

                <div className="flex items-center justify-end w-1/3">
                    <button className="flex items-center gap-2 bg-transparent border-none text-[#858597] text-[15px] font-bold cursor-pointer transition-colors hover:text-red-500" onClick={() => navigate('/')}>
                        إغلاق
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                </div>
            </header>

            <main className="w-full max-w-[600px] mx-auto flex flex-col items-center mt-6">
                <h1 className="text-[2rem] font-extrabold text-[#1b0444] mb-2 text-center tracking-wide">شاركنا رأيك</h1>
                <p className="text-[#858597] mb-8 text-center text-lg">نحن مهتمون بمعرفة تجربتك لكي نطور من المنصة بشكل مستمر.</p>

                <div className="bg-white p-5 sm:px-6 sm:py-5 rounded-[30px] shadow-[0_8px_20px_rgba(184,184,210,0.27)] w-full border border-[#f3f4f8] relative">
                    {step === 1 && (
                        <div>
                            <h3 className="text-xl text-[#0a0f1c] mb-3 font-bold">1. لنتعرف عليك، ما هو الاسم؟</h3>
                            <input
                                type="text"
                                className="w-full p-4 border-2 border-[#d0c4eb] rounded-xl text-base outline-none transition-all duration-300 focus:border-[#31D4ED] focus:shadow-[0_0_0_4px_rgba(49,212,237,0.15)] bg-white text-[#0a0f1c]"
                                placeholder="أدخل اسمك هنا..."
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 className="text-xl text-[#0a0f1c] mb-3 font-bold">2. ما مدى سهولة استخدام الواجهة؟</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['سهل جداً', 'سهل لحد ما', 'محايد', 'صعب'].map(opt => (
                                    <button
                                        key={opt}
                                        className={`flex items-center justify-start px-3 py-3 min-h-[48px] rounded-xl text-sm transition-all duration-200 text-right ${formData.easeOfUse === opt ? 'bg-[#f0f9ff] border-2 border-[#31D4ED] text-[#0a0f1c] font-bold shadow-[0_4px_12px_rgba(49,212,237,0.15)]' : 'bg-[#f8f6fb] border-2 border-[#d0c4eb] text-[#4b5563] font-semibold hover:bg-[#f8fcff] hover:border-[#89e5f5] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(49,212,237,0.08)]'}`}
                                        onClick={() => handleChange('easeOfUse', opt)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h3 className="text-xl text-[#0a0f1c] mb-3 font-bold">3. تقييمك لجودة وتصميم الموقع بشكل عام؟</h3>
                            <div className="w-full text-center" dir="ltr">
                                <div className="flex justify-center gap-2 flex-row-reverse">
                                    {[5, 4, 3, 2, 1].map(star => (
                                        <span
                                            key={star}
                                            className={`text-5xl cursor-pointer transition-colors duration-200 hover:text-[#fbbf24] ${formData.websiteDesign >= star ? 'text-[#fbbf24]' : 'text-[#e5e7eb]'}`}
                                            onClick={() => handleChange('websiteDesign', star)}
                                        >★</span>
                                    ))}
                                </div>
                                <div className="flex justify-between w-[250px] mx-auto mt-2 text-[#6b7280] text-sm font-semibold" dir="rtl">
                                    <span>ممتاز</span>
                                    <span>سيء جداً</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h3 className="text-xl text-[#0a0f1c] mb-3 font-bold">4. كيف تصف جودة جلسة المحادثة مع المدرب (السرعة والأداء)؟</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {['ممتازة', 'جيدة جداً', 'مقبولة', 'سيئة'].map(opt => (
                                    <button
                                        key={opt}
                                        className={`flex items-center justify-start px-3 py-3 min-h-[48px] rounded-xl text-sm transition-all duration-200 text-right ${formData.sessionQuality === opt ? 'bg-[#f0f9ff] border-2 border-[#31D4ED] text-[#0a0f1c] font-bold shadow-[0_4px_12px_rgba(49,212,237,0.15)]' : 'bg-[#f8f6fb] border-2 border-[#d0c4eb] text-[#4b5563] font-semibold hover:bg-[#f8fcff] hover:border-[#89e5f5] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(49,212,237,0.08)]'}`}
                                        onClick={() => handleChange('sessionQuality', opt)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div>
                            <h3 className="text-xl text-[#0a0f1c] mb-3 font-bold">5. هل شعرت بالاستفادة من التقييم والمراجعة بعد الجلسة؟</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {['نعم، مفيد جداً', 'نعم، نوعاً ما', 'لا، لم استفد كثيراً'].map(opt => (
                                    <button
                                        key={opt}
                                        className={`flex items-center justify-start px-3 py-3 min-h-[48px] rounded-xl text-sm transition-all duration-200 text-right ${formData.usefulness === opt ? 'bg-[#f0f9ff] border-2 border-[#31D4ED] text-[#0a0f1c] font-bold shadow-[0_4px_12px_rgba(49,212,237,0.15)]' : 'bg-[#f8f6fb] border-2 border-[#d0c4eb] text-[#4b5563] font-semibold hover:bg-[#f8fcff] hover:border-[#89e5f5] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(49,212,237,0.08)]'}`}
                                        onClick={() => handleChange('usefulness', opt)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 6 && (
                        <div>
                            <h3 className="text-xl text-[#1b0444] mb-3 font-bold">6. هل ستقترح المنصة لأصدقائك لتعلم الإنجليزية؟</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {['بالتأكيد 🤩', 'ربما 🤔', 'لا اعتقد 😕'].map(opt => (
                                    <button
                                        key={opt}
                                        className={`flex items-center justify-start px-3 py-3 min-h-[48px] rounded-xl text-sm transition-all duration-200 text-right ${formData.recommendation === opt ? 'bg-[#31d4ed]/10 border-2 border-[#31d4ed] text-[#1b0444] font-bold shadow-[0_4px_12px_rgba(49,212,237,0.15)]' : 'bg-[#f3f4f8] border-2 border-transparent text-[#858597] font-semibold hover:bg-[#eef2f6] hover:border-[#31d4ed]/50 hover:-translate-y-[2px]'}`}
                                        onClick={() => handleChange('recommendation', opt)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 7 && (
                        <div>
                            <h3 className="text-xl text-[#0a0f1c] mb-3 font-bold">7. هل لديك أي ملاحظات إضافية لتطوير المنصة؟</h3>
                            <textarea
                                className="w-full h-[100px] p-4 border-2 border-[#d0c4eb] rounded-xl text-base outline-none transition-all duration-300 focus:border-[#31D4ED] focus:shadow-[0_0_0_4px_rgba(49,212,237,0.15)] resize-y bg-white text-[#0a0f1c]"
                                placeholder="اكتب ملاحظاتك هنا (اختياري)..."
                                value={formData.additionalComments}
                                onChange={(e) => handleChange('additionalComments', e.target.value)}
                            />
                        </div>
                    )}

                    <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 relative z-10">
                        {step > 1 && (
                            <button className="bg-[#f3f4f8] text-[#858597] border-none px-6 py-4 rounded-xl text-[1.1rem] font-bold cursor-pointer transition-all duration-300 hover:bg-[#e2e4e9]" onClick={handlePrev}>السابق</button>
                        )}
                        {step < 7 ? (
                            <button
                                className="flex-1 bg-[#2994f9] text-white border-none p-4 rounded-xl text-[1.1rem] font-bold cursor-pointer transition-all duration-300 hover:bg-[#2482DB] hover:-translate-y-[2px] shadow-[0_4px_15px_rgba(41,148,249,0.2)] hover:shadow-[0_8px_20px_rgba(41,148,249,0.3)] disabled:bg-[#d1d5db] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                onClick={handleNext}
                                disabled={
                                    (step === 2 && !formData.easeOfUse) ||
                                    (step === 3 && !formData.websiteDesign) ||
                                    (step === 4 && !formData.sessionQuality) ||
                                    (step === 5 && !formData.usefulness) ||
                                    (step === 6 && !formData.recommendation)
                                }
                            >
                                التالي
                            </button>
                        ) : (
                            <button className="flex-1 bg-[#2994f9] text-white border-none p-4 rounded-xl text-[1.1rem] font-bold cursor-pointer transition-all duration-300 hover:bg-[#31d4ed] hover:-translate-y-[2px] shadow-[0_4px_15px_rgba(41,148,249,0.2)] hover:shadow-[0_8px_20px_rgba(49,212,237,0.3)] disabled:bg-[#d1d5db] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Feedback;
