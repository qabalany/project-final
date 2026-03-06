import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import OnboardingHeader from '../components/OnboardingHeader';

// Array of language options. Only 'arabic' is currently set to available: true.
// Other languages are disabled to indicate they are coming soon.
const languages = [
    { id: 'french', name: 'الفرنسية', nameEn: 'French', flag: 'https://flagcdn.com/w320/fr.png', available: false },
    { id: 'spanish', name: 'الإسبانية', nameEn: 'Spanish', flag: 'https://flagcdn.com/w320/es.png', available: false },
    { id: 'german', name: 'الألمانية', nameEn: 'German', flag: 'https://flagcdn.com/w320/de.png', available: false },
    { id: 'arabic', name: 'العربية', nameEn: 'Arabic', flag: 'https://flagcdn.com/w320/sa.png', available: true },
    { id: 'turkish', name: 'التركية', nameEn: 'Turkish', flag: 'https://flagcdn.com/w320/tr.png', available: false },
    { id: 'urdu', name: 'الأوردية', nameEn: 'Urdu', flag: 'https://flagcdn.com/w320/pk.png', available: false },
    { id: 'hindi', name: 'الهندية', nameEn: 'Hindi', flag: 'https://flagcdn.com/w320/in.png', available: false },
    { id: 'chinese', name: 'الصينية', nameEn: 'Chinese', flag: 'https://flagcdn.com/w320/cn.png', available: false },
];

const MotherTongue = () => {
    const [selected, setSelected] = useState('arabic');
    const navigate = useNavigate();
    const { t, lang: currentLang, dir } = useLanguage();

    const handleSelect = (lang) => {
        if (!lang.available) return;

        setSelected(lang.id);
        localStorage.setItem('onboarding_motherTongue', lang.id);

        setTimeout(() => {
            navigate('/second-language');
        }, 400);
    };

    return (
        <main className="w-full min-h-screen flex flex-col bg-white dark:bg-gray-900 font-cairo" dir={dir}>
            <OnboardingHeader />

            <section
                className="flex-1 flex items-center justify-center py-10 px-5 relative"
                aria-labelledby="screen-title"
            >
                <div className="flex flex-col items-center w-full max-w-[1144px] gap-[60px]">
                    <div className="text-center">
                        <h1
                            id="screen-title"
                            className="font-bold text-[32px] sm:text-[36px] md:text-[45px] lg:text-[53px] leading-[46px] sm:leading-[52px] md:leading-[65px] lg:leading-[76.8px] m-0"
                        >
                            <span className="text-white">{t('motherTongue.titlePart1')}</span>
                            <span className="bg-gradient-to-r from-[#31d4ed] to-[#2994f9] bg-clip-text text-transparent">{t('motherTongue.titleHighlight')}</span>
                            <span className="text-white">{t('motherTongue.titlePart2')}</span>
                        </h1>
                    </div>

                    {/* role="group" informs screen readers that these elements form one cohesive selection context */}
                    <div
                        className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 md:gap-8 lg:gap-12 w-full"
                        role="group"
                        aria-label={t('motherTongue.groupLabel')}
                    >
                        {languages.map((lang) => {
                            const isSelected = selected === lang.id;
                            const isDisabled = !lang.available;

                            return (
                                <button
                                    key={lang.id}
                                    type="button"
                                    onClick={() => handleSelect(lang)}
                                    aria-pressed={isSelected}
                                    disabled={isDisabled}
                                    aria-disabled={isDisabled}
                                    title={isDisabled ? `${currentLang === 'ar' ? lang.name : lang.nameEn} (${t('motherTongue.comingSoon')})` : `Select ${currentLang === 'ar' ? lang.name : lang.nameEn}`}
                                    className={`flex flex-col bg-white dark:bg-gray-800 rounded-[30px] overflow-hidden shadow-[0_8px_12px_#b8b8d233] dark:shadow-[0_8px_12px_rgba(0,0,0,0.3)] relative w-[calc(50%-10px)] min-w-[130px] sm:w-[calc(50%-12px)] sm:min-w-[140px] md:w-[220px] lg:w-[260px] transition-all duration-300 ease-in-out
                                        ${isSelected ? 'opacity-100 shadow-[0_8px_16px_rgba(41,148,249,0.25)] border-2 border-[rgba(41,148,249,0.4)]' : 'opacity-30 border-2 border-transparent'}
                                        ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_20px_#b8b8d266]'}`}
                                >
                                    <div className="w-full flex items-center justify-center overflow-hidden bg-[#f0f4ff] h-[100px] sm:h-[120px] md:h-[140px] lg:h-[164px]">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={lang.flag}
                                            alt={`${currentLang === 'ar' ? lang.name : lang.nameEn} flag`}
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 h-[60px] p-3 sm:h-[70px] sm:p-4 md:h-[90px] md:p-5 lg:h-[90px] lg:p-5 w-full">
                                        <div className="font-bold text-primary-text dark:text-gray-100 text-center text-[18px] sm:text-[20px] md:text-[25px]">
                                            {currentLang === 'ar' ? lang.name : lang.nameEn}
                                        </div>

                                        {isDisabled && (
                                            <span
                                                className="text-[11px] text-white bg-gradient-to-br from-[#858597] to-[#b8b8d2] px-[10px] py-[2px] rounded-[20px] font-medium leading-none whitespace-nowrap"
                                                aria-hidden="true"
                                            >
                                                {t('motherTongue.comingSoon')}
                                            </span>
                                        )}

                                        {isDisabled && (
                                            <span className="sr-only">Currently unavailable</span>
                                        )}
                                    </div>

                                    {isDisabled && (
                                        <div
                                            className="absolute inset-0 bg-white/55 flex items-center justify-center rounded-[30px] backdrop-blur-[1px]"
                                            aria-hidden="true"
                                        >
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" role="presentation">
                                                <rect x="5" y="11" width="14" height="11" rx="2" stroke="#858597" strokeWidth="1.5" />
                                                <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="#858597" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default MotherTongue;
