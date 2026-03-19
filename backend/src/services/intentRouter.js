import { searchGovernmentSchemes } from './searchService.js';
import { getWeather } from './weatherService.js';

const WEATHER_KEYWORDS = ["mausam","barish","garmi","thand","baarish","kal","aaj","tapman","dhoop"];
const SCHEME_KEYWORDS = ["yojana","scheme","sarkar","labh","paisa","sarkari","register","form","pension","bima","PM","pradhan mantri"];

/**
 * Route a transcribed query to the correct context string
 * @param {string} transcript - User phrase
 * @param {Object} location - { lat, lon }
 * @returns {Promise<string>} - The appropriate context string to attach to LLM prompt
 */
export const determineContext = async (transcript, location = null) => {
    const textLower = transcript.toLowerCase();
    
    // Check Weather
    const isWeather = WEATHER_KEYWORDS.some(kw => textLower.includes(kw));
    if (isWeather) {
        if (!location || !location.lat || !location.lon) {
            return "User wants weather information but no location data was provided by the client.";
        }
        return await getWeather(location.lat, location.lon);
    }

    // Check Schemes
    const isScheme = SCHEME_KEYWORDS.some(kw => textLower.includes(kw));
    if (isScheme) {
        try {
            return await searchGovernmentSchemes(transcript);
        } catch (e) {
            console.error("Live web search failed during intent routing.", e);
            return "Scheme database is currently unavailable.";
        }
    }

    // General intent (Fallback)
    return ""; // No additional context needed
};
