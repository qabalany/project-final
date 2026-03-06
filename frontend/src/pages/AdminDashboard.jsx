import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/client';
import FeedbackCharts from '../components/FeedbackCharts';
import SessionAnalytics from '../components/SessionAnalytics';

/* ── SVG Icon Components ── */

const IconChart = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="12" width="4" height="9" rx="1" />
        <rect x="10" y="7" width="4" height="14" rx="1" />
        <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
);

const IconStar = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#2994f9" stroke="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const IconHeart = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const IconShield = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2994f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

const IconAlert = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const IconInbox = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2994f9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
    </svg>
);

const IconFilter = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2994f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

const IconSearch = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2994f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const IconLogout = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2994f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const AdminDashboard = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [appFeedbacks, setAppFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t, toggle, lang, dir } = useLanguage();
    const { isDark, toggleDark } = useTheme();

    const [searchName, setSearchName] = useState('');
    const [activeTab, setActiveTab] = useState('feedback');
    const [filterRating, setFilterRating] = useState('');
    const [filterRecommend, setFilterRecommend] = useState('');
    const [filterEase, setFilterEase] = useState('');
    const [showCharts, setShowCharts] = useState(false);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const [feedbackRes, appFeedbackRes] = await Promise.all([
                    api.get('/feedback'),
                    api.get('/app-feedback').catch(() => ({ data: { data: [] } }))
                ]);
                setFeedbacks(feedbackRes.data.data || []);
                setAppFeedbacks(appFeedbackRes.data.data || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    setError(t('admin.errorUnauthorized'));
                } else {
                    setError(t('admin.errorGeneral'));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    const filteredFeedbacks = useMemo(() => {
        return feedbacks.filter(f => {
            if (searchName && !f.name?.includes(searchName)) return false;
            if (filterRating && f.websiteDesign !== Number(filterRating)) return false;
            if (filterRecommend && !f.recommendation?.includes(filterRecommend)) return false;
            if (filterEase && f.easeOfUse !== filterEase) return false;
            return true;
        });
    }, [feedbacks, searchName, filterRating, filterRecommend, filterEase]);

    const handleLogout = () => { logout(); navigate('/login'); };
    const clearFilters = () => { setSearchName(''); setFilterRating(''); setFilterRecommend(''); setFilterEase(''); };
    const hasActiveFilters = searchName || filterRating || filterRecommend || filterEase;

    const totalFeedbacks = feedbacks.length;
    const avgDesignRating = totalFeedbacks > 0
        ? (feedbacks.reduce((sum, f) => sum + (f.websiteDesign || 0), 0) / totalFeedbacks).toFixed(1)
        : '0';
    const recommendCount = feedbacks.filter(f => f.recommendation && f.recommendation.includes('بالتأكيد')).length;
    const recommendPercent = totalFeedbacks > 0 ? Math.round((recommendCount / totalFeedbacks) * 100) : 0;

    const renderStars = (rating) => (
        <div className="flex gap-[2px]" dir="ltr">
            {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`text-base ${rating >= star ? 'text-[#f59e0b]' : 'text-[#e0e0e8]'}`}>★</span>
            ))}
        </div>
    );

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen font-cairo text-[#858597] gap-4" dir={dir}>
                <div className="w-10 h-10 border-[3px] border-[#f0f0f5] border-t-[#2994f9] rounded-full animate-spin"></div>
                <p>{t('admin.loading')}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0f2f8] via-[#e8eaf3] to-[#f4f3fd] dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 font-cairo" dir={dir}>
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 p-4 md:px-8 bg-white dark:bg-gray-800 border-b border-black/5 dark:border-gray-700 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sticky top-0 z-[100]">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80" onClick={() => navigate('/')}>
                        <img src="/favicon.svg" alt="Logah" className="w-8 h-8" />
                        <span className="font-extrabold text-[#1b0444] dark:text-gray-100 text-xl tracking-tight">Logah</span>
                    </div>
                    <div className="hidden md:block w-px h-7 bg-[#e0e0e8] dark:bg-gray-600"></div>
                    <h1 className="text-lg font-bold text-[#1b0444] dark:text-gray-100 m-0">
                        {t(`admin.headerTitles.${activeTab}`)}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggle}
                        className="px-3 py-1.5 rounded-xl border-[1.5px] border-[#e0e0e8] dark:border-gray-600 text-[#858597] dark:text-gray-300 font-cairo text-sm font-bold hover:border-[#2994f9] hover:text-[#2994f9] transition-all duration-200"
                        title="Switch language"
                    >
                        {lang === 'ar' ? 'EN' : 'ع'}
                    </button>
                    <button
                        onClick={toggleDark}
                        aria-label={isDark ? t('sidebar.darkModeOff') : t('sidebar.darkModeOn')}
                        className="p-2 rounded-xl border-[1.5px] border-[#e0e0e8] dark:border-gray-600 text-[#858597] dark:text-gray-300 hover:border-[#2994f9] hover:text-[#2994f9] transition-all duration-200"
                        title={isDark ? t('sidebar.darkModeOff') : t('sidebar.darkModeOn')}
                    >
                        {isDark ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        )}
                    </button>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-[#fff7e6] to-[#fff3db] border border-[#fce4a8] rounded-full text-sm font-semibold text-[#7a5e2a]">
                        <span className="flex items-center"><IconShield /></span>
                        <span>{user?.name || 'Admin'}</span>
                    </div>
                    <button
                        className="flex items-center gap-1.5 px-4 md:px-5 py-2 bg-transparent border-[1.5px] border-[#e0e0e8] rounded-xl text-[#858597] font-cairo text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-[#fff0f0] hover:border-[#f5a5a5] hover:text-[#d94444]"
                        onClick={handleLogout}
                    >
                        <IconLogout />
                        <span>{t('admin.logout')}</span>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8">
                {/* Tab Navigation */}
                <div className="flex items-center gap-2 mb-6 bg-white dark:bg-gray-800 rounded-2xl p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none border border-black/5 dark:border-gray-700 w-fit">
                    <button
                        className={`px-5 py-2.5 rounded-xl font-cairo text-sm font-bold transition-all duration-200 ${activeTab === 'feedback'
                            ? 'bg-gradient-to-r from-[#2994f9] to-[#31d4ed] text-white shadow-md'
                            : 'text-[#858597] dark:text-gray-400 hover:bg-[#f4f3fd] dark:hover:bg-gray-700 hover:text-[#1b0444] dark:hover:text-gray-100'
                            }`}
                        onClick={() => setActiveTab('feedback')}
                    >
                        <span className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                            {t('admin.tabFeedback')}
                        </span>
                    </button>
                    <button
                        className={`px-5 py-2.5 rounded-xl font-cairo text-sm font-bold transition-all duration-200 ${activeTab === 'sessions'
                            ? 'bg-gradient-to-r from-[#2994f9] to-[#31d4ed] text-white shadow-md'
                            : 'text-[#858597] dark:text-gray-400 hover:bg-[#f4f3fd] dark:hover:bg-gray-700 hover:text-[#1b0444] dark:hover:text-gray-100'
                            }`}
                        onClick={() => setActiveTab('sessions')}
                    >
                        <span className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                            {t('admin.tabSessions')}
                        </span>
                    </button>
                    <button
                        className={`px-5 py-2.5 rounded-xl font-cairo text-sm font-bold transition-all duration-200 ${activeTab === 'app-feedback'
                            ? 'bg-gradient-to-r from-[#2994f9] to-[#31d4ed] text-white shadow-md'
                            : 'text-[#858597] dark:text-gray-400 hover:bg-[#f4f3fd] dark:hover:bg-gray-700 hover:text-[#1b0444] dark:hover:text-gray-100'
                            }`}
                        onClick={() => setActiveTab('app-feedback')}
                    >
                        <span className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                            {t('admin.tabMessages')}
                        </span>
                    </button>
                </div>

                {/* Sessions Tab */}
                {activeTab === 'sessions' && <SessionAnalytics />}

                {/* App Feedback (Messages) Tab */}
                {activeTab === 'app-feedback' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {appFeedbacks.length === 0 ? (
                            <div className="col-span-full bg-white dark:bg-gray-800 rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.05)] dark:shadow-none py-16 px-8 text-center flex flex-col items-center">
                                <div className="mb-4"><IconInbox /></div>
                                <h3 className="text-xl font-bold text-[#1b0444] dark:text-gray-100 mb-2">{t('admin.emptyMessagesTitle')}</h3>
                                <p className="text-[#858597] dark:text-gray-400 text-[0.9rem]">{t('admin.emptyMessagesDesc')}</p>
                            </div>
                        ) : (
                            appFeedbacks.map((item) => (
                                <div key={item._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/5 dark:border-gray-700 flex flex-col transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2994f9] to-[#31d4ed] text-white flex items-center justify-center text-[1.2rem] font-extrabold shrink-0 border-2 border-white shadow-sm">
                                            {item.name?.charAt(0) || '؟'}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-extrabold text-[#1b0444] dark:text-gray-100 text-[1rem] truncate">{item.name}</span>
                                            <span className="text-[0.75rem] text-[#858597] dark:text-gray-400">{formatDate(item.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="bg-[#f8f9fc] dark:bg-gray-700 rounded-xl p-4 border border-[#e8eaf3] dark:border-gray-600 flex-grow">
                                        <p className="text-[0.9rem] text-[#1b0444] dark:text-gray-100 leading-relaxed break-words whitespace-pre-wrap m-0">
                                            {item.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Feedback Tab */}
                {activeTab === 'feedback' && (<>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 border border-black/5 dark:border-gray-700">
                            <div className="flex items-center gap-10 mb-2">
                                <span className="text-[2.2rem] font-extrabold text-[#1b0444] dark:text-gray-100 leading-none">{totalFeedbacks}</span>
                                <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center bg-[#eef4ff] dark:bg-blue-900/30 shrink-0"><IconChart /></div>
                            </div>
                            <span className="text-[0.95rem] text-[#858597] dark:text-gray-400 font-semibold mt-1">{t('admin.statTotal')}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 border border-black/5 dark:border-gray-700">
                            <div className="flex items-center gap-10 mb-2">
                                <span className="text-[2.2rem] font-extrabold text-[#1b0444] dark:text-gray-100 leading-none">{avgDesignRating}</span>
                                <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center bg-[#fff9e6] dark:bg-yellow-900/30 shrink-0"><IconStar /></div>
                            </div>
                            <span className="text-[0.95rem] text-[#858597] dark:text-gray-400 font-semibold mt-1">{t('admin.statAvgDesign')}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 border border-black/5 dark:border-gray-700">
                            <div className="flex items-center gap-10 mb-2">
                                <span className="text-[2.2rem] font-extrabold text-[#1b0444] dark:text-gray-100 leading-none">{recommendPercent}%</span>
                                <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center bg-[#e8fff0] dark:bg-green-900/30 shrink-0"><IconHeart /></div>
                            </div>
                            <span className="text-[0.95rem] text-[#858597] dark:text-gray-400 font-semibold mt-1">{t('admin.statRecommend')}</span>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-4 md:px-6 md:py-4 bg-white dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-gray-700 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none mb-6 flex-wrap">
                        <div className="flex items-center gap-1.5 text-[#1b0444] dark:text-gray-100 font-bold text-sm shrink-0">
                            <span className="flex items-center text-[#2994f9]"><IconFilter /></span>
                            <span>{t('admin.filterLabel')}</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-3 flex-1 flex-wrap">
                            <div className="relative flex items-center flex-1 w-full md:min-w-[160px] md:max-w-[240px]">
                                <span className="absolute right-3 flex items-center text-[#b0b0c8] pointer-events-none"><IconSearch /></span>
                                <input
                                    type="text"
                                    className="w-full py-2 pl-3 pr-10 border-[1.5px] border-[#e8e8f0] dark:border-gray-600 rounded-xl font-cairo text-[0.82rem] text-[#1b0444] dark:text-gray-100 bg-[#fafaff] dark:bg-gray-700 transition-all duration-200 outline-none focus:border-[#2994f9] focus:ring-[3px] focus:ring-[#2994f9]/10 placeholder:text-[#b0b0c8] dark:placeholder:text-gray-500"
                                    placeholder={t('admin.filterSearchPlaceholder')}
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                />
                            </div>
                            <select className="w-full md:w-auto min-w-[130px] py-2 px-3 border-[1.5px] border-[#e8e8f0] dark:border-gray-600 rounded-xl font-cairo text-[0.82rem] text-[#1b0444] dark:text-gray-100 bg-[#fafaff] dark:bg-gray-700 cursor-pointer transition-all duration-200 outline-none focus:border-[#2994f9] focus:ring-[3px] focus:ring-[#2994f9]/10" value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
                                <option value="">{t('admin.filterRatingAll')}</option>
                                <option value="5">{t('admin.filterRatingStars')[0]}</option>
                                <option value="4">{t('admin.filterRatingStars')[1]}</option>
                                <option value="3">{t('admin.filterRatingStars')[2]}</option>
                                <option value="2">{t('admin.filterRatingStars')[3]}</option>
                                <option value="1">{t('admin.filterRatingStars')[4]}</option>
                            </select>
                            <select className="w-full md:w-auto min-w-[130px] py-2 px-3 border-[1.5px] border-[#e8e8f0] dark:border-gray-600 rounded-xl font-cairo text-[0.82rem] text-[#1b0444] dark:text-gray-100 bg-[#fafaff] dark:bg-gray-700 cursor-pointer transition-all duration-200 outline-none focus:border-[#2994f9] focus:ring-[3px] focus:ring-[#2994f9]/10" value={filterRecommend} onChange={(e) => setFilterRecommend(e.target.value)}>
                                <option value="">{t('admin.filterRecommendAll')}</option>
                                <option value="بالتأكيد">{t('admin.filterRecommendOptions')[0]}</option>
                                <option value="ربما">{t('admin.filterRecommendOptions')[1]}</option>
                                <option value="لا">{t('admin.filterRecommendOptions')[2]}</option>
                            </select>
                            <select className="w-full md:w-auto min-w-[130px] py-2 px-3 border-[1.5px] border-[#e8e8f0] dark:border-gray-600 rounded-xl font-cairo text-[0.82rem] text-[#1b0444] dark:text-gray-100 bg-[#fafaff] dark:bg-gray-700 cursor-pointer transition-all duration-200 outline-none focus:border-[#2994f9] focus:ring-[3px] focus:ring-[#2994f9]/10" value={filterEase} onChange={(e) => setFilterEase(e.target.value)}>
                                <option value="">{t('admin.filterEaseAll')}</option>
                                <option value="سهل جداً">{t('admin.filterEaseOptions')[0]}</option>
                                <option value="سهل لحد ما">{t('admin.filterEaseOptions')[1]}</option>
                                <option value="محايد">{t('admin.filterEaseOptions')[2]}</option>
                                <option value="صعب">{t('admin.filterEaseOptions')[3]}</option>
                            </select>
                            {hasActiveFilters && (
                                <button className="py-[0.45rem] px-4 bg-[#fff5f5] border-[1.5px] border-[#fecaca] rounded-xl text-[#dc2626] font-cairo text-[0.8rem] font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-[#fee2e2] hover:border-[#f5a5a5]" onClick={clearFilters}>
                                    {t('admin.clearFilters')}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Toggle Charts Button */}
                    <div className="flex justify-start mb-6 w-full max-w-[500px]">
                        <button
                            onClick={() => setShowCharts(!showCharts)}
                            className="flex items-center gap-2 px-5 py-3 w-full bg-white dark:bg-gray-800 border border-[#e8eaf3] dark:border-gray-600 rounded-2xl shadow-sm text-[#4a4a68] dark:text-gray-300 font-cairo font-bold text-[0.95rem] hover:bg-[#f8f9fc] dark:hover:bg-gray-700 hover:border-[#2994f9]/50 hover:text-[#2994f9] transition-all duration-200"
                        >
                            <span className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center transition-colors duration-200 ${showCharts ? 'bg-[#2994f9]/10 text-[#2994f9]' : 'bg-[#f0f0f5] text-[#858597]'}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="20" x2="18" y2="10" />
                                    <line x1="12" y1="20" x2="12" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="14" />
                                </svg>
                            </span>
                            <span className="flex-1 text-right">
                                {showCharts ? t('admin.toggleChartsHide') : t('admin.toggleChartsShow')}
                            </span>
                            <svg className={`w-5 h-5 text-[#858597] transition-transform duration-300 ${showCharts ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                    </div>

                    {/* Collapsible Charts */}
                    <div className={`transition-all duration-500 origin-top overflow-hidden w-full ${showCharts ? 'opacity-100 max-h-[3000px] mb-6' : 'opacity-0 max-h-0 mb-0'}`}>
                        <FeedbackCharts feedbacks={feedbacks} />
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="flex items-center gap-2 py-4 px-5 bg-[#fff5f5] dark:bg-red-900/20 border border-[#fecaca] dark:border-red-700/50 rounded-xl text-[#b91c1c] dark:text-red-300 font-semibold mb-6">
                            <IconAlert /> {error}
                        </div>
                    )}

                    {/* Feedback Cards Grid */}
                    {filteredFeedbacks.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.05)] dark:shadow-none py-16 px-8 text-center flex flex-col items-center">
                            <div className="mb-4"><IconInbox /></div>
                            <h3 className="text-xl font-bold text-[#1b0444] dark:text-gray-100 mb-2">{hasActiveFilters ? t('admin.emptyFilterTitle') : t('admin.emptyFeedbackTitle')}</h3>
                            <p className="text-[#858597] dark:text-gray-400 text-[0.9rem]">
                                {hasActiveFilters ? t('admin.emptyFilterDesc') : t('admin.emptyFeedbackDesc')}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredFeedbacks.map((item) => (
                                <div key={item._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/5 dark:border-gray-700 flex flex-col transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2994f9] to-[#31d4ed] text-white flex items-center justify-center text-[1.2rem] font-extrabold shrink-0 border-2 border-white shadow-sm">
                                            {item.name?.charAt(0) || '؟'}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-extrabold text-[#1b0444] dark:text-gray-100 text-[1rem] truncate">{item.name}</span>
                                            <span className="text-[0.75rem] text-[#858597] dark:text-gray-400">{formatDate(item.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 mb-5 flex-grow">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[0.8rem] text-[#858597] dark:text-gray-400 font-bold">{t('admin.cardDesignLabel')}</span>
                                            {renderStars(item.websiteDesign)}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-[#ecfdf5] text-[#059669] text-[0.7rem] font-bold rounded-full border border-[#d1fae5]">{item.easeOfUse || 'سهل جداً'}</span>
                                            <span className="px-3 py-1 bg-[#eef4ff] text-[#2994f9] text-[0.7rem] font-bold rounded-full border border-[#dceaff]">{item.sessionQuality || 'ممتازة'}</span>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#e0e0e8]/60 rounded-full text-[0.72rem] font-bold text-[#059669] shadow-sm">
                                                <span>{getRecommendContent(item.recommendation).emoji}</span>
                                                <span>{getRecommendContent(item.recommendation).text}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[0.8rem] text-[#858597] dark:text-gray-400 font-bold">{t('admin.cardUsefulnessLabel')}</span>
                                            <p className="text-[0.85rem] font-bold text-[#1b0444] dark:text-gray-100 leading-relaxed bg-[#f8f9fc] dark:bg-gray-700 p-2.5 rounded-xl">
                                                "{item.usefulness || 'نعم، مفيد جداً'}"
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-[#f0f0f5] dark:border-gray-700">
                                        <span className="text-[0.8rem] text-[#858597] dark:text-gray-400 font-bold block mb-2">{t('admin.cardNotesLabel')}</span>
                                        <div className="bg-[#fff9f9]/50 dark:bg-gray-700/50 rounded-xl p-3 border border-[#fff0f0] dark:border-gray-600">
                                            <p className="text-[0.85rem] text-[#4a4a68] dark:text-gray-300 leading-relaxed italic line-clamp-4">
                                                {item.additionalComments ? `"${item.additionalComments}"` : t('admin.cardNoNotes')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>)}
            </main>
        </div>
    );
};

export default AdminDashboard;

function getPillClass(value) {
    if (!value) return '';
    if (value.includes('ممتاز') || value.includes('سهل جداً')) return 'bg-[#ecfdf5] text-[#059669]';
    if (value.includes('جيد') || value.includes('سهل لحد')) return 'bg-[#eef4ff] text-[#2994f9]';
    if (value.includes('محايد') || value.includes('مقبول')) return 'bg-[#fffbeb] text-[#b45309]';
    if (value.includes('صعب') || value.includes('سيئ')) return 'bg-[#fff5f5] text-[#dc2626]';
    return 'bg-[#eef4ff] text-[#2994f9]';
}

function getRecommendContent(value) {
    if (!value) return { class: 'bg-white border-[#e0e0e8] text-[#858597]', text: '—', emoji: '' };
    if (value.includes('بالتأكيد')) return { class: 'bg-[#ecfdf5] text-[#059669]', text: 'بالتأكيد', emoji: '🤩' };
    if (value.includes('ربما')) return { class: 'bg-[#fffbeb] text-[#b45309]', text: 'ربما', emoji: '🤔' };
    if (value.includes('لا')) return { class: 'bg-[#fff5f5] text-[#dc2626]', text: 'لا أعتقد', emoji: '😞' };
    return { class: 'bg-[#eef4ff] text-[#2994f9]', text: value, emoji: 'ℹ️' };
}
