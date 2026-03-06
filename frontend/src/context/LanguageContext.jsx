import React, { createContext, useState, useEffect, useContext } from 'react';
import translations from '../i18n/translations';

export const LanguageContext = createContext();

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
    return ctx;
};

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        const stored = localStorage.getItem('lang');
        if (stored) return stored;
        // Follow system/browser language if it's Arabic; otherwise default to English
        const systemLang = navigator.language || '';
        if (systemLang.startsWith('ar')) return 'ar';
        return 'en';
    });

    const toggle = () => setLang(prev => (prev === 'ar' ? 'en' : 'ar'));

    // Sync document direction and lang attribute whenever language changes
    useEffect(() => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('lang', lang);
    }, [lang]);

    /** t('sidebar.home') → string */
    const t = (keyPath) => {
        const keys = keyPath.split('.');
        let val = translations[lang];
        for (const k of keys) val = val?.[k];
        // Fallback to Arabic if English key missing
        if (val === undefined) {
            let fallback = translations['ar'];
            for (const k of keys) fallback = fallback?.[k];
            return fallback ?? keyPath;
        }
        return val;
    };

    const isRTL = lang === 'ar';
    const dir = isRTL ? 'rtl' : 'ltr';

    return (
        <LanguageContext.Provider value={{ lang, toggle, t, isRTL, dir }}>
            {children}
        </LanguageContext.Provider>
    );
};
