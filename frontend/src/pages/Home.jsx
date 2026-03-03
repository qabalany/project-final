import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import HeroBanner from '../components/HeroBanner';
import FeatureList from '../components/FeatureList';
import CourseCard from '../components/CourseCard';
import WeeklyChart from '../components/WeeklyChart';
import Leaderboard from '../components/Leaderboard';

const Home = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

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
