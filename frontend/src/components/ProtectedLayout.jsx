import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const ProtectedLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Map current pathname to an active id for the sidebar styling
    const getActivePageId = () => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path.startsWith('/path')) return 'path';
        if (path.startsWith('/messages')) return 'messages';
        if (path.startsWith('/settings')) return 'settings';
        if (path.startsWith('/account')) return 'account';
        if (path.startsWith('/app-feedback')) return 'app-feedback';
        return '';
    };

    return (
        <div className="flex justify-center min-h-screen bg-[#f3f4f8] font-cairo text-[#1b0444] lg:py-[30px] px-0 sm:px-4" dir="rtl">
            {/* Mobile Header (Hamburger Menu) */}
            <div className="lg:hidden fixed top-0 left-0 w-full h-[70px] bg-white flex items-center justify-between px-6 z-30 shadow-sm">
                <div
                    className="flex flex-col gap-[5px] cursor-pointer p-2 -mr-2"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <div className="w-[24px] h-[3px] bg-[#1b0444] rounded-full"></div>
                    <div className="w-[18px] h-[3px] bg-[#1b0444] rounded-full"></div>
                    <div className="w-[24px] h-[3px] bg-[#1b0444] rounded-full"></div>
                </div>
                <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
                    <img src="/favicon.svg" alt="Logah" className="w-8 h-8" />
                    <span className="font-bold text-lg text-[#232360]">Logah</span>
                </div>
                {/* Spacer for flex balance */}
                <div className="w-8 h-8"></div>
            </div>

            <div className="flex w-full max-w-[1440px] gap-4 relative mt-[70px] lg:mt-0">
                {/* Sidebar Wrapper */}
                <div className="absolute lg:sticky lg:w-[274px] shrink-0 top-[31px] h-fit z-50">
                    <Sidebar
                        activePage={getActivePageId()}
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    />
                </div>

                {/* Main Content Area */}
                <main className="flex-1 w-full max-w-[1118px] flex flex-col gap-4 overflow-x-hidden pt-6 lg:pt-0 px-4 lg:px-0 pb-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;
