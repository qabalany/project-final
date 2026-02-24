import config from '../config/index.js';
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
