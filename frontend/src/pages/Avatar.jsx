import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingHeader from '../components/OnboardingHeader';
import { useLanguage } from '../context/LanguageContext';

const avatars = [
    {
        id: 'ula',
        name: 'عُلا',
        img: '/assets/katya_no_bg.png',
        flagIcon: 'https://c.animaapp.com/CqYhItr3/img/vector-1.svg',
    },
    {
        id: 'tuwaiq',
        name: 'طويق',
        img: '/assets/kebtagon_no_bg_precise.png',
        flagIcon: 'https://c.animaapp.com/CqYhItr3/img/vector-1.svg',
    },
];

const Avatar = () => {
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();
    const { t, dir } = useLanguage();

    const handleSelect = (id) => {
        setSelected(id);
        // Save selected avatar to localStorage for Personalised page
        localStorage.setItem('onboarding_avatar', id);
        setTimeout(() => {
            navigate('/personalised');
        }, 500);
    };

    return (
        <main className="w-full min-h-screen flex flex-col bg-white dark:bg-gray-900 font-sans" dir={dir}>
            <OnboardingHeader currentStep={3} totalSteps={4} />

            <section aria-labelledby="avatar-heading" className="flex-1 flex items-center justify-center py-10 px-5 relative">
                <div className="w-full max-w-[781px] flex flex-col gap-10 md:gap-[60px] lg:gap-[97px]">
                    <div className="text-center">
                        <h1 id="avatar-heading" className="font-bold text-[28px] leading-[40px] md:text-[36px] md:leading-[52px] lg:text-[53px] lg:leading-[76.8px] m-0">
                            <span className="text-[#1b0444] dark:text-gray-100">{t('avatar.titlePart1')} </span>
                            <span className="bg-gradient-to-r from-[#31d4ed] to-[#2994f9] bg-clip-text text-transparent">{t('avatar.titleHighlight')}</span>
                        </h1>
                    </div>

                    {/* Accessibility Note: Use radiogroup for a list of exclusive selectable items */}
                    <div
                        className="flex flex-col sm:flex-row items-center justify-center gap-[30px] md:gap-[40px] lg:gap-[69px] w-full"
                        role="radiogroup"
                        aria-labelledby="avatar-heading"
                    >
                        {avatars.map((avatar) => {
                            const isSelected = selected === avatar.id;
                            return (
                                <button
                                    type="button"
                                    key={avatar.id}
                                    role="radio"
                                    aria-checked={isSelected}
                                    className={`relative w-full max-w-[356px] h-[420px] sm:h-[472px] bg-gradient-to-br from-[#2994f9] to-[#31d4ed] rounded-[30px] overflow-hidden shadow-[0_12px_30px_rgba(41,148,249,0.15)] border border-gray-100/50 cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(41,148,249,0.25)] active:-translate-y-1 block outline-none focus-visible:ring-4 focus-visible:ring-[#1b0444] focus-visible:ring-offset-4 ${isSelected ? 'ring-4 ring-[#2994f9] ring-offset-4' : ''}`}
                                    onClick={() => handleSelect(avatar.id)}
                                >
                                    <span className="sr-only">
                                        {isSelected ? t('avatar.srSelected') : t('avatar.srSelect')} {t('avatar.srPersonality')} {avatar.name}، {t(`avatar.${avatar.id}.accent`)}. {t(`avatar.${avatar.id}.desc`)}
                                    </span>

                                    <img
                                        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[339px] h-auto max-h-[72%] object-cover transition-transform duration-300 ${avatar.id === 'ula' ? 'translate-y-[15px] sm:translate-y-[20px] scale-105' : ''}`}
                                        src={avatar.img}
                                        alt=""
                                        aria-hidden="true"
                                    />

                                    <div className="absolute inset-x-0 bottom-0 h-[32%] flex flex-col justify-center bg-white rounded-[30px] border-t-2 border-[#f3f4f8] shadow-[0_-8px_20px_rgba(0,0,0,0.06)] z-10" aria-hidden="true" style={{ padding: '24px 32px' }}>
                                        <div className="flex flex-col items-stretch justify-center gap-2 sm:gap-3 w-full">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="font-bold text-[#1b0444] text-[20px] sm:text-[23px] text-right shrink-0">{avatar.name}</div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <span className="font-normal text-gray-600 text-[12px]">{t(`avatar.${avatar.id}.accent`)}</span>
                                                    <img src={avatar.flagIcon} alt="" className="w-3 h-[9px]" />
                                                </div>
                                            </div>
                                            <p className="font-normal text-gray-600 text-[13px] leading-[18.2px] text-right m-0 whitespace-pre-line w-full">{t(`avatar.${avatar.id}.desc`)}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Avatar;
