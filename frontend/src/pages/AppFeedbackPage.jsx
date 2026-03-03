import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { useLanguage } from '../context/LanguageContext';

const AppFeedbackPage = () => {
    const { user } = useAuth();
    const { t, dir } = useLanguage();
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
                name: form.name || (dir === 'rtl' ? 'مجهول' : 'Anonymous'),
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
        <div className="flex-1 p-8 font-cairo" dir={dir}>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-[#1b0444] dark:text-gray-100 mb-1">{t('appFeedback.title')}</h1>
                <p className="text-[#858597] dark:text-gray-400 text-sm">{t('appFeedback.subtitle')}</p>
            </div>

            <div className="max-w-xl">
                {/* Success Banner */}
                {status === 'success' && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 mb-6 text-sm font-semibold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {t('appFeedback.successMsg')}
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
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-none p-8 flex flex-col gap-5"
                >
                    {/* Name Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#1b0444] dark:text-gray-100 font-bold text-sm" htmlFor="feedback-name">{t('appFeedback.nameLabel')}</label>
                        <input
                            id="feedback-name"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder={t('appFeedback.namePlaceholder')}
                            className="w-full h-11 px-4 rounded-xl border border-[#e9e9f0] dark:border-gray-600 bg-[#fafafa] dark:bg-gray-700 text-[#1b0444] dark:text-gray-100 font-cairo text-sm placeholder:text-[#b0b0c3] dark:placeholder:text-gray-500 focus:outline-none focus:border-[#2994f9] focus:ring-2 focus:ring-[#2994f9]/20 transition"
                        />
                    </div>

                    {/* Type Chips */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#1b0444] dark:text-gray-100 font-bold text-sm">{t('appFeedback.typeLabel')}</label>
                        <div className="flex gap-2 flex-wrap">
                            {t('appFeedback.types').map((chip) => (
                                <button
                                    key={chip}
                                    type="button"
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            message: prev.message.startsWith(`[${chip}]`)
                                                ? prev.message
                                                : `[${chip}] ${prev.message.replace(/^\[.*?\]\s*/, '')}`,
                                        }))
                                    }
                                    className="px-4 py-1.5 rounded-full border border-[#e0e0f0] dark:border-gray-600 text-sm font-semibold text-[#858597] dark:text-gray-400 hover:border-[#2994f9] hover:text-[#2994f9] hover:bg-[#f0f8ff] dark:hover:bg-gray-600 transition"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#1b0444] dark:text-gray-100 font-bold text-sm" htmlFor="feedback-message">{t('appFeedback.messageLabel')} <span className="text-red-500" aria-hidden="true">*</span></label>
                        <textarea
                            id="feedback-message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            aria-required="true"
                            rows={5}
                            placeholder={t('appFeedback.messagePlaceholder')}
                            className="w-full px-4 py-3 rounded-xl border border-[#e9e9f0] dark:border-gray-600 bg-[#fafafa] dark:bg-gray-700 text-[#1b0444] dark:text-gray-100 font-cairo text-sm placeholder:text-[#b0b0c3] dark:placeholder:text-gray-500 resize-none focus:outline-none focus:border-[#2994f9] focus:ring-2 focus:ring-[#2994f9]/20 transition"
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
                                {t('common.sending')}
                            </>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                                {t('common.send')}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AppFeedbackPage;
