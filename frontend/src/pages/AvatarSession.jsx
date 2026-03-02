import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Room, RoomEvent, Track } from 'livekit-client';
import avatarService from '../api/avatar.service';
import { AuthContext } from '../context/AuthContext';

const AvatarSession = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Combine UI States
    const [sessionData, setSessionData] = useState(null);
    const [status, setStatus] = useState('connecting'); // connecting | active | error
    const [errorMsg, setErrorMsg] = useState('');

    // Timer States
    const initialTime = 60; // 1 minute
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isClosing, setIsClosing] = useState(false);

    // Media States
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
    const [isVideoConnected, setIsVideoConnected] = useState(false);

    // Refs
    const videoRef = useRef(null);
    const roomRef = useRef(null);
    const timerRef = useRef(null);
    const outroTriggeredRef = useRef(false);

    // Ending the call
    const handleEndCall = useCallback(async (tokenOverride = null, durationInSeconds = 0) => {
        const activeToken = tokenOverride || (sessionData ? sessionData.session_token : null);
        const avatarId = localStorage.getItem('selectedAvatar') || 'ula';
        const userId = user ? user._id : null;

        if (timerRef.current) clearInterval(timerRef.current);

        if (roomRef.current) {
            try {
                roomRef.current.disconnect();
                roomRef.current = null;
            } catch (e) { console.error(e); }
        }

        // Clean up audio elements attached outside DOM tracking
        document.querySelectorAll('audio[id^="avatar-audio-"]').forEach(el => el.remove());

        if (activeToken) {
            try {
                await avatarService.stopSession(activeToken, userId, avatarId, durationInSeconds);
            } catch (err) { }
        }
        localStorage.removeItem('active_session_token');
        navigate('/review', { state: { transcripts: [] } });
    }, [sessionData, navigate, user]);

    // Format MM:SS
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Toggle Mic
    const toggleMic = () => {
        if (roomRef.current && roomRef.current.localParticipant) {
            const newState = !isMicrophoneEnabled;
            roomRef.current.localParticipant.setMicrophoneEnabled(newState);
            setIsMicrophoneEnabled(newState);
        }
    };

    // Main connection logic
    useEffect(() => {
        const startSession = async () => {
            try {
                const avatarId = localStorage.getItem('selectedAvatar') || 'ula';
                const profession = localStorage.getItem('userProfession') || 'General Conversation';

                // Get Token
                const data = await avatarService.createSession(avatarId, profession);
                localStorage.setItem('active_session_token', data.session_token);
                setSessionData(data);

                // Start Session Engine
                const startData = await avatarService.startSession(data.session_token);

                // Extract LiveKit connection info
                const livekitUrl = startData.livekit_url || startData.url || startData.room_url || startData.livekit_server_url;
                const livekitToken = startData.livekit_client_token || startData.token || startData.access_token || startData.client_token;

                if (!livekitUrl || !livekitToken) {
                    throw new Error('Missing LiveKit connection info from server');
                }

                const room = new Room({
                    adaptiveStream: true,
                    dynacast: true,
                });
                roomRef.current = room;

                // Listen for Tracks
                room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
                    console.log(`📺 Track subscribed: ${track.kind} from ${participant.identity}`);

                    if (track.kind === Track.Kind.Video && videoRef.current) {
                        track.attach(videoRef.current);
                        setIsVideoConnected(true);
                    }
                    if (track.kind === Track.Kind.Audio) {
                        const audioEl = document.createElement('audio');
                        audioEl.autoplay = true;
                        audioEl.id = `avatar-audio-${Date.now()}`;
                        track.attach(audioEl);
                        document.body.appendChild(audioEl);
                        audioEl.play().catch(e => console.warn('Audio blocked:', e));
                    }
                });

                // Connect to LiveKit
                await room.connect(livekitUrl, livekitToken);
                console.log('✅ Connected to LiveKit room!');

                // Enable Mic
                await room.localParticipant.setMicrophoneEnabled(true);
                setIsMicrophoneEnabled(true);

                setStatus('active');
            } catch (error) {
                console.error("Session start error:", error);
                setErrorMsg("عذراً، حدث خطأ أثناء الاتصال بالمعلم الذكي. يرجى المحاولة مرة أخرى.");
                setStatus('error');
            }
        };

        let isMounted = true;
        if (isMounted) {
            startSession();
        }

        return () => {
            isMounted = false;
            // Note: intentionally avoided cleaning up room strictly here to prevent fast remount disconnect bugs
        };
    }, []);

    // Timer Logic - starts only when video is connected
    useEffect(() => {
        if (!isVideoConnected || status !== 'active') return;

        if (timeLeft <= 0) {
            handleEndCall(sessionData?.session_token, initialTime - timeLeft);
            return;
        }

        if (timeLeft <= 10 && !outroTriggeredRef.current) {
            outroTriggeredRef.current = true;
            setIsClosing(true);
            console.log("Triggering auto-outro...");
            if (sessionData?.session_token) {
                avatarService.sendOutro(sessionData.session_token).catch(e => console.error(e));
            }
        }

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timeLeft, isVideoConnected, status, sessionData, handleEndCall]);

    // -- Renders --
    if (status === 'error') {
        return (
            <div className="w-full h-screen bg-[#0a0f1c] flex flex-col items-center justify-center font-sans" dir="rtl">
                <div className="bg-red-500/10 p-8 rounded-3xl border border-red-500/20 max-w-md text-center">
                    <h2 className="text-red-400 text-xl font-bold mb-4">{errorMsg}</h2>
                    <button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors font-medium border border-white/10">العودة للرئيسية</button>
                </div>
            </div>
        );
    }

    if (status === 'connecting') {
        return (
            <div className="w-full h-screen bg-[#0a0f1c] flex flex-col items-center justify-center font-sans" dir="rtl">
                <div className="w-24 h-24 rounded-full bg-[#1a243d] flex items-center justify-center mb-6 animate-pulse border border-white/5 shadow-inner">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                    </svg>
                </div>
                <h2 className="text-white/90 text-2xl font-bold mb-2 tracking-wide">جاري تهيئة الجلسة...</h2>
                <p className="text-white/50 text-lg">يرجى الانتظار بينما نقوم بتحضير المعلم الذكي الخاص بك</p>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-[#0a0f1c] flex flex-col font-sans" dir="rtl">
            {/* Top Bar */}
            <div className="flex justify-between items-center px-4 sm:px-8 py-5 sm:py-6 z-10 shrink-0">
                <button
                    onClick={() => handleEndCall()}
                    className="text-white/70 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 flex items-center gap-2"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span className="hidden sm:inline">إنهاء الجلسة</span>
                </button>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border transition-colors ${isClosing ? 'bg-red-500/20 border-red-500/50' : timeLeft <= 30 ? 'bg-orange-500/20 border-orange-500/50' : 'bg-white/5 border-white/10'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isClosing ? 'bg-red-500' : timeLeft <= 30 ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                    <span className={`text-sm font-medium tabular-nums tracking-wider ${isClosing ? 'text-red-400' : timeLeft <= 30 ? 'text-orange-400' : 'text-white/90'}`}>{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 px-4 sm:px-8 pb-8 relative flex justify-center items-center">
                <div className="w-full max-w-6xl h-full bg-[#131b2f] rounded-[24px] sm:rounded-[32px] border border-white/5 shadow-2xl overflow-hidden relative flex flex-col items-center justify-center">

                    {/* The Video Element */}
                    <video ref={videoRef} className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoConnected ? 'opacity-100' : 'opacity-0 absolute'}`} autoPlay playsInline />

                    {!isVideoConnected && (
                        <>
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1a243d] flex items-center justify-center mb-6 animate-pulse border border-white/5 shadow-inner">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" />
                                    <rect x="3" y="6" width="12" height="12" rx="2" stroke="rgba(255,255,255,0.3)" />
                                </svg>
                            </div>
                            <p className="text-white/50 text-base sm:text-lg font-medium px-4 text-center">في انتظار بث الفيديو الذكي...</p>
                        </>
                    )}

                    <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-6 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] h-[320px] bg-[#0a0f1c]/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 z-20 flex flex-col gap-4 overflow-y-auto hidden sm:flex scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        <div className="shrink-0 h-2"></div>
                    </div>

                    <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-6 bg-[#0a0f1c]/80 backdrop-blur-xl px-5 py-3 sm:px-8 sm:py-4 rounded-[20px] sm:rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-30">
                        <button
                            onClick={toggleMic}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${!isMicrophoneEnabled ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            title={!isMicrophoneEnabled ? 'Unmute' : 'Mute'}
                        >
                            {!isMicrophoneEnabled ? (
                                <svg width="20" height="20" sm:width="22" sm:height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                            ) : (
                                <svg width="20" height="20" sm:width="22" sm:height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                            )}
                        </button>

                        <button
                            onClick={() => handleEndCall()}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.5)] border-none shrink-0"
                            title="End Call"
                        >
                            <svg width="22" height="22" sm:width="24" sm:height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarSession;
