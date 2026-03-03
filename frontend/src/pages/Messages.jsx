import React from 'react';

const Messages = () => {
    return (
        <div className="flex-1 p-8 font-cairo" dir="rtl">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-[#1b0444] mb-1">الرسائل</h1>
                <p className="text-[#858597] text-sm">تصفح رسائلك وتحديثاتك من المنصة.</p>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-[#f4f3fd] flex items-center justify-center mb-5">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#b0b0c3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-[#1b0444] mb-2">لا توجد رسائل بعد</h3>
                <p className="text-[#858597] text-sm max-w-xs">ستظهر هنا رسائلك وإشعاراتك من المنصة.</p>
            </div>
        </div>
    );
};

export default Messages;
