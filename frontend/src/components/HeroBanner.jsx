import React from 'react';

const HeroBanner = ({ userName, avatarUrl }) => {
    return (
        <div className="relative w-full h-[220px] lg:h-[312px] bg-[#1a0f35] rounded-xl overflow-hidden shadow-sm animate-[slideUpFade_0.4s_ease-out]">
            {/* CSS Shapes to mimic the original SVG background pattern */}

            {/* Top-left Blue Circle Shape */}
            <div className="absolute top-[-40%] left-[-15%] w-[60%] lg:w-[45%] h-[150%] lg:h-[180%] bg-[#2994f9] rounded-[50%] opacity-90 pointer-events-none"></div>

            {/* Bottom-left Cyan Circle Shape */}
            <div className="absolute bottom-[-60%] left-[-5%] w-[70%] lg:w-[50%] aspect-square bg-[#1dd3f8] rounded-full opacity-90 pointer-events-none"></div>

            {/* User Avatar Section */}
            <div className="absolute top-[20px] left-[20px] lg:top-[40px] lg:left-[40px] z-20">
                {avatarUrl ? (
                    <div className="w-[70px] h-[70px] lg:w-[100px] lg:h-[100px] rounded-full overflow-hidden bg-gradient-to-b from-[#6D52F1] to-[#1b0444] border-2 border-white/20 shadow-lg flex items-end justify-center">
                        <img
                            src={avatarUrl}
                            alt="User Avatar"
                            className="w-[90%] h-[90%] object-cover object-top"
                        />
                    </div>
                ) : (
                    // Default placeholder if avatar is not provided
                    <div className="w-[70px] h-[70px] lg:w-[100px] lg:h-[100px] rounded-full overflow-hidden bg-gradient-to-b from-[#6D52F1] to-[#1b0444] border-2 border-white/20 shadow-lg flex items-center justify-center">
                        <svg className="w-1/2 h-1/2 text-white/50" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Text Content (Bottom Right) */}
            <div className="absolute bottom-[20px] right-[20px] lg:bottom-[40px] lg:right-[40px] flex flex-col gap-1 lg:gap-3 items-end z-10 animate-[slideUpFade_0.6s_ease-out] max-w-[80%] pointer-events-none">
                <span className="text-white/90 text-sm lg:text-2xl font-light font-cairo select-none">
                    لنبدأ التعلم
                </span>
                <h1 className="text-white text-2xl md:text-3xl lg:text-[56px] font-bold font-cairo leading-tight lg:leading-none select-none drop-shadow-md text-right break-words mt-2">
                    اهلا <span className="block sm:inline">{userName}</span>
                </h1>
            </div>
        </div>
    );
};

export default HeroBanner;
