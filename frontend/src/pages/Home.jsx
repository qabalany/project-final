import React from 'react';
import { useAuth } from '../context/AuthContext';
import HeroBanner from '../components/HeroBanner';
import FeatureList from '../components/FeatureList';
import CourseCard from '../components/CourseCard';
import WeeklyChart from '../components/WeeklyChart';
import Leaderboard from '../components/Leaderboard';

const Home = () => {
    const { user } = useAuth();

    const getAvatarSrc = () => {
        const avatarSelection = user?.selectedAvatar || localStorage.getItem('onboarding_avatar');
        if (avatarSelection === 'ula' || avatarSelection === 'katya') return '/assets/katya_no_bg.png';
        if (avatarSelection === 'tuwaiq' || avatarSelection === 'kebtagon') return '/assets/kebtagon_no_bg_precise.png';
        return user?.selectedAvatar || '/favicon.svg';
    };

    const userName = user?.name || 'مستخدم';
    const avatarUrl = getAvatarSrc();

    const featureCards = [
        { title: 'تحدث أمام جمهور مدعوم بالذكاء الاصطناعي', desc: 'قدّم واعرِض أفكارك أمام جمهورنا المدعوم بالذكاء الاصطناعي.' },
        { title: 'تعلّم المحادثة اليومية', desc: 'تدرّب على محادثات واقعية لتتحدث بثقة في حياتك اليومية.' },
        { title: 'اختبارات تفاعلية ذكية', desc: 'اختبر مستواك مع تقييمات مخصصة تتكيف مع تقدمك.' },
    ];

    const courseCards = [
        { title: 'اساسيات اللغة', completed: 4, total: 16 },
        { title: 'المحادثة المتقدمة', completed: 2, total: 12 },
        { title: 'كتابة الأعمال', completed: 6, total: 20 },
    ];

    const leaderboard = [
        { name: 'هدي المفتي', level: 'B2', points: '1,000,000', avatar: 'https://c.animaapp.com/SW9wcD58/img/frame-1000004162.svg' },
        { name: 'سارة أحمد', level: 'B1', points: '850,000', avatar: 'https://c.animaapp.com/SW9wcD58/img/frame-1000004162-1.svg' },
        { name: 'محمد علي', level: 'A2', points: '720,000', avatar: 'https://c.animaapp.com/SW9wcD58/img/frame-1000004162-2.svg' },
        { name: 'نورة سعيد', level: 'B2', points: '680,000', avatar: 'https://c.animaapp.com/SW9wcD58/img/frame-1000004162-3.svg' },
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
