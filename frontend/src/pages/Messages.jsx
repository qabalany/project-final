import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Messages = () => {
    const { t, dir } = useLanguage();
    return (
        <div className="flex-1 p-8 font-cairo" dir={dir}>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-[#1b0444] mb-1">{t('messages.title')}</h1>
                <p className="text-[#858597] text-sm">{t('messages.subtitle')}</p>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-[#f4f3fd] flex items-center justify-center mb-5">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#b0b0c3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-[#1b0444] mb-2">{t('messages.emptyTitle')}</h3>
                <p className="text-[#858597] text-sm max-w-xs">{t('messages.emptyDesc')}</p>
            </div>
        </div>
    );
};

export default Messages;
