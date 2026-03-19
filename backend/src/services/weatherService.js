import axios from 'axios';

/**
 * Fetch daily weather forecast for a given lat/lon
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<string>} - Formatted string with weather details
 */
export const getWeather = async (lat, lon) => {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min&timezone=Asia/Kolkata&forecast_days=2`;
        
        const response = await axios.get(url);
        const daily = response.data.daily;

        // daily.time[0] is today, [1] is tomorrow
        const todayMaxTemp = daily.temperature_2m_max[0];
        const todayMinTemp = daily.temperature_2m_min[0];
        const todayRainProb = daily.precipitation_probability_max[0];
        
        const tomorrowMaxTemp = daily.temperature_2m_max[1];
        const tomorrowMinTemp = daily.temperature_2m_min[1];
        const tomorrowRainProb = daily.precipitation_probability_max[1];

        // Raw context to feed to Gemini — Gemini handles translation to Hindi smoothly.
        return `
Today's Forecast: Max ${todayMaxTemp}°C, Min ${todayMinTemp}°C. Rain Probability: ${todayRainProb}%.
Tomorrow's Forecast: Max ${tomorrowMaxTemp}°C, Min ${tomorrowMinTemp}°C. Rain Probability: ${tomorrowRainProb}%.
        `;
    } catch (error) {
        console.error("Error fetching weather:", error.message);
        return "Weather data unavailable at the moment.";
    }
};
