import config from '../config/index.js';
import Session from '../models/Session.model.js';
import { extractProfession } from '../utils/openaiHelper.js';
import { createLiveAvatarContext } from '../utils/liveAvatarHelper.js';

const LIVEAVATAR_API = 'https://api.liveavatar.com/v1';

// Hardcoded configuration tying our frontend choices to the correct LiveAvatar IDs
const AVATAR_CONFIG = {
    ula: {
        avatar_id: config.liveAvatarUlaId,
        voice_id: config.liveAvatarUlaVoiceId,
        name: 'Ula',
    },
    tuwaiq: {
        avatar_id: config.liveAvatarTuwaiqId,
        voice_id: config.liveAvatarTuwaiqVoiceId,
        name: 'Tuwaiq',
    },
};

// POST /api/avatar/create-session
// This endpoint is hit right after the user configures their session on the frontend
export const createSession = async (req, res) => {
    try {
        const { avatarId, profession } = req.body;

        // 1. Validate the incoming request data
        if (!avatarId || !AVATAR_CONFIG[avatarId]) {
            return res.status(400).json({ error: 'Invalid avatar. Choose "ula" or "tuwaiq".' });
        }
        if (!profession || !profession.trim()) {
            return res.status(400).json({ error: 'Profession is required.' });
        }

        const avatarConfig = AVATAR_CONFIG[avatarId];

        // 2. Pass the messy user input through OpenAI to get a clean English title
        const cleanProfession = await extractProfession(profession.trim());
        console.log(`🎯 Clean profession: "${cleanProfession}"`);

        // 3. Create the customized prompt and upload it to LiveAvatar
        console.log(`🎭 Creating context for ${avatarConfig.name} in ${cleanProfession}...`);
        const context = await createLiveAvatarContext(avatarConfig.name, cleanProfession);
        const contextId = context.context_id || context.id;
        console.log('📋 Context ID:', contextId);

        // 4. Request a Session Token from LiveAvatar using the new Context ID
        console.log(`🔑 Requesting session token from LiveAvatar...`);
        const tokenPayload = {
            mode: 'FULL',
            avatar_id: avatarConfig.avatar_id,
            is_sandbox: false,
            avatar_persona: {
                voice_id: avatarConfig.voice_id,
                context_id: contextId,
                language: 'en',
            },
        };

        const tokenRes = await fetch(`${LIVEAVATAR_API}/sessions/token`, {
            method: 'POST',
            headers: {
                'X-API-KEY': config.liveAvatarApiKey,
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify(tokenPayload),
        });

        if (!tokenRes.ok) {
            const errBody = await tokenRes.text();
            console.error('Session token creation failed:', tokenRes.status, errBody);
            throw new Error(`Failed to create session token: ${tokenRes.status}`);
        }

        const tokenData = await tokenRes.json();

        // Account for slight variations in the LiveAvatar API response structure
        const sessionId = tokenData.session_id || tokenData.data?.session_id || tokenData.id;
        const sessionToken = tokenData.session_token || tokenData.data?.session_token || tokenData.token;

        if (!sessionToken) {
            throw new Error('No session token returned from LiveAvatar');
        }

        // 5. Send the required connection info back to the React frontend
        res.json({
            session_id: sessionId,
            session_token: sessionToken,
            avatar_name: avatarConfig.name,
            context_id: contextId,
        });
    } catch (error) {
        console.error('❌ Create session error:', error.message);
        res.status(500).json({ error: 'Failed to create avatar session', details: error.message });
    }
};

// POST /api/avatar/stop-session
// This endpoint is hit when the user clicks "End Call" on the frontend.
// It gracefully terminates the LiveAvatar stream and permanently logs the session to MongoDB.
export const stopSession = async (req, res) => {
    try {
        const { sessionToken, userId, avatarId, durationInSeconds } = req.body;

        // 1. Validate the required security token
        if (!sessionToken) {
            return res.status(400).json({ error: 'Session token is required to stop the stream.' });
        }

        console.log('⏹️ Telling LiveAvatar to terminate the stream...');

        // 2. Send the stop command to the LiveAvatar servers
        const stopRes = await fetch(`${LIVEAVATAR_API}/sessions/stop`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${sessionToken}`,
                accept: 'application/json',
            },
        });

        if (!stopRes.ok) {
            const errBody = await stopRes.text();
            console.error('Session stop failed:', stopRes.status, errBody);
            throw new Error(`Failed to stop session: ${stopRes.status}`);
        }

        const data = await stopRes.json();
        console.log('✅ Session successfully stopped and video stream terminated.');

        // 3. Log the history to our database for analytics later
        // We use a try/catch here because even if the database logging fails, 
        // the video stream was successfully stopped, and we shouldn't throw a fatal 500 error to the user.
        try {
            if (userId && avatarId) {
                const sessionDoc = await Session.create({
                    user: userId,
                    avatarId: avatarId,
                    durationInSeconds: durationInSeconds || 0,
                    liveAvatarSessionId: "frontend_controlled", // Usually, the frontend parses the actual ID and sends it
                });
                console.log('📊 Session successfully logged to MongoDB:', sessionDoc._id);
            }
        } catch (logErr) {
            console.error('⚠️ Warning: Failed to log session history to MongoDB (non-fatal):', logErr.message);
        }

        res.json(data);
    } catch (error) {
        console.error('❌ Stop session fatal error:', error.message);
        res.status(500).json({ error: 'Failed to explicitly stop avatar session', details: error.message });
    }
};

// POST /api/avatar/send-outro
// This endpoint is used right before the 5-minute timer expires.
// It interrupts whatever the avatar is currently saying, and forces it to speak a closing outro message.
export const sendOutro = async (req, res) => {
    try {
        const { sessionToken, text } = req.body;

        if (!sessionToken) {
            return res.status(400).json({ error: 'Session token is required.' });
        }

        // Default outro message if none is provided
        const outroText = text || "Great job today! Our session is ending now. You did really well, and I can see real progress in your English. Keep practicing every day. See you next time!";

        // Step 1: Interrupt current avatar speech
        // If the avatar is mid-sentence, this tells the LiveAvatar API to immediately stop audio playback.
        console.log('🛑 Interrupting avatar...');
        try {
            const interruptRes = await fetch(`${LIVEAVATAR_API}/sessions/interrupt`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${sessionToken}`,
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                },
            });
            const interruptData = await interruptRes.text();
            console.log('Interrupt response:', interruptRes.status, interruptData);
        } catch (e) {
            // Non-fatal error; proceeding to talk command regardless
            console.log('Interrupt not available, continuing...');
        }

        // Step 2: Send talk command to make avatar speak the outro
        console.log('📢 Sending outro talk...');
        const talkRes = await fetch(`${LIVEAVATAR_API}/sessions/talk`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify({ text: outroText }),
        });

        const talkData = await talkRes.text();
        console.log('Talk response:', talkRes.status, talkData);

        // Fallback: If /sessions/talk fails, try /sessions/speak (accomodating LiveAvatar API version differences)
        if (!talkRes.ok) {
            console.log('📢 Trying alternative talk endpoint...');
            const altRes = await fetch(`${LIVEAVATAR_API}/sessions/speak`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${sessionToken}`,
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                },
                body: JSON.stringify({ text: outroText }),
            });
            const altData = await altRes.text();
            console.log('Alt talk response:', altRes.status, altData);
        }

        res.json({ success: true, message: 'Outro sent' });
    } catch (error) {
        console.error('❌ Send outro error:', error.message);
        res.status(500).json({ error: 'Failed to send outro', details: error.message });
    }
};
