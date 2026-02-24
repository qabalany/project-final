import config from '../config/index.js';
import { generateSystemPrompt, generateOpeningText } from './avatarPrompts.js';

// The base URL for the LiveAvatar API endpoints
const LIVEAVATAR_API = 'https://api.liveavatar.com/v1';

// Every time a user starts a video call, a unique "Context" is needed for the AI.
// The "Context" is the character's brain (the system prompt) combined with their opening line.
// This is bundled and sent to LiveAvatar to return a Context ID for the session.

export const createLiveAvatarContext = async (avatarName, cleanProfession) => {
    // 1. Generate the instruction manual specific to this user's profession
    const instructions = generateSystemPrompt(avatarName, cleanProfession);

    // 2. Generate the first thing the avatar will say when the camera turns on
    const openingText = generateOpeningText(avatarName, cleanProfession);

    // 3. Send these instructions to the LiveAvatar servers to create the "brain"
    const response = await fetch(`${LIVEAVATAR_API}/contexts`, {
        method: 'POST',
        headers: {
            'X-API-KEY': config.liveAvatarApiKey,
            'Content-Type': 'application/json',
            accept: 'application/json',
        },
        body: JSON.stringify({
            // Give it a unique name to avoid accidentally overwriting past contexts
            name: `logah-${avatarName.toLowerCase()}-${Date.now()}`,
            prompt: instructions,
            opening_text: openingText,
        }),
    });

    if (!response.ok) {
        // If something goes wrong, log the exact error from LiveAvatar for debugging
        const errBody = await response.text();
        console.error('LiveAvatar Context creation failed:', response.status, errBody);
        throw new Error(`Failed to create LiveAvatar context: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Context successfully created in LiveAvatar!');

    // Some APIs wrap their response in a "data" property, carefully extract it
    return data.data || data;
};
