import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Import accessible OnboardingHeader component
import OnboardingHeader from '../components/OnboardingHeader';

// Array of language options. Only 'english' is currently set to available: true.
// Other languages are disabled to indicate they are coming soon.
const languages = [
    { id: 'french', name: 'الفرنسية', flag: 'https://flagcdn.com/w320/fr.png', available: false },
    { id: 'spanish', name: 'الإسبانية', flag: 'https://flagcdn.com/w320/es.png', available: false },
    { id: 'german', name: 'الألمانية', flag: 'https://flagcdn.com/w320/de.png', available: false },
    { id: 'english', name: 'الإنجليزية', flag: 'https://flagcdn.com/w320/gb.png', available: true },
    { id: 'turkish', name: 'التركية', flag: 'https://flagcdn.com/w320/tr.png', available: false },
    { id: 'japanese', name: 'اليابانية', flag: 'https://flagcdn.com/w320/jp.png', available: false },
    { id: 'korean', name: 'الكورية', flag: 'https://flagcdn.com/w320/kr.png', available: false },
    { id: 'chinese', name: 'الصينية', flag: 'https://flagcdn.com/w320/cn.png', available: false },
];

const SecondLanguage = () => {
    // Default selection is 'english' corresponding to the primary available course
    const [selected, setSelected] = useState('english');
    const navigate = useNavigate();
    const { completeOnboarding } = useAuth();

    // Triggered upon clicking a language card
    const handleSelect = (lang) => {
        // Exit early if the language is not available
        if (!lang.available) return;

        setSelected(lang.id);

        // Save target language choice to localStorage for temporary persistence across onboarding screens
        localStorage.setItem('onboarding_targetLanguage', lang.id);

        // Timeout of 400ms allows the active state animation to render before navigation
        setTimeout(() => {
            navigate('/avatar');
        }, 400);
    };

    return (
        // The <main> landmark signals the primary content area to screen readers
        <main className="w-full min-h-screen flex flex-col bg-white font-cairo" dir="rtl">
            <OnboardingHeader />

            {/* The <section> groups the target language selection area.
                aria-labelledby links the section to the h1 for contextual screen reader announcements */}
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
                            <span className="text-primary-text">ماذا تريد ان</span>
                            <span className="bg-gradient-to-r from-[#31d4ed] to-[#2994f9] bg-clip-text text-transparent"> تتعلم</span>
                        </h1>
                    </div>

                    {/* role="group" informs screen readers that these distinct interactive elements represent a cohesive selection set */}
                    <div
                        className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 md:gap-8 lg:gap-12 w-full"
                        role="group"
                        aria-label="Select your target language"
                    >
                        {languages.map((lang) => {
                            const isSelected = selected === lang.id;
                            const isDisabled = !lang.available;

                            return (
                                /* Native <button> elements are inherently keyboard-focusable via the Tab key.
                                   Replacing generic <div> elements with <button> tags drastically improves accessibility. */
                                <button
                                    key={lang.id}
                                    type="button"
                                    onClick={() => handleSelect(lang)}
                                    // aria-pressed explicitly declares the active selection state to assistive technology
                                    aria-pressed={isSelected}
                                    // The disabled attribute prevents focus/clicks, while aria-disabled conveys the state to screen readers
                                    disabled={isDisabled}
                                    aria-disabled={isDisabled}
                                    title={isDisabled ? `${lang.name} (Coming soon)` : `Select ${lang.name}`}
                                    className={`flex flex-col bg-white rounded-[30px] overflow-hidden shadow-[0_8px_12px_#b8b8d233] relative w-[calc(50%-10px)] min-w-[130px] sm:w-[calc(50%-12px)] sm:min-w-[140px] md:w-[220px] lg:w-[260px] transition-all duration-300 ease-in-out
                                        ${isSelected ? 'opacity-100 shadow-[0_8px_16px_rgba(41,148,249,0.25)] border-2 border-[rgba(41,148,249,0.4)]' : 'opacity-30 border-2 border-transparent'}
                                        ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_20px_#b8b8d266]'}`}
                                >
                                    <div className="w-full flex items-center justify-center overflow-hidden bg-[#f0f4ff] h-[100px] sm:h-[120px] md:h-[140px] lg:h-[164px]">
                                        {/* aria-hidden="true" instructs screen readers to ignore decorative and redundant images */}
                                        <img
                                            className="w-full h-full object-cover"
                                            src={lang.flag}
                                            alt={`${lang.name} flag`}
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center gap-2 bg-white h-[60px] p-3 sm:h-[70px] sm:p-4 md:h-[90px] md:p-5 lg:h-[90px] lg:p-5 w-full">
                                        <div className="font-bold text-primary-text text-center text-[18px] sm:text-[20px] md:text-[25px]">
                                            {lang.name}
                                        </div>

                                        {isDisabled && (
                                            /* Visually displayed "Coming soon" text that is hidden from screen readers to prevent duplicate announcements */
                                            <span
                                                className="text-[11px] text-white bg-gradient-to-br from-[#858597] to-[#b8b8d2] px-[10px] py-[2px] rounded-[20px] font-medium leading-none whitespace-nowrap"
                                                aria-hidden="true"
                                            >
                                                قريباً
                                            </span>
                                        )}

                                        {isDisabled && (
                                            /* Screen-reader-only text (.sr-only) ensuring assistive technology announces the item is unavailable */
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

export default SecondLanguage;
