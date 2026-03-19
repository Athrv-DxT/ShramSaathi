import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Perform a similarity search on scheme_chunks
 * @param {number[]} embedding - query embedding vector
 * @param {number} match_threshold - min similarity score (0-1)
 * @param {number} match_count - number of chunks to return
 * @returns {Promise<Array>} - array of matched chunks
 */
export const searchSimilarSchemes = async (embedding, match_threshold = 0.5, match_count = 3) => {
    const { data, error } = await supabase.rpc('match_scheme_chunks', {
        query_embedding: embedding,
        match_threshold,
        match_count
    });

    if (error) {
        console.error("Supabase search error:", error);
        return [];
    }

    return data;
};

/**
 * Insert or update scheme chunks in DB
 * @param {Array<{scheme_name: string, content: string, embedding: number[]}>} chunks 
 */
export const insertSchemeChunks = async (chunks) => {
    // Basic bulk insert
    const { data, error } = await supabase
        .from('scheme_chunks')
        .insert(chunks)
        .select();

    if (error) {
        console.error("Failed to insert chunks:", error);
        throw error;
    }
    
    return data;
};

/**
 * Clears old chunks before scraping new ones
 */
export const clearSchemeChunks = async () => {
    const { error } = await supabase
        .from('scheme_chunks')
        .delete()
        .neq('id', 0); // Deletes all rows safely

    if (error) {
        console.error("Failed to clear chunks:", error);
    }
};
