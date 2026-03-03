import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const CourseCard = ({ course, index }) => {
    const { t } = useLanguage();
    return (
        <div
            className="flex-1 min-w-[200px] h-[267px] flex flex-col items-center justify-between p-6 bg-white rounded-xl shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-[slideUpFade_0.4s_ease-out_both]"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <h3 className="font-cairo font-bold text-[#1b0444] text-base">{course.title}</h3>

            <div className="relative w-[120px] h-[120px]">
                <svg viewBox="0 0 120 120" className="w-full h-full rotate-[-90deg]">
                    <circle
                        cx="60" cy="60" r="52"
                        stroke="#f4f3fd" strokeWidth="8" fill="none"
                    />
                    <circle
                        cx="60" cy="60" r="52"
                        stroke="url(#grad)" strokeWidth="8" fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(course.completed / course.total) * 327} 327`}
                        className="animate-[fillRing_1.5s_cubic-bezier(0.19,1,0.22,1)_0.5s_both]"
                    />
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#31d4ed" />
                            <stop offset="100%" stopColor="#2994f9" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                    <span className="font-cairo font-bold text-[#1b0444] text-lg">{course.completed} {t('home.courseCompletedLabel')}</span>
                    <span className="font-cairo font-normal text-[#858597] text-xs">/{course.total} {t('home.courseTotalLabel')}</span>
                </div>
            </div>

            <div className="flex items-center gap-7">
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[#31d4ed] to-[#2994f9]"></span>
                    <span className="font-cairo font-light text-[#858597] text-[13px]">{t('home.courseCompletedLegend')}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#f4f3fd]"></span>
                    <span className="font-cairo font-light text-[#858597] text-[13px]">{t('home.courseUnitLegend')}</span>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
