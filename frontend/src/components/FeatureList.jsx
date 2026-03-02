import React from 'react';

const FeatureList = ({ cards }) => {
    return (
        <div className="flex w-full items-start gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-gray-200">
            {cards.map((card, i) => (
                <div
                    key={i}
                    className={`flex flex-col min-w-[280px] sm:min-w-[388px] h-[180px] sm:h-[219px] items-start justify-center gap-2 lg:gap-2.5 p-4 sm:p-6 rounded-xl cursor-pointer 
                    bg-gradient-to-tr from-[#31d4ed] to-[#2994f9] shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg
                    animate-[slideUpFade_0.4s_ease-out_both]`}
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <h3 className="w-full max-w-[261px] font-cairo font-extrabold text-[#ffffff] text-lg sm:text-[23px] leading-tight sm:leading-9 text-right line-clamp-2">
                        {card.title}
                    </h3>
                    <p className="w-full max-w-[298px] font-cairo font-normal text-[#ffffff] text-sm sm:text-[17px] leading-normal sm:leading-[25px] text-right line-clamp-3 opacity-90">
                        {card.desc}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default FeatureList;
