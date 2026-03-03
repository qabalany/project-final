import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const WeeklyChart = () => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col w-full xl:flex-1 xl:min-w-[320px] xl:max-w-[482px] h-[267px] items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-[slideUpFade_0.4s_ease-out_both] delay-300">
            <div className="w-full font-cairo font-bold text-[#1b0444] dark:text-gray-100 text-base text-right mb-2">
                {t('home.weeklyChartTitle')}
            </div>

            {/* Chart Container */}
            <div className="relative w-full h-full flex items-end px-2.5">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-full h-[1px] bg-[#f4f3fd]"></div>
                    ))}
                </div>

                {/* Bars */}
                <div className="relative z-10 w-full h-[85%] flex justify-between items-end">
                    {[40, 65, 35, 85, 55, 70, 45].map((height, i) => (
                        <div key={i} className="h-full w-[12%] flex items-end justify-center group">
                            <div
                                className="w-full bg-gradient-to-b from-[#31d4ed] to-[#2994f9] rounded-t-lg min-h-[4px] opacity-100
                                transition-all duration-300 group-hover:scale-x-110 group-hover:brightness-110 animate-[slideUpFade_0.5s_ease-out_both]"
                                style={{
                                    height: `${height}%`,
                                    animationDelay: `${i * 100}ms`
                                }}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeeklyChart;
