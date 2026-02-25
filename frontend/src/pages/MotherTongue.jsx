import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import useAuth for potential future access to global user data
import { useAuth } from '../context/AuthContext';
// Import accessible OnboardingHeader component
import OnboardingHeader from '../components/OnboardingHeader';

// Array of language options. Only 'arabic' is currently set to available: true.
// Other languages are disabled to indicate they are coming soon.
const languages = [
    { id: 'french', name: 'الفرنسية', flag: 'https://flagcdn.com/w320/fr.png', available: false },
    { id: 'spanish', name: 'الإسبانية', flag: 'https://flagcdn.com/w320/es.png', available: false },
    { id: 'german', name: 'الألمانية', flag: 'https://flagcdn.com/w320/de.png', available: false },
    { id: 'arabic', name: 'العربية', flag: 'https://flagcdn.com/w320/sa.png', available: true },
    { id: 'turkish', name: 'التركية', flag: 'https://flagcdn.com/w320/tr.png', available: false },
    { id: 'urdu', name: 'الأوردية', flag: 'https://flagcdn.com/w320/pk.png', available: false },
    { id: 'hindi', name: 'الهندية', flag: 'https://flagcdn.com/w320/in.png', available: false },
    { id: 'chinese', name: 'الصينية', flag: 'https://flagcdn.com/w320/cn.png', available: false },
];

const MotherTongue = () => {
    // Default selection is 'arabic' to streamline onboarding for primary demographic
    const [selected, setSelected] = useState('arabic');

    // useNavigate hook enables programmatic push to the next screen
    const navigate = useNavigate();
    const { completeOnboarding } = useAuth();

    // Triggered upon clicking a language card
    const handleSelect = (lang) => {
        // Exit early if the language is not available
        if (!lang.available) return;

        setSelected(lang.id);

        // Save choice to localStorage for temporary persistence across onboarding screens
        // This avoids unnecessary database writes until completion
        localStorage.setItem('onboarding_motherTongue', lang.id);

        // Timeout of 400ms allows the active state animation to render before navigation
        setTimeout(() => {
            navigate('/second-language');
        }, 400);
    };

    return (
        // The <main> landmark signals the primary content area to screen readers
        <main className="w-full min-h-screen flex flex-col bg-white font-cairo" dir="rtl">
            <OnboardingHeader />

            {/* The <section> groups the language selection area.
                aria-labelledby points to the h1 ID so assistive tech reads the section meaning contextually */}
            <section
                className="flex-1 flex items-center justify-center py-10 px-5 relative"
                aria-labelledby="screen-title"
            >
                <div className="flex flex-col items-center w-full max-w-[1144px] gap-[60px]">
                    <div className="text-center">
                        {/* <h1> is used because every page should have one main heading for logical document structure */}
                        <h1
                            id="screen-title"
                            className="font-bold text-[32px] sm:text-[36px] md:text-[45px] lg:text-[53px] leading-[46px] sm:leading-[52px] md:leading-[65px] lg:leading-[76.8px] m-0"
                        >
                            <span className="text-primary-text">ما هي</span>
                            <span className="bg-gradient-to-r from-[#31d4ed] to-[#2994f9] bg-clip-text text-transparent"> لغتك </span>
                            <span className="text-primary-text">الأم</span>
                        </h1>
                    </div>

                    {/* role="group" informs screen readers that these distinct elements form one cohesive selection context */}
                    <div
                        className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 md:gap-8 lg:gap-12 w-full"
                        role="group"
                        aria-label="Select your mother tongue"
                    >
                        {languages.map((lang) => {
                            const isSelected = selected === lang.id;
                            const isDisabled = !lang.available;

                            return (
                                /* Native <button> elements are naturally keyboard-focusable (Tab key support).
                                   Avoid using onClick handlers on generic <div> elements for interactive UI. */
                                <button
                                    key={lang.id}
                                    type="button"
                                    onClick={() => handleSelect(lang)}
                                    // aria-pressed indicates to assistive tech if the current item is selected
                                    aria-pressed={isSelected}
                                    // disabled and aria-disabled ensure full deactivation for screen readers
                                    disabled={isDisabled}
                                    aria-disabled={isDisabled}
                                    title={isDisabled ? `${lang.name} (Coming soon)` : `Select ${lang.name}`}
                                    className={`flex flex-col bg-white rounded-[30px] overflow-hidden shadow-[0_8px_12px_#b8b8d233] relative w-[calc(50%-10px)] min-w-[130px] sm:w-[calc(50%-12px)] sm:min-w-[140px] md:w-[220px] lg:w-[260px] transition-all duration-300 ease-in-out
                                        ${isSelected ? 'opacity-100 shadow-[0_8px_16px_rgba(41,148,249,0.25)] border-2 border-[rgba(41,148,249,0.4)]' : 'opacity-30 border-2 border-transparent'}
                                        ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_20px_#b8b8d266]'}`}
                                >
                                    <div className="w-full flex items-center justify-center overflow-hidden bg-[#f0f4ff] h-[100px] sm:h-[120px] md:h-[140px] lg:h-[164px]">
                                        {/* aria-hidden="true" tells screen readers to ignore purely decorative images */}
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
                                            /* Visually displayed text that is hidden from screen readers using aria-hidden */
                                            <span
                                                className="text-[11px] text-white bg-gradient-to-br from-[#858597] to-[#b8b8d2] px-[10px] py-[2px] rounded-[20px] font-medium leading-none whitespace-nowrap"
                                                aria-hidden="true"
                                            >
                                                قريباً
                                            </span>
                                        )}

                                        {isDisabled && (
                                            /* Screen-reader-only text (.sr-only) to explicitly announce the disabled state */
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
