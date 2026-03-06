import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';

/* ── Colour Palette ── */
const COLORS = {
    primary: '#2994f9',
    secondary: '#31d4ed',
    accent: '#6366f1',
    success: '#059669',
    warning: '#f59e0b',
    danger: '#dc2626',
    muted: '#858597',
    dark: '#1b0444',
};

const PIE_COLORS = ['#2994f9', '#31d4ed', '#f59e0b', '#dc2626', '#6366f1'];

// Custom tooltip shown when hovering over chart data points
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-black/5 font-cairo text-sm min-w-[120px]" dir="rtl">
            {label && <p className="font-bold text-[#1b0444] mb-2 m-0 border-b border-black/5 pb-1">{label}</p>}
            {payload.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 m-0 py-1">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.payload?.fill || entry.color || COLORS.primary }}></span>
                    <span className="font-bold text-[#4a4a68] text-[13px]">{entry.name}: <span style={{ color: entry.payload?.fill || entry.color || COLORS.primary }}>{entry.value}</span></span>
                </div>
            ))}
        </div>
    );
};

// Reusable section header with an icon and title
const SectionTitle = ({ icon, title }) => (
    <div className="flex items-center gap-2 mb-4">
        <span className="text-[#2994f9]">{icon}</span>
        <h3 className="text-base font-extrabold text-[#1b0444] font-cairo m-0">{title}</h3>
    </div>
);

/* ── Main FeedbackCharts Component ──
   Receives the full list of feedbacks and renders 4 charts:
   1) Rating distribution (bar chart)
   2) Submissions over time (area chart)
   3) Ease of use breakdown (pie chart)
   4) Recommendation split (donut chart)
*/
const FeedbackCharts = ({ feedbacks = [] }) => {
    const { t } = useLanguage();

    // Count how many ratings each star level received
    const ratingData = useMemo(() => {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        feedbacks.forEach(f => {
            const r = f.websiteDesign;
            if (r >= 1 && r <= 5) counts[r]++;
        });
        return [
            { name: '1 ★', count: counts[1], fill: '#dc2626' },
            { name: '2 ★', count: counts[2], fill: '#f59e0b' },
            { name: '3 ★', count: counts[3], fill: '#eab308' },
            { name: '4 ★', count: counts[4], fill: '#31d4ed' },
            { name: '5 ★', count: counts[5], fill: '#059669' },
        ];
    }, [feedbacks]);

    // Group feedback submissions by calendar day for the timeline chart
    const timelineData = useMemo(() => {
        const grouped = {};
        feedbacks.forEach(f => {
            const day = new Date(f.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            grouped[day] = (grouped[day] || 0) + 1;
        });
        const sorted = feedbacks
            .map(f => ({ date: new Date(f.createdAt), f }))
            .sort((a, b) => a.date - b.date);

        const seen = new Set();
        const result = [];
        sorted.forEach(({ date }) => {
            const day = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            if (!seen.has(day)) {
                seen.add(day);
                result.push({ name: day, count: grouped[day] });
            }
        });
        return result;
    }, [feedbacks]);

    // Count responses per ease-of-use category
    const easeData = useMemo(() => {
        const counts = {};
        feedbacks.forEach(f => {
            const val = f.easeOfUse || 'غير محدد';
            counts[val] = (counts[val] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [feedbacks]);

    // Count how many users would recommend the platform
    const recommendData = useMemo(() => {
        const counts = {};
        feedbacks.forEach(f => {
            let val = 'غير محدد';
            if (f.recommendation?.includes('بالتأكيد')) val = 'بالتأكيد';
            else if (f.recommendation?.includes('ربما')) val = 'ربما';
            else if (f.recommendation?.includes('لا')) val = 'لا أعتقد';
            counts[val] = (counts[val] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [feedbacks]);

    // Don't render charts if there's no data yet
    if (feedbacks.length === 0) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6" dir="rtl">

            {/* ── Rating Distribution Bar Chart ── */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)]">
                <SectionTitle
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" /></svg>}
                    title={t('analytics.chartRatings')}
                />
                <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                        <BarChart data={ratingData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }} barSize={30}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f5" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontFamily: 'Cairo', fill: COLORS.muted }} />
                            <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 12, fill: COLORS.muted }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="count" name={t('analytics.seriesCount')} radius={[6, 6, 0, 0]} animationDuration={800}>
                                {ratingData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Feedback Timeline Area Chart ── */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)]">
                <SectionTitle
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
                    title={t('analytics.chartFeedbackTimeline')}
                />
                <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                        <AreaChart data={timelineData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <defs>
                                <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.4} />
                                    <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f5" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontFamily: 'Cairo', fill: COLORS.muted }} />
                            <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 12, fill: COLORS.muted }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="count"
                                name={t('analytics.seriesRatings')}
                                stroke={COLORS.primary}
                                strokeWidth={3}
                                fill="url(#gradientArea)"
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Ease of Use Pie Chart ── */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)]">
                <SectionTitle
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 10 10" /><path d="M12 12L12 2" /><path d="M12 12L22 12" /></svg>}
                    title={t('analytics.chartEaseOfUse')}
                />
                <div style={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={easeData}
                                cx="50%"
                                cy="45%"
                                outerRadius={75}
                                innerRadius={45}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                                animationDuration={800}
                            >
                                {easeData.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                formatter={(value) => <span className="font-cairo text-[13px] font-bold text-[#1b0444]" style={{ marginRight: '8px', marginLeft: '8px' }}>{value}</span>}
                                wrapperStyle={{ paddingBottom: '10px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Recommendation Donut Chart ── */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)]">
                <SectionTitle
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>}
                    title={t('analytics.chartRecommendation')}
                />
                <div style={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={recommendData}
                                cx="50%"
                                cy="45%"
                                outerRadius={75}
                                innerRadius={0}
                                dataKey="value"
                                stroke="none"
                                animationDuration={800}
                            >
                                {recommendData.map((_, i) => (
                                    <Cell key={i} fill={[COLORS.success, COLORS.warning, COLORS.danger, COLORS.muted][i % 4]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                formatter={(value) => <span className="font-cairo text-[13px] font-bold text-[#1b0444]" style={{ marginRight: '8px', marginLeft: '8px' }}>{value}</span>}
                                wrapperStyle={{ paddingBottom: '10px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default FeedbackCharts;
