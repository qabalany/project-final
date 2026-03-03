import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
                    setError('ليس لديك صلاحية لعرض هذه البيانات');
                } else {
                    setError('حدث خطأ أثناء جلب البيانات');
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

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('ar-SA', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen font-cairo text-[#858597] gap-4" dir="rtl">
                <div className="w-10 h-10 border-[3px] border-[#f0f0f5] border-t-[#2994f9] rounded-full animate-spin"></div>
                <p>جاري تحميل البيانات...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0f2f8] via-[#e8eaf3] to-[#f4f3fd] font-cairo" dir="rtl">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 p-4 md:px-8 bg-white border-b border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sticky top-0 z-[100]">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80" onClick={() => navigate('/')}>
                        <img src="/favicon.svg" alt="Logah" className="w-8 h-8" />
                        <span className="font-extrabold text-[#1b0444] text-xl tracking-tight">Logah</span>
                    </div>
                    <div className="hidden md:block w-px h-7 bg-[#e0e0e8]"></div>
                    <h1 className="text-lg font-bold text-[#1b0444] m-0">
                        {activeTab === 'feedback' ? 'لوحة تحكم التقييمات' : activeTab === 'sessions' ? 'تحليلات الجلسات' : 'الشكاوى والاقتراحات'}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-[#fff7e6] to-[#fff3db] border border-[#fce4a8] rounded-full text-sm font-semibold text-[#7a5e2a]">
                        <span className="flex items-center"><IconShield /></span>
                        <span>{user?.name || 'المسؤول'}</span>
                    </div>
                    <button
                        className="flex items-center gap-1.5 px-4 md:px-5 py-2 bg-transparent border-[1.5px] border-[#e0e0e8] rounded-xl text-[#858597] font-cairo text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-[#fff0f0] hover:border-[#f5a5a5] hover:text-[#d94444]"
                        onClick={handleLogout}
                    >
                        <IconLogout />
                        <span>تسجيل خروج</span>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8">
                {/* Tab Navigation */}
                <div className="flex items-center gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/5 w-fit">
                    <button
                        className={`px-5 py-2.5 rounded-xl font-cairo text-sm font-bold transition-all duration-200 ${activeTab === 'feedback'
                            ? 'bg-gradient-to-r from-[#2994f9] to-[#31d4ed] text-white shadow-md'
                            : 'text-[#858597] hover:bg-[#f4f3fd] hover:text-[#1b0444]'
                            }`}
                        onClick={() => setActiveTab('feedback')}
                    >
                        <span className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                            التقييمات
                        </span>
                    </button>
                    <button
                        className={`px-5 py-2.5 rounded-xl font-cairo text-sm font-bold transition-all duration-200 ${activeTab === 'sessions'
                            ? 'bg-gradient-to-r from-[#2994f9] to-[#31d4ed] text-white shadow-md'
                            : 'text-[#858597] hover:bg-[#f4f3fd] hover:text-[#1b0444]'
                            }`}
                        onClick={() => setActiveTab('sessions')}
                    >
                        <span className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                            الجلسات
                        </span>
                    </button>
                    <button
                        className={`px-5 py-2.5 rounded-xl font-cairo text-sm font-bold transition-all duration-200 ${activeTab === 'app-feedback'
                            ? 'bg-gradient-to-r from-[#2994f9] to-[#31d4ed] text-white shadow-md'
                            : 'text-[#858597] hover:bg-[#f4f3fd] hover:text-[#1b0444]'
                            }`}
                        onClick={() => setActiveTab('app-feedback')}
                    >
                        <span className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                            الرسائل
                        </span>
                    </button>
                </div>

                {/* Sessions Tab */}
                {activeTab === 'sessions' && <SessionAnalytics />}

                {/* App Feedback (Messages) Tab */}
                {activeTab === 'app-feedback' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {appFeedbacks.length === 0 ? (
                            <div className="col-span-full bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.05)] py-16 px-8 text-center flex flex-col items-center">
                                <div className="mb-4"><IconInbox /></div>
                                <h3 className="text-xl font-bold text-[#1b0444] mb-2">لا توجد رسائل بعد</h3>
                                <p className="text-[#858597] text-[0.9rem]">ستظهر الشكاوى والاقتراحات هنا فور إرسالها من المستخدمين.</p>
                            </div>
                        ) : (
                            appFeedbacks.map((item) => (
                                <div key={item._id} className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2994f9] to-[#31d4ed] text-white flex items-center justify-center text-[1.2rem] font-extrabold shrink-0 border-2 border-white shadow-sm">
                                            {item.name?.charAt(0) || '؟'}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-extrabold text-[#1b0444] text-[1rem] truncate">{item.name}</span>
                                            <span className="text-[0.75rem] text-[#858597]">{formatDate(item.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="bg-[#f8f9fc] rounded-xl p-4 border border-[#e8eaf3] flex-grow">
                                        <p className="text-[0.9rem] text-[#1b0444] leading-relaxed break-words whitespace-pre-wrap m-0">
                                            {item.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Feedback Tab — content added in next commit */}
                {activeTab === 'feedback' && (
                    <div>{/* stats, filters, charts, and cards coming in commit 54 */}</div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
