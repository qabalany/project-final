import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveKitRoom, RoomAudioRenderer, useLocalParticipant } from '@livekit/components-react';

const SessionUI = ({ handleEndCall }) => {
    // The useLocalParticipant hook must be used inside the LiveKitRoom context
    const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

    const toggleMic = () => {
        if (localParticipant) {
            localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
        } else {
            console.warn("LiveKit not connected to a room yet.");
        }
    };

    return (
        <div className="w-full h-screen bg-[#0a0f1c] flex flex-col font-sans" dir="rtl">
            {/* Top Bar */}
            <div className="flex justify-between items-center px-4 sm:px-8 py-5 sm:py-6 z-10 shrink-0">
                <button
                    onClick={handleEndCall}
                    className="text-white/70 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 flex items-center gap-2"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span className="hidden sm:inline">إنهاء الجلسة</span>
                </button>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
                    <span className="text-white/90 text-sm font-medium">جاري الاتصال...</span>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 px-4 sm:px-8 pb-8 relative flex justify-center items-center">

                {/* AI Video Feed Placeholder Container */}
                <div className="w-full max-w-6xl h-full bg-[#131b2f] rounded-[24px] sm:rounded-[32px] border border-white/5 shadow-2xl overflow-hidden relative flex flex-col items-center justify-center">

                    {/* Placeholder content for when video is loading/not started */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1a243d] flex items-center justify-center mb-6 animate-pulse border border-white/5 shadow-inner">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" />
                            <rect x="3" y="6" width="12" height="12" rx="2" stroke="rgba(255,255,255,0.3)" />
                        </svg>
                    </div>
                    <p className="text-white/50 text-base sm:text-lg font-medium px-4 text-center">في انتظار بث الفيديو الذكي...</p>

                    {/* Conversation Transcript Panel (Bottom Left) */}
                    <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-6 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] h-[320px] bg-[#0a0f1c]/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 z-20 flex flex-col gap-4 overflow-y-auto hidden sm:flex scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">

                        {/* Placeholder Message: AI */}
                        <div className="flex flex-col gap-1 w-full bg-white/10 rounded-2xl border border-white/5" style={{ padding: '12px 16px' }}>
                            <span className="text-[11px] text-[#31d4ed] font-bold mb-1">المعلم الذكي</span>
                            <p className="text-white/90 text-[14px] leading-relaxed">
                                مرحباً بك! أنا هنا لمساعدتك في تعلم اللغة الإنجليزية. هل نستند إلى موضوع معين اليوم؟
                            </p>
                        </div>

                        {/* Placeholder Message: User */}
                        <div className="flex flex-col gap-1 w-full bg-[#2994f9]/15 rounded-2xl border border-[#2994f9]/30" style={{ padding: '12px 16px' }}>
                            <span className="text-[11px] text-[#2994f9] font-bold mb-1">أنت</span>
                            <p className="text-white/90 text-[14px] leading-relaxed">
                                نعم، أريد التدرب على مقابلة عمل.
                            </p>
                        </div>

                        {/* Empty space at bottom to ensure scrolling looks nice */}
                        <div className="shrink-0 h-2"></div>
                    </div>

                    {/* Control Dock */}
                    <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-6 bg-[#0a0f1c]/80 backdrop-blur-xl px-5 py-3 sm:px-8 sm:py-4 rounded-[20px] sm:rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-30">
                        {/* Mic Toggle */}
                        <button
                            onClick={toggleMic}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${!isMicrophoneEnabled ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            title={!isMicrophoneEnabled ? "إلغاء كتم الصوت" : "كتم الصوت"}
                        >
                            {!isMicrophoneEnabled ? (
                                <svg width="20" height="20" sm:width="22" sm:height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                            ) : (
                                <svg width="20" height="20" sm:width="22" sm:height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                            )}
                        </button>

                        {/* End Call */}
                        <button
                            onClick={handleEndCall}
                            className="w-16 h-12 sm:w-20 sm:h-14 bg-red-500 hover:bg-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white transition-colors shadow-[0_4px_14px_rgba(239,68,68,0.3)]"
                            title="إنهاء المكالمة"
                        >
                            <svg width="22" height="22" sm:width="24" sm:height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

const AvatarSession = () => {
    const navigate = useNavigate();

    // We will get these from backend later
    const serverUrl = "wss://placeholder.livekit.cloud";
    const token = "";

    const handleEndCall = () => {
        navigate('/');
    };

    return (
        <LiveKitRoom
            video={false}
            audio={true}
            token={token}
            serverUrl={serverUrl}
            connect={false} // don't connect yet since token is dummy
        >
            <SessionUI handleEndCall={handleEndCall} />
            <RoomAudioRenderer />
        </LiveKitRoom>
    );
};

export default AvatarSession;
