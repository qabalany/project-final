import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { login as loginService } from '../api/auth.service';
import HeroBanner from '../components/HeroBanner';
import FeatureList from '../components/FeatureList';
import CourseCard from '../components/CourseCard';
import WeeklyChart from '../components/WeeklyChart';
import Leaderboard from '../components/Leaderboard';

const DEMO_EMAIL = 'test@logah.mvp';

const Home = () => {
    const { user, login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const isDemoUser = user?.email === DEMO_EMAIL;

    const handleDashboardDemo = async () => {
        try {
            const userData = await loginService({ email: 'admin@logah.ai', password: 'AdminLogah2030!' });
            login(userData);
            navigate('/admin/dashboard');
        } catch {
            navigate('/admin/dashboard');
        }
    };

    const getAvatarSrc = () => {
        const avatarSelection = user?.selectedAvatar || localStorage.getItem('onboarding_avatar');
        if (avatarSelection === 'ula' || avatarSelection === 'katya') return '/assets/katya_no_bg.png';
        if (avatarSelection === 'tuwaiq' || avatarSelection === 'kebtagon') return '/assets/kebtagon_no_bg_precise.png';
        return user?.selectedAvatar || '/favicon.svg';
    };

    const userName = user?.name || (t('heroBanner.greeting') === 'Welcome' ? 'User' : 'مستخدم');
    const avatarUrl = getAvatarSrc();

    const featureCards = t('home.features');

    const courseCards = t('home.courses').map((c, i) => ({
        ...c,
        completed: [4, 2, 6][i],
        total: [16, 12, 20][i],
    }));

    const leaderboard = [
        { ...t('home.leaderboard')[0], avatar: 'https://c.animaapp.com/SW9wcD58/img/frame-1000004162.svg' },
        { ...t('home.leaderboard')[1], avatar: 'https://c.animaapp.com/SW9wcD58/img/frame-1000004162-1.svg' },
        { ...t('home.leaderboard')[2], avatar: 'https://c.animaapp.com/SW9wcD58/img/frame-1000004162-2.svg' },
        { ...t('home.leaderboard')[3], avatar: 'https://c.animaapp.com/SW9wcD58/img/frame-1000004162-3.svg' },
    ];

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1118px] mx-auto pb-10">
            <HeroBanner userName={userName} avatarUrl={avatarUrl} />
            {isDemoUser && (
                <button
                    onClick={handleDashboardDemo}
                    className="w-full flex items-center justify-between px-6 py-4 rounded-2xl border border-[#7c3aed]/30 dark:border-[#7c3aed]/40 bg-gradient-to-r from-[#7c3aed]/5 to-[#a855f7]/5 dark:from-[#7c3aed]/10 dark:to-[#a855f7]/10 group hover:from-[#7c3aed]/10 hover:to-[#a855f7]/15 hover:border-[#7c3aed]/60 transition-all duration-300 cursor-pointer text-left"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/10 dark:bg-[#7c3aed]/20 flex items-center justify-center shrink-0 group-hover:bg-[#7c3aed]/20 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                            </svg>
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-bold text-[#7c3aed] dark:text-purple-400 text-[15px] leading-tight">{t('home.dashboardDemoBtn')}</span>
                            <span className="text-[13px] text-gray-600 dark:text-gray-400">{t('home.dashboardDemoDesc')}</span>
                        </div>
                    </div>
                    <svg className="text-[#7c3aed]/50 group-hover:text-[#7c3aed] group-hover:translate-x-1 transition-all duration-200" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </button>
            )}
            <FeatureList cards={featureCards} />
            <div className="flex flex-col xl:flex-row flex-wrap gap-6 w-full items-stretch">
                {courseCards.map((course, i) => (
                    <CourseCard key={i} course={course} index={i} />
                ))}
                <WeeklyChart />
            </div>
            <Leaderboard users={leaderboard} />
        </div>
    );
};

export default Home;
