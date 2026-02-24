import config from '../config/index.js';

// We use OpenAI's GPT models to powerfully clean up user inputs.
// If a user types their profession in Arabic, slang, or long sentences,
// this helper strictly extracts just the core English profession title (e.g., "Software Engineering").

export const extractProfession = async (rawInput) => {
    try {
        console.log('🤖 Extracting profession from:', rawInput);

        // We call the official OpenAI chat completions endpoint
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.openaiApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Faster and cheaper than gpt-4 for simple classification tasks
                messages: [
                    {
                        role: 'system',
                        content: `You are a professional title extractor. The user will give you text in Arabic (or any language) describing their job or profession. Extract ONLY the professional title/field in English. Return ONLY the profession name, nothing else. Examples:
- "انا مهندس برمجيات وبحاول احسن لغتي" → "Software Engineering"
- "انا طبيب اسنان" → "Dentistry"
- "انا محامي تجاري" → "Commercial Law"
- "انا ممرضة في مستشفى" → "Nursing"
- "بشتغل في الأمن السيبراني" → "Cybersecurity"
- "مهندس مدني" → "Civil Engineering"
- "مصمم جرافيك" → "Graphic Design"`,
                    },
                    {
                        role: 'user',
                        content: rawInput,
                    },
                ],
                max_tokens: 50, // We only need a short title
                temperature: 0, // 0 means be perfectly deterministic and strict
            }),
        });

        if (!response.ok) {
            console.error('GPT API error communicating with OpenAI:', response.status);
            // If OpenAI is down, just return what the user typed so the app doesn't break
            return rawInput;
        }

        const data = await response.json();
        // Dig into the JSON response to grab the actual text GPT generated
        const profession = data.choices?.[0]?.message?.content?.trim();

        console.log('✅ Extracted profession:', profession);
        return profession || rawInput;
    } catch (error) {
        // Catch network errors
        console.error('GPT extraction failed:', error.message);
        return rawInput;
    }
};
