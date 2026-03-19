import axios from 'axios';
import cron from 'node-cron';
import { generateEmbedding } from '../services/gemini.js';
import { clearSchemeChunks, insertSchemeChunks } from '../services/supabase.js';

// The URL from user requirements
const SCHEME_API_URL = 'https://api.myscheme.gov.in/search/v4/schemes';
// Rough chunk limit (Gemini text-embedding-004 allows up to 2048 naturally, but 400 requested for precise RAG)
const CHUNK_CHAR_LIMIT = 1500; // approximate 400 tokens

/**
 * Split text into rough chunks that don't cut words
 */
const chunkText = (text, maxLength) => {
    if (!text) return [];
    
    const chunks = [];
    let currentChunk = "";
    
    // Split by sentence/newline roughly
    const sentences = text.split(/(?<=[.!?\n])\s+/);
    
    for (const sentence of sentences) {
        if ((currentChunk.length + sentence.length) < maxLength) {
            currentChunk += " " + sentence;
        } else {
            if (currentChunk.trim().length > 0) {
                chunks.push(currentChunk.trim());
            }
            currentChunk = sentence;
        }
    }
    
    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
    }
    
    return chunks;
};

/**
 * Main Scraper Execution
 */
export const runScraper = async () => {
    console.log("[Scraper] Starting myscheme database sync...");
    
    try {
        // 1. Fetch data from MyScheme API
        // Depending on API structure, we might need pagination. We'll grab first page of generic schemes for prototype.
        const response = await axios.get(`${SCHEME_API_URL}?lang=hi`); 
        
        // This is speculative mapping, assuming typical myscheme REST shape
        // Based on: basic search returning an array of scheme objects in `data.schemes`
        const schemes = response.data?.data?.schemes || [];

        console.log(`[Scraper] Fetched ${schemes.length} schemes`);

        if (schemes.length === 0) {
           console.log("[Scraper] No schemes found, aborting sync.");
           return;
        }

        // 2. Clear previous chunks in Supabase
        console.log("[Scraper] Clearing old embeddings in Supabase...");
        await clearSchemeChunks();

        // 3. Process, Chunk, Embed, Insert
        let totalChunksInserted = 0;

        for (const scheme of schemes) {
            // Myscheme often keeps rich HTML or long strings here. 
            // We combine them into a single blob of data representing the scheme.
            const schemeName = scheme.schemeName || scheme.basicDetails?.schemeName || "Unknown Scheme";
            
            const rawBody = `
                Name: ${schemeName}
                Description: ${scheme.schemeShortTitle || scheme.basicDetails?.schemeDescription || ""}
                Eligibility: ${scheme.eligibilityCriteria || scheme.eligibilityDescription || ""}
                Benefits: ${scheme.benefits || scheme.financialBenefits || ""}
                Application Process: ${scheme.applicationProcess || scheme.howToApply || ""}
            `.replace(/<[^>]*>?/gm, ''); // strip HTML tags if any

            // Chunk the body
            const textChunks = chunkText(rawBody, CHUNK_CHAR_LIMIT);

            const embeddingPromises = textChunks.map(async (text) => {
                const embedding = await generateEmbedding(text);
                return {
                    scheme_name: schemeName,
                    content: text,
                    embedding: embedding
                };
            });

            // Note: We await sequentially per scheme to not rate limit Gemini embeddings aggressively.
            const dbChunks = await Promise.all(embeddingPromises);

            if (dbChunks.length > 0) {
                await insertSchemeChunks(dbChunks);
                totalChunksInserted += dbChunks.length;
            }
        }

        console.log(`[Scraper] Success! Synthesized and synced ${totalChunksInserted} chunks into DB.`);

    } catch (error) {
        console.error("[Scraper] Failed to run scheme sync:", error.message);
    }
};

// Schedule to run every Sunday at 2 AM IST
// node-cron uses server timezone by default. Render.com defaults to UTC.
// 2 AM IST is 8:30 PM UTC (Saturday).
cron.schedule('30 20 * * 6', () => {
    runScraper();
});
