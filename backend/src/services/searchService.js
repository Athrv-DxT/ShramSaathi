import axios from 'axios';

const TAVILY_API_URL = 'https://api.tavily.com/search';

/**
 * Searches government websites for the given query using Tavily API
 * @param {string} query The user's Hindi query
 * @returns {Promise<string>} Detailed string containing contexts from search results
 */
export const searchGovernmentSchemes = async (query) => {
    try {
        console.log(`[Tavily] Searching for: ${query}`);
        
        const response = await axios.post(TAVILY_API_URL, {
            api_key: process.env.TAVILY_API_KEY,
            query: `site:myscheme.gov.in OR site:mygov.in OR site:india.gov.in details about ${query}`,
            search_depth: "advanced",
            include_answer: false,
            include_images: false,
            include_raw_content: true, // We want the deep text for the LLM
            max_results: 3
        });

        const results = response.data.results;
        
        if (!results || results.length === 0) {
            return "No official government scheme data found for this query.";
        }

        // We compile the contexts into a single string
        let fullContext = "";
        for (const res of results) {
            fullContext += `Source: ${res.title} (${res.url})\nContent: ${res.raw_content || res.content}\n\n`;
        }
        
        // Truncate to avoid blowing up the LLM context if it's monstrously huge 
        // We allow around 10k chars which Gemini 2.5 Flash easily handles
        return fullContext.substring(0, 15000);

    } catch (error) {
        console.error("[Tavily] Search failed:", error?.response?.data || error.message);
        return "Search service temporarily unavailable.";
    }
};
