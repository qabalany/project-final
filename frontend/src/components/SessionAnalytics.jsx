import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

/* ── Colours ── */
const COLORS = {
    primary: '#2994f9',
    secondary: '#31d4ed',
    accent: '#6366f1',
    success: '#059669',
    warning: '#f59e0b',
    danger: '#dc2626',
    muted: '#4b5563',
    dark: '#1b0444',
};
// Colors for each avatar type
const AVATAR_COLORS = { ula: '#2994f9', tuwaiq: '#6366f1' };
// Colors for each CEFR language proficiency level
const CEFR_COLORS = { A1: '#dc2626', A2: '#f59e0b', B1: '#31d4ed', B2: '#2994f9', C1: '#6366f1', C2: '#059669' };

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg border border-black/5 dark:border-gray-700 font-cairo text-sm" dir="rtl">
            <p className="font-bold text-[#1b0444] mb-1">{label}</p>
            {payload.map((entry, i) => (
                <p key={i} style={{ color: entry.color || COLORS.primary }} className="font-semibold">
                    {entry.name}: {entry.value}
                </p>
            ))}
        </div>
    );
};

/* ── SVG Icons ── */
const IconSessions = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
);

const IconClock = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconUsers = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const IconLevel = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

/* ── Stat Card ── */
const StatCard = ({ icon, value, label, color }) => (
    <div className="flex flex-col items-center justify-center p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 border border-black/5 dark:border-gray-700">
        <div className="flex items-center gap-8 mb-2">
            <span className="text-[2rem] font-extrabold text-[#1b0444] dark:text-gray-100 leading-none">{value}</span>
            <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center shrink-0`} style={{ backgroundColor: color + '18', color }}>
                {icon}
            </div>
        </div>
        <span className="text-[0.9rem] text-gray-600 dark:text-gray-400 font-semibold mt-1">{label}</span>
    </div>
);

/* ── Main SessionAnalytics Component ──
   Fetches analytics data from the backend and renders:
   - 4 summary stat cards (total sessions, minutes, users, avg duration)
   - Sessions timeline line chart
   - CEFR distribution bar chart
   - Avatar usage pie chart
   - User activity table
*/
const SessionAnalytics = () => {
    const { t } = useLanguage();
    const [summary, setSummary] = useState(null);
    const [userActivity, setUserActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [errorStatus, setErrorStatus] = useState(null);

    // Fetch both the summary stats and the per-user activity table
    const fetchData = React.useCallback(async () => {
        setLoading(true);
        setError('');
        setErrorStatus(null);
        try {
            const [summaryRes, activityRes] = await Promise.all([
                api.get('/analytics/summary'),
                api.get('/analytics/user-activity'),
            ]);
            setSummary(summaryRes.data.data);
            setUserActivity(activityRes.data.data || []);
        } catch (err) {
            const status = err?.response?.status;
            setErrorStatus(status);
            if (status === 401 || status === 403) {
                setError('انتهت صلاحية الجلسة — يرجى تسجيل الخروج وإعادة الدخول.');
            } else {
                setError(`حدث خطأ أثناء جلب بيانات التحليلات (${status || 'network error'})`);
            }
            console.error('Analytics fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Convert raw sessions-per-day API data into chart-friendly format
    const timelineData = useMemo(() => {
        if (!summary?.sessionsPerDay) return [];
        return summary.sessionsPerDay.map(d => {
            const date = new Date(d.date);
            return {
                name: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                count: d.count,
            };
        });
    }, [summary]);

    // Map CEFR levels to chart data with their level-specific color
    const cefrData = useMemo(() => {
        if (!summary?.cefrDistribution) return [];
        const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        return levels.map(level => {
            const found = summary.cefrDistribution.find(d => d.level === level);
            return { name: level, count: found?.count || 0, fill: CEFR_COLORS[level] };
        });
    }, [summary]);

    // Convert avatar usage stats to pie chart format, merging duplicates by normalised key
    const avatarData = useMemo(() => {
        if (!summary?.avatarUsage) return [];
        const merged = {};
        summary.avatarUsage.forEach(d => {
            const key = String(d.avatar).toLowerCase().includes('tuwaiq') ? 'tuwaiq' : 'ula';
            merged[key] = (merged[key] || 0) + d.count;
        });
        return Object.entries(merged).map(([key, count]) => ({
            name: key === 'ula' ? 'Ula (American)' : 'Tuwaiq (British)',
            value: count,
        }));
    }, [summary]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-[3px] border-[#f0f0f5] border-t-[#2994f9] rounded-full animate-spin"></div>
                <p className="text-gray-600 font-cairo">{t('analytics.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-4 font-cairo" dir="rtl">
                <div className="flex flex-col items-center gap-3 py-6 px-8 bg-[#fff5f5] border border-[#fecaca] rounded-2xl text-center max-w-md">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    <p className="text-[#b91c1c] font-bold text-base">{error}</p>
                    {(errorStatus === 401 || errorStatus === 403) ? (
                        <button
                            onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; }}
                            className="mt-1 px-5 py-2 rounded-xl bg-[#dc2626] text-white font-bold text-sm hover:bg-[#b91c1c] transition"
                        >
                            تسجيل خروج وإعادة الدخول
                        </button>
                    ) : (
                        <button
                            onClick={fetchData}
                            className="mt-1 px-5 py-2 rounded-xl bg-[#1567c4] text-white font-bold text-sm hover:bg-[#1057b0] transition"
                        >
                            إعادة المحاولة
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Format a duration in seconds as e.g. "1h 4m 30s", "4m 30s", or "45s"
    const formatDuration = (seconds) => {
        if (!seconds && seconds !== 0) return '—';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.round(seconds % 60);
        if (h > 0) return `${h}h ${m}m ${s}s`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    // If no summary data came back (e.g. no sessions yet), show nothing
    if (!summary) return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center text-gray-600 dark:text-gray-400 font-cairo shadow-sm border border-black/5 dark:border-gray-700">
            {t('analytics.noData')}
        </div>
    );

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={<IconSessions />} value={summary.totalSessions} label={t('analytics.statTotalSessions')} color={COLORS.primary} />
                <StatCard icon={<IconClock />} value={`${summary.totalMinutes} ${t('analytics.minuteUnit')}`} label={t('analytics.statTotalMinutes')} color={COLORS.secondary} />
                <StatCard icon={<IconUsers />} value={summary.totalUniqueUsers} label={t('analytics.statUsers')} color={COLORS.accent} />
                <StatCard icon={<IconLevel />} value={formatDuration(summary.avgDurationSeconds)} label={t('analytics.statAvgDuration')} color={COLORS.success} />
            </div>

            {/* ── Charts Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Sessions Timeline */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/5 dark:border-gray-700">
                    <h3 className="text-base font-extrabold text-[#1b0444] dark:text-gray-100 font-cairo mb-4 flex items-center gap-2">
                        <span className="text-[#2994f9]"><IconLevel /></span>
                        {t('analytics.chartTimeline')}
                    </h3>
                    {timelineData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={timelineData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Cairo', fill: COLORS.muted }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: COLORS.muted }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="count" name={t('analytics.seriesSessions')} stroke={COLORS.primary} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.primary }} animationDuration={1000} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-600 py-10">{t('analytics.noData')}</p>
                    )}
                </div>

                {/* CEFR Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/5 dark:border-gray-700">
                    <h3 className="text-base font-extrabold text-[#1b0444] dark:text-gray-100 font-cairo mb-4 flex items-center gap-2">
                        <span className="text-[#6366f1]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" /></svg>
                        </span>
                        {t('analytics.chartCefr')}
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={cefrData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                            <XAxis dataKey="name" tick={{ fontSize: 13, fontFamily: 'Cairo', fill: COLORS.muted }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: COLORS.muted }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" name={t('analytics.seriesUsers')} radius={[8, 8, 0, 0]} animationDuration={800}>
                                {cefrData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Avatar Usage Pie */}
                {avatarData.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/5 dark:border-gray-700">
                        <h3 className="text-base font-extrabold text-[#1b0444] dark:text-gray-100 font-cairo mb-4 flex items-center gap-2">
                            <span className="text-[#31d4ed]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                            </span>
                            {t('analytics.chartAvatarUsage')}
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={avatarData} cx="50%" cy="50%" outerRadius={75} innerRadius={40} paddingAngle={4} dataKey="value" animationDuration={800}>
                                    {avatarData.map((_, i) => (
                                        <Cell key={i} fill={Object.values(AVATAR_COLORS)[i % 2]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend formatter={(value) => <span className="font-cairo text-sm font-semibold text-[#1b0444] dark:text-gray-100">{value}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* ── User Activity Table ── */}
            {userActivity.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/5 dark:border-gray-700 overflow-x-auto">
                    <h3 className="text-base font-extrabold text-[#1b0444] dark:text-gray-100 font-cairo mb-4 flex items-center gap-2">
                        <span className="text-[#059669]"><IconUsers /></span>
                        {t('analytics.chartUserActivity')}
                    </h3>
                    <table className="w-full text-sm font-cairo">
                        <thead>
                            <tr className="border-b border-[#f0f0f5] dark:border-gray-700">
                                <th className="py-3 px-3 text-right font-bold text-gray-600 dark:text-gray-400">{t('analytics.colUser')}</th>
                                <th className="py-3 px-3 text-center font-bold text-gray-600 dark:text-gray-400">{t('analytics.colSessions')}</th>
                                <th className="py-3 px-3 text-center font-bold text-gray-600 dark:text-gray-400">{t('analytics.colMinutes')}</th>
                                <th className="py-3 px-3 text-center font-bold text-gray-600 dark:text-gray-400">{t('analytics.colLevel')}</th>
                                <th className="py-3 px-3 text-center font-bold text-gray-600 dark:text-gray-400">{t('analytics.colAvatar')}</th>
                                <th className="py-3 px-3 text-center font-bold text-gray-600 dark:text-gray-400">{t('analytics.colLastSession')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userActivity.map((user, i) => (
                                <tr key={i} className="border-b border-[#f8f8fb] dark:border-gray-700 hover:bg-[#fafaff] dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="py-3 px-3 font-bold text-[#1b0444] dark:text-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1567c4] to-[#0d6ed1] text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                                                {user.userName?.charAt(0) || '؟'}
                                            </div>
                                            {user.userName}
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-center font-semibold text-[#1b0444] dark:text-gray-100">{user.totalSessions}</td>
                                    <td className="py-3 px-3 text-center font-semibold text-[#1b0444] dark:text-gray-100">{user.totalMinutes} {t('analytics.minuteUnit')}</td>
                                    <td className="py-3 px-3 text-center">
                                        {user.latestLevel ? (
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: CEFR_COLORS[user.latestLevel] || COLORS.muted }}>
                                                {user.latestLevel}
                                            </span>
                                        ) : (
                                            <span className="text-[#b0b0c8]">—</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: (AVATAR_COLORS[user.favoriteAvatar] || COLORS.primary) + '18', color: AVATAR_COLORS[user.favoriteAvatar] || COLORS.primary }}>
                                            {user.favoriteAvatar === 'tuwaiq' ? 'Tuwaiq' : 'Ula'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-center text-gray-600 text-xs">{user.lastSession ? formatDate(user.lastSession) : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SessionAnalytics;
