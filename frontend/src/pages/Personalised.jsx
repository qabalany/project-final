import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingHeader from '../components/OnboardingHeader';
import { useLanguage } from '../context/LanguageContext';

const avatarData = {
    ula: {
        id: 'ula',
        name: 'عُلا',
        img: '/assets/katya_no_bg.png',
        speech: 'مرحباً، أنا عُلا! لكي أصمم لك مساراً يليق بطموحك، أخبرني ما هو مجال عملك أو تخصصك الدقيق؟',
    },
    tuwaiq: {
        id: 'tuwaiq',
        name: 'طويق',
        img: '/assets/kebtagon_no_bg_precise.png',
        speech: 'مرحباً، أنا طويق! لكي أصمم لك مساراً يليق بطموحك، أخبرني ما هو مجال عملك أو تخصصك الدقيق؟',
    },
};

const Personalised = () => {
    const [profession, setProfession] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const navigate = useNavigate();
    const maxChars = 200;
    const { t, dir } = useLanguage();

    useEffect(() => {
        // Read selected avatar from localStorage, default to tuwaiq
        const avatarId = localStorage.getItem('onboarding_avatar');
        if (avatarId && avatarData[avatarId]) {
            setSelectedAvatar(avatarData[avatarId]);
        } else {
            setSelectedAvatar(avatarData.tuwaiq);
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.value.length <= maxChars) {
            setProfession(e.target.value);
        }
    };

    const handleSubmit = () => {
        if (profession.trim()) {
            localStorage.setItem('onboarding_profession', profession.trim());
            // Proceed to the next step, historically avatar-session
            navigate('/avatar-session', { state: { isOnboarding: true } });
        }
    };

    if (!selectedAvatar) return null;

    return (
        <main className="w-full min-h-screen flex flex-col bg-white dark:bg-gray-900 font-sans" dir={dir}>
            <OnboardingHeader currentStep={4} totalSteps={4} />

            <section aria-labelledby="personalised-heading" className="flex-1 flex items-center justify-center py-10 px-5 relative">
                <div className="flex flex-col items-center w-full max-w-[1178px] gap-[30px] md:gap-[50px] lg:gap-[97px]">
                    <div className="text-center">
                        <h1 id="personalised-heading" className="font-bold text-[32px] leading-[46px] md:text-[38px] md:leading-[55px] lg:text-[53px] lg:leading-[76.8px] m-0">
                            <span className="bg-gradient-to-r from-[#31d4ed] to-[#2994f9] bg-clip-text text-transparent">{t('personalised.titleHighlight')} </span>
                            <span className="text-[#1b0444] dark:text-gray-100">{t('personalised.titlePart2')}</span>
                        </h1>
                    </div>

                    <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-[30px] lg:gap-[69px] w-full">
                        {/* Text Area Section */}
                        <div className="flex flex-col w-full lg:w-[753px] max-w-[600px] lg:max-w-full gap-[10px] flex-1">
                            <div className="flex flex-col flex-1 min-h-[300px] md:min-h-[350px] lg:min-h-[400px] bg-[#f9fafb] dark:bg-gray-800 rounded-[20px] lg:rounded-[30px] border border-[#f3f4f8] dark:border-gray-700 shadow-inner focus-within:border-[#2994f9] focus-within:ring-4 focus-within:ring-[#2994f9]/20 transition-all duration-300 overflow-hidden" style={{ padding: '30px' }}>
                                <label htmlFor="professionInput" className="sr-only">مجال عملك أو تخصصك الدقيق</label>
                                <textarea
                                    className="w-full h-full min-h-[300px] font-sans font-medium text-[#1b0444] dark:text-gray-100 text-[18px] leading-[30px] bg-transparent border-none outline-none resize-none px-2 py-1 placeholder-[#b8b8d2] dark:placeholder-gray-500"
                                    id="professionInput"
                                    value={profession}
                                    onChange={handleChange}
                                    placeholder={t('personalised.placeholder')}
                                    maxLength={maxChars}
                                    aria-describedby="char-count"
                                />
                            </div>
                            <div className="flex justify-start px-2">
                                <span id="char-count" className="font-medium text-[#858597] dark:text-gray-400 text-[14px]">{profession.length} / {maxChars} {t('personalised.charCount')}</span>
                            </div>
                            <button
                                type="button"
                                className={`w-full h-14 flex items-center justify-center rounded-[14px] mt-[10px] transition-all duration-300 ${!profession.trim()
                                    ? 'bg-[#f3f4f8] text-[#b8b8d2] cursor-not-allowed'
                                    : 'bg-gradient-to-br from-[#2994f9] to-[#31d4ed] text-white shadow-[0_8px_20px_rgba(41,148,249,0.25)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(41,148,249,0.35)] active:translate-y-0 cursor-pointer'
                                    } outline-none focus-visible:ring-4 focus-visible:ring-[#1b0444] focus-visible:ring-offset-2`}
                                onClick={handleSubmit}
                                disabled={!profession.trim()}
                                aria-disabled={!profession.trim()}
                            >
                                <span className="font-bold text-[18px]">{t('personalised.continueBtn')}</span>
                            </button>
                        </div>

                        {/* Avatar 3D Card Preview */}
                        <div
                            className="relative w-full max-w-[356px] h-[400px] sm:h-[472px] bg-gradient-to-br from-[#2994f9] to-[#31d4ed] rounded-[30px] overflow-hidden shadow-[0_12px_30px_rgba(41,148,249,0.15)] border border-gray-100/50 flex-shrink-0"
                            aria-hidden="true"
                        >
                            <img
                                className={`absolute top-0 left-1/2 -translate-x-1/2 w-[339px] h-auto max-h-[72%] object-cover ${selectedAvatar.id === 'ula' ? 'translate-y-[15px] sm:translate-y-[20px] scale-105' : ''}`}
                                src={selectedAvatar.img}
                                alt=""
                            />

                            {/* Replicating the exact deep shadow and spacing of the Avatar Selection screen */}
                            <div className="absolute inset-x-0 bottom-0 h-[35%] flex flex-col justify-center bg-white rounded-[30px] border-t-2 border-[#f3f4f8] shadow-[0_-8px_20px_rgba(0,0,0,0.06)] z-10" style={{ padding: '24px 32px' }}>
                                <p className="font-medium text-[#1b0444] text-[15px] sm:text-[17px] leading-[26px] text-center m-0">
                                    {t(`personalised.${selectedAvatar.id}Speech`)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Personalised;
