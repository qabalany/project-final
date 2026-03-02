import client from "./client";

export const submitFeedback = async (feedbackData) => {
    const response = await client.post("/feedback", feedbackData);
    return response.data;
};

export default {
    submitFeedback,
};
