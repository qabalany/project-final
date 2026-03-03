import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

const AppFeedbackPage = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({ name: user?.name || '', message: '' });
    const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.message.trim()) return;

        setStatus('loading');
        setErrorMsg('');

        try {
            await client.post('/app-feedback', {
                name: form.name || 'مجهول',
                message: form.message,
                userId: user?._id || null,
            });
            setStatus('success');
            setForm((prev) => ({ ...prev, message: '' }));
        } catch (err) {
            setStatus('error');
            setErrorMsg(err?.response?.data?.message || 'حدث خطأ، حاول مرة أخرى.');
        }
    };

    return (
        <div className="flex-1 p-8 font-cairo" dir="rtl">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-[#1b0444] mb-1">ارسال شكوى أو اقتراح</h1>
                <p className="text-[#858597] text-sm">شاركنا ملاحظاتك لتحسين تجربتك مع لُقَه.</p>
            </div>

            <div className="max-w-xl">
                {/* Success Banner */}
                {status === 'success' && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 mb-6 text-sm font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        تم إرسال رسالتك بنجاح! شكراً لمساعدتنا في تحسين التطبيق.
                    </div>
                )}

                {/* Error Banner */}
                {status === 'error' && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 mb-6 text-sm font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {errorMsg}
                    </div>
                )}

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 flex flex-col gap-5"
                >
                    {/* Name Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#1b0444] font-bold text-sm">الاسم</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="اسمك (اختياري)"
                            className="w-full h-11 px-4 rounded-xl border border-[#e9e9f0] bg-[#fafafa] text-[#1b0444] font-cairo text-sm placeholder:text-[#b0b0c3] focus:outline-none focus:border-[#2994f9] focus:ring-2 focus:ring-[#2994f9]/20 transition"
                        />
                    </div>

                    {/* Type Chips */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#1b0444] font-bold text-sm">نوع الرسالة</label>
                        <div className="flex gap-2 flex-wrap">
                            {['شكوى', 'اقتراح', 'استفسار'].map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            message: prev.message.startsWith(`[${t}]`)
                                                ? prev.message
                                                : `[${t}] ${prev.message.replace(/^\[.*?\]\s*/, '')}`,
                                        }))
                                    }
                                    className="px-4 py-1.5 rounded-full border border-[#e0e0f0] text-sm font-semibold text-[#858597] hover:border-[#2994f9] hover:text-[#2994f9] hover:bg-[#f0f8ff] transition"
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#1b0444] font-bold text-sm">الرسالة <span className="text-red-500">*</span></label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            placeholder="اكتب شكواك أو اقتراحك هنا..."
                            className="w-full px-4 py-3 rounded-xl border border-[#e9e9f0] bg-[#fafafa] text-[#1b0444] font-cairo text-sm placeholder:text-[#b0b0c3] resize-none focus:outline-none focus:border-[#2994f9] focus:ring-2 focus:ring-[#2994f9]/20 transition"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={status === 'loading' || !form.message.trim()}
                        className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-[#2994f9] text-white font-cairo font-bold text-sm shadow-sm hover:bg-[#1a7de0] hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? (
                            <>
                                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                                جاري الإرسال...
                            </>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                                إرسال
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AppFeedbackPage;
