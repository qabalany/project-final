import client from "./client";

/**
 * Request a fresh LiveAvatar session token and Context ID.
 * @param {string} avatarId - 'ula' or 'tuwaiq'
 * @param {string} profession - The user's typed target profession
 * @returns {Promise<Object>} The session token, session ID, and parsed context
 */
export const createSession = async (avatarId, profession) => {
    const response = await client.post("/avatar/create-session", { avatarId, profession });
    return response.data;
};

/**
 * Force the AI to say the closing outro message.
 * @param {string} sessionToken - The active LiveAvatar WebRTC token
 */
export const sendOutro = async (sessionToken) => {
    const response = await client.post("/avatar/send-outro", { sessionToken });
    return response.data;
};

/**
 * End the WebRTC session and log the duration to the database.
 * @param {string} sessionToken - The active LiveAvatar WebRTC token
 * @param {string} userId - The MongoDB User ID
 * @param {string} avatarId - 'ula' or 'tuwaiq'
 * @param {number} durationInSeconds - How long the WebRTC connection lasted
 */
export const stopSession = async (sessionToken, userId, avatarId, durationInSeconds) => {
    const response = await client.post("/avatar/stop-session", {
        sessionToken,
        userId,
        avatarId,
        durationInSeconds,
    });
    return response.data;
};

export default {
    createSession,
    sendOutro,
    stopSession,
};
