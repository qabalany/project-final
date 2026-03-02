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
        <div className="flex w-full min-h-screen bg-[#f3f4f8]" dir="rtl">
            {/* Sidebar */}
            <Sidebar
                activePage={getActivePageId()}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Header (Hamburger Menu) */}
            <div className="lg:hidden fixed top-0 left-0 w-full h-[70px] bg-white flex items-center justify-between px-6 z-30 shadow-sm">
                <div
                    className="flex flex-col gap-[5px] cursor-pointer p-2"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <div className="w-[24px] h-[3px] bg-[#1b0444] rounded-full"></div>
                    <div className="w-[18px] h-[3px] bg-[#1b0444] rounded-full"></div>
                    <div className="w-[24px] h-[3px] bg-[#1b0444] rounded-full"></div>
                </div>
                <img src="/favicon.svg" alt="Logah" className="w-[24px] h-[24px]" />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full lg:w-[calc(100%-274px)] h-screen overflow-y-auto px-4 lg:px-10 py-6 lg:py-10 mt-[70px] lg:mt-0 transition-all duration-300">
                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedLayout;
