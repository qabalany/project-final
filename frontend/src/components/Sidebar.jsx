import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activePage, isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { id: 'home', path: '/', label: 'الصفحة الرئيسية', icon: 'home-1-fill.svg', activeIcon: 'home-white.svg' },
        { id: 'path', path: '/path', label: 'المسار', icon: 'subtract.svg' },
        { id: 'messages', path: '/messages', label: 'الرسائل', icon: 'message-1-fill.svg' },
        { id: 'account', path: '/account', label: 'الحساب', icon: 'user-2-fill.svg' },
        { id: 'app-feedback', path: '/app-feedback', label: 'ارسال شكوى/اقتراح', icon: 'message-1-fill.svg' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (window.innerWidth < 1024 && onClose) onClose();
    };

    return (
        <>
            {/* Mobile Overlay Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed lg:static top-0 right-0 h-full
                    w-[274px] bg-white lg:rounded-l-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] 
                    flex flex-col pt-10 pb-0 transition-transform duration-300 z-50 overflow-y-auto lg:overflow-visible shrink-0
                    ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Close Button (Mobile Only) */}
                <button
                    onClick={onClose}
                    className="lg:hidden absolute top-4 left-4 p-2 text-[#858597] hover:text-[#232360] transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Logo */}
                <div className="flex flex-col items-center justify-center gap-1 mb-10 w-full cursor-pointer transition-opacity hover:opacity-80" onClick={() => navigate('/')}>
                    <div className="flex items-center gap-2">
                        <img src="/favicon.svg" alt="Logah Icon" className="w-[30px] h-[30px]" aria-hidden="true" />
                        <span className="font-bold text-[24px] text-[#1b0444]">Logah</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col flex-1 gap-4 px-5 pb-10 h-full w-full justify-between">
                    <div className="flex flex-col gap-4">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.path)}
                                className={`flex items-center justify-start gap-3.5 w-full h-[52px] px-[22px] rounded-xl border-none cursor-pointer font-cairo font-semibold text-base transition-colors duration-200
                            ${activePage === item.id
                                        ? 'bg-[#2994f9] text-white shadow-sm'
                                        : 'bg-transparent text-[#858597] hover:bg-[#f4f3fd] hover:text-[#2994f9]'}`}
                            >
                                <img
                                    src={`https://c.animaapp.com/SW9wcD58/img/${item.icon}`}
                                    alt=""
                                    className={`w-[22px] h-[22px] transition-all duration-200 ${activePage === item.id ? 'brightness-0 invert' : 'grayscale opacity-50 contrast-125 hover:grayscale-0 hover:opacity-100'}`}
                                />
                                <span className="whitespace-nowrap">{item.label}</span>
                            </button>
                        ))}

                        {/* CTA: Start Session Banner */}
                        <div className="relative mt-2 rounded-[24px] bg-gradient-to-br from-[#2994f9] to-[#31d4ed] p-5 overflow-hidden shadow-[0_8px_24px_rgba(41,148,249,0.25)] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(41,148,249,0.35)] hover:-translate-y-0.5 group">
                            {/* Decorative background shapes */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-y-10 -translate-x-10 pointer-events-none"></div>

                            {/* Avatar Image (Hidden partially) */}
                            <img
                                src="/ola.png"
                                alt="AI Avatar"
                                className="absolute -bottom-2 -left-3 w-[110px] h-[110px] object-contain opacity-90 drop-shadow-xl z-0 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                                onError={(e) => e.target.style.display = 'none'}
                            />

                            <div className="relative z-10 flex flex-col gap-1.5 mb-4 pl-[70px]">
                                <h3 className="text-white font-cairo font-extrabold text-[1.1rem] leading-tight text-right m-0">تحدث مع الذكاء الاصطناعي!</h3>
                                <p className="text-white/80 font-cairo text-[0.75rem] font-semibold text-right m-0 leading-snug">
                                    ابدأ محادثتك الذكية لتحسين لغتك الآن.
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    sessionStorage.removeItem('demoOnboardingDone');
                                    navigate('/mother-tongue');
                                }}
                                className="relative z-10 flex items-center justify-center gap-2 w-full h-[42px] rounded-xl bg-white text-[#2994f9] font-cairo font-bold text-[0.85rem] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 border-none cursor-pointer"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                ابدأ جلسة
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-auto">
                        <div className="w-full h-[2px] bg-[#f4f3fd] rounded-full my-1"></div>

                        <button
                            onClick={() => handleNavigation('/settings')}
                            className={`flex items-center justify-start gap-3.5 w-full h-[52px] px-[22px] rounded-xl border-none cursor-pointer font-cairo font-semibold text-base transition-colors duration-200
                            ${activePage === 'settings'
                                    ? 'bg-[#2994f9] text-white shadow-sm'
                                    : 'bg-transparent text-[#858597] hover:bg-[#f4f3fd] hover:text-[#2994f9]'}`}
                        >
                            <img
                                src="https://c.animaapp.com/SW9wcD58/img/sliders.svg"
                                alt=""
                                className={`w-[22px] h-[22px] transition-all duration-200 ${activePage === 'settings' ? 'brightness-0 invert' : 'grayscale opacity-50 contrast-125 hover:grayscale-0 hover:opacity-100'}`}
                            />
                            <span>الإعدادات</span>
                        </button>

                        <button onClick={handleLogout} className="flex items-center justify-start gap-3.5 w-full h-[52px] px-[22px] rounded-xl bg-transparent text-[#858597] hover:bg-[#ffe5e5] hover:text-[#d32f2f] font-cairo font-semibold text-base transition-colors group mb-[20px]">
                            <img src="https://c.animaapp.com/SW9wcD58/img/log-out.svg" alt="" className="w-[22px] h-[22px] grayscale opacity-50 contrast-125 group-hover:grayscale-0 group-hover:opacity-100" />
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
