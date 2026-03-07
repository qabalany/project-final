import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Settings = () => {
    const { user } = useAuth();
    const { t, dir } = useLanguage();
    const [name, setName] = useState(user?.name || 'الحساب التجريبي');
    const [email, setEmail] = useState(user?.email || 'test@logah.mvp');
    const [profession, setProfession] = useState(user?.profession || '');
    const [motherTongue, setMotherTongue] = useState(user?.motherTongue || 'arabic');
    const [targetLanguage, setTargetLanguage] = useState(user?.targetLanguage || 'english');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.selectedAvatar || 'tuwaiq');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            alert(t('settings.savedMsg'));
        }, 1000);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-[900px] mx-auto pb-10 px-4 sm:px-6 md:px-8 mt-10" dir={dir}>

            {/* Header Area */}
            <div className="flex items-center justify-between w-full mb-2">
                <h1 className="text-[1.8rem] font-bold text-[#1b0444] dark:text-gray-100 tracking-wide font-sans m-0">{t('settings.title')}</h1>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#1567c4] text-white py-2.5 px-6 rounded-xl flex items-center gap-2 font-bold text-sm shadow-[0_4px_12px_rgba(21,103,196,0.3)] hover:shadow-[0_6px_16px_rgba(21,103,196,0.4)] hover:-translate-y-[1px] transition-all duration-200 disabled:opacity-70 disabled:transform-none"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    <span>{t('common.save')}</span>
                </button>
            </div>

            <form className="w-full flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>

                {/* Profile Section */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-[#f4f5f9] dark:border-gray-700 flex flex-col gap-6">
                    <div className="flex items-center justify-end gap-2 mb-2">
                        <h2 className="text-[17px] font-bold text-[#1b0444] dark:text-gray-100 m-0">{t('settings.profileSection')}</h2>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2994f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                        {/* Note: In RTL grid, col 1 is visually right, col 2 is left.
                            Screenshot shows Email on LEFT, Name on RIGHT. 
                            So Name goes first in the DOM, Email second. */}
                        <div className="flex flex-col gap-2.5">
                            <label className="text-gray-600 dark:text-gray-400 font-semibold text-[13px] text-right" htmlFor="settings-name">{t('settings.nameLabel')}</label>
                            <input
                                id="settings-name"
                                type="text"
                                className="w-full p-4 border border-[#e5e7eb]/80 dark:border-gray-600 rounded-2xl text-[14px] outline-none transition-all focus:border-[#31D4ED] bg-[#fafbfc] dark:bg-gray-700 text-[#1b0444] dark:text-gray-100 text-right font-medium"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <label className="text-gray-600 dark:text-gray-400 font-semibold text-[13px] text-right" htmlFor="settings-email">{t('settings.emailLabel')}</label>
                            <input
                                id="settings-email"
                                type="email"
                                className="w-full p-4 border border-[#e5e7eb]/80 dark:border-gray-600 rounded-2xl text-[14px] outline-none transition-all focus:border-[#31D4ED] bg-[#fafbfc] dark:bg-gray-700 text-[#858597] dark:text-gray-400 text-right font-medium opacity-80"
                                value={email}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5 mt-1">
                        <label className="text-gray-600 dark:text-gray-400 font-semibold text-[13px] text-right" htmlFor="settings-profession">{t('settings.professionLabel')}</label>
                        <input
                            id="settings-profession"
                            type="text"
                            className="w-full p-4 border border-[#e5e7eb]/80 dark:border-gray-600 rounded-2xl text-[14px] outline-none transition-all focus:border-[#31D4ED] bg-[#fafbfc] dark:bg-gray-700 text-[#1b0444] dark:text-gray-100 text-right font-medium"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                        />
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-[#f4f5f9] dark:border-gray-700 flex flex-col gap-6">
                    <div className="flex items-center justify-end gap-2 mb-2">
                        <h2 className="text-[17px] font-bold text-[#1b0444] dark:text-gray-100 m-0">{t('settings.prefsSection')}</h2>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2994f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Right Column: Mother Tongue */}
                        <div className="w-full p-5 border border-[#e5e7eb]/80 dark:border-gray-600 rounded-2xl flex items-center justify-between bg-[#fafbfc] dark:bg-gray-700">
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-gray-600 dark:text-gray-400 text-[13px] font-semibold">{t('settings.motherTongueLabel')}</span>
                                <span className="text-[#1b0444] dark:text-gray-100 font-extrabold text-[15px]">{motherTongue}</span>
                            </div>
                            <div className="bg-[#eff6ff] text-[#2994f9] p-2.5 rounded-full">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            </div>
                        </div>

                        {/* Left Column: Target Language */}
                        <div className="w-full p-5 border border-[#e5e7eb]/80 dark:border-gray-600 rounded-2xl flex items-center justify-between bg-[#fafbfc] dark:bg-gray-700">
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-gray-600 dark:text-gray-400 text-[13px] font-semibold">{t('settings.targetLangLabel')}</span>
                                <span className="text-[#1b0444] dark:text-gray-100 font-extrabold text-[15px]">{targetLanguage}</span>
                            </div>
                            <div className="bg-[#f5f3ff] text-[#5442f5] p-2.5 rounded-full">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Avatar Section */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-[#f4f5f9] dark:border-gray-700 flex flex-col gap-6">
                    <div className="flex items-center justify-end gap-2 mb-2">
                        <h2 className="text-[17px] font-bold text-[#1b0444] dark:text-gray-100 m-0">{t('settings.avatarSection')}</h2>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2994f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <button
                            onClick={() => setSelectedAvatar('ula')}
                            aria-pressed={selectedAvatar === 'ula'}
                            className={`w-full p-8 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 ${selectedAvatar === 'ula' ? 'border-[2px] border-[#5442f5] shadow-[0_4px_20px_rgba(84,66,245,0.08)] bg-white dark:bg-gray-700' : 'border border-[#e5e7eb]/80 dark:border-gray-600 bg-[#fafbfc] dark:bg-gray-700/50 hover:border-[#d0c4eb] hover:bg-white dark:hover:bg-gray-700'}`}
                        >
                            <div className="relative">
                                <img src="/assets/katya_no_bg.png" alt="Ula" className="w-[90px] h-[90px] rounded-full object-cover bg-gradient-to-b from-[#2e1d75] to-[#4531a8] shadow-inner" />
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                <span className="font-extrabold text-[#1b0444] dark:text-gray-100 text-[19px]">Ula</span>
                                <span className="text-gray-600 dark:text-gray-400 text-[13.5px] font-medium">{t('settings.ulaAccent')}</span>
                            </div>

                            {/* Toggled Checkmark state */}
                            <div className={`flex items-center gap-1.5 text-sm font-bold mt-1 transition-opacity duration-300 ${selectedAvatar === 'ula' ? 'text-[#5442f5] opacity-100' : 'opacity-0'}`}>
                                {t('common.selected')}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                        </button>

                        <button
                            onClick={() => setSelectedAvatar('tuwaiq')}
                            aria-pressed={selectedAvatar === 'tuwaiq'}
                            className={`w-full p-8 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 ${selectedAvatar === 'tuwaiq' ? 'border-[2px] border-[#5442f5] shadow-[0_4px_20px_rgba(84,66,245,0.08)] bg-white dark:bg-gray-700' : 'border border-[#e5e7eb]/80 dark:border-gray-600 bg-[#fafbfc] dark:bg-gray-700/50 hover:border-[#d0c4eb] hover:bg-white dark:hover:bg-gray-700'}`}
                        >
                            <div className="relative">
                                <img src="/assets/kebtagon_no_bg_precise.png" alt="Tuwaiq" className="w-[90px] h-[90px] rounded-full object-cover bg-gradient-to-b from-[#2e1d75] to-[#4531a8] shadow-inner" />
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                <span className="font-extrabold text-[#1b0444] dark:text-gray-100 text-[19px]">Tuwaiq</span>
                                <span className="text-gray-600 dark:text-gray-400 text-[13.5px] font-medium">{t('settings.tuwaiqAccent')}</span>
                            </div>

                            {/* Toggled Checkmark state */}
                            <div className={`flex items-center gap-1.5 text-sm font-bold mt-1 transition-opacity duration-300 ${selectedAvatar === 'tuwaiq' ? 'text-[#5442f5] opacity-100' : 'opacity-0'}`}>
                                {t('common.selected')}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Settings;
