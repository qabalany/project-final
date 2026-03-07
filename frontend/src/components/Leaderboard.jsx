import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Leaderboard = ({ users }) => {
    const { t, dir } = useLanguage();
    return (
        <div className="flex flex-col w-full gap-4 p-4 sm:p-9 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-[slideUpFade_0.6s_ease-out_0.5s_both]" dir={dir}>
            {/* Header with Title and Actions */}
            <div className="flex justify-between items-center mb-2.5">
                <h2 className="font-cairo font-extrabold text-[#1b0444] dark:text-gray-100 text-[23px] leading-9">{t('home.leaderboardTitle')}</h2>
                <div className="flex items-center gap-2">
                    <button className="text-[#1ea7ff] text-[17px] font-medium font-cairo hover:opacity-80 transition-opacity">
                        {t('home.leaderboardMore')}
                    </button>
                    <button className="text-[#858597] dark:text-gray-400 text-2xl leading-none hover:text-[#232360] dark:hover:text-gray-100 font-bold" aria-label="خيارات إضافية">⋮</button>
                </div>
            </div>

            {/* Table Headers */}
            <div className="flex items-center justify-between w-full px-1 sm:px-3 py-2 text-gray-600 dark:text-gray-400 font-medium text-xs sm:text-sm font-cairo border-b border-[#f4f3fd] dark:border-gray-700">
                <span className="w-[100px] sm:w-[145px] text-right">{t('home.colName')}</span>
                <span className="w-[50px] sm:w-[64px] text-center">{t('home.colLevel')}</span>
                <span className="flex-1 text-center">{t('home.colPoints')}</span>
                <span className="flex-none font-semibold text-[#232360] dark:text-gray-200 text-sm sm:text-base">{t('home.colFriends')}</span>
            </div>

            {/* Rows */}
            {users.map((person, i) => (
                <div
                    key={i}
                    className={`flex items-center justify-between w-full px-1 sm:px-3 py-2 rounded-lg transition-colors hover:bg-[#f8f8ff] dark:hover:bg-gray-700 cursor-pointer animate-[slideUpFade_0.4s_ease-out_both]`}
                    style={{ animationDelay: `${500 + (i * 100)}ms` }}
                >
                    <div className="flex items-center gap-1.5 sm:gap-2.5 w-[100px] sm:w-[145px] font-cairo font-medium text-[#232360] dark:text-gray-100 text-sm sm:text-[17px] truncate">
                        <img className="w-[24px] h-[24px] sm:w-[30px] sm:h-[30px] rounded-full object-cover shrink-0" src={person.avatar} alt={person.name} />
                        <span className="truncate">{person.name}</span>
                    </div>
                    <span className="w-[50px] sm:w-[64px] text-center font-cairo font-medium text-gray-600 dark:text-gray-400 text-sm sm:text-base">{person.level}</span>
                    <span className="flex-1 text-center font-cairo font-medium text-gray-600 dark:text-gray-400 text-sm sm:text-base">{person.points}</span>
                    <div className="flex-none flex items-center justify-end font-cairo font-semibold text-[#232360] text-base">
                        <img src="https://c.animaapp.com/SW9wcD58/img/vector-4.svg" alt="Friends" className="w-1 h-[14px] sm:h-[18px]" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Leaderboard;
