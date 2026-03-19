import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with explicitly passed key
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `Aap Shram Saathi hain — India ke gig aur informal workers ke liye ek digital sahayak.
Aap sirf simple, clear Hindi mein jawab dete hain.
Jargon ya English words avoid karein jab tak zaroori na ho.
Sarkari scheme ya weather (mausam) ke baare mein sawaal aaye, to HAMESHA diye gaye [Relevant context] ka istemaal karein. Khud se Google check karne mat bolein kyunki main aapko live data provide kar raha hu!
Har jawab ke end mein ek actionable step zaroor batayein.
Jawab 3-4 sentences se zyada lamba na ho — user mobile par hai.`;

/**
 * Generate a text response using Gemini 1.5 Flash
 * @param {string} userQuery - The transcribed text from the user
 * @param {string} context - Optional context (Schemes or Weather data)
 * @returns {Promise<string>} - The Hindi response
 */
export const generateResponse = async (userQuery, context = "") => {
    let finalPrompt = userQuery;
    
    if (context) {
        finalPrompt = `[Relevant context: ${context}]\n\nUser Query: ${userQuery}`;
    }

    const model = ai.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: SYSTEM_PROMPT
    });

    const result = await model.generateContent({
        contents: [{role: 'user', parts: [{text: finalPrompt}]}],
        generationConfig: { temperature: 0.3 }
    });

    return result.response.text();
};

/**
 * Generate embeddings for a text chunk using text-embedding-004
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} - The embedding vector (768 dimensions)
 */
export const generateEmbedding = async (text) => {
    const model = ai.getGenerativeModel({ model: 'gemini-embedding-001' });
    const result = await model.embedContent(text);
    return result.embedding.values;
};
