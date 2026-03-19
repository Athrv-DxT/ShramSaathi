import express from 'express';
import { getWeather } from '../services/weatherService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { lat, lon } = req.body;
        
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Lat and Lon are required' });
        }

        const weatherData = await getWeather(lat, lon);
        
        return res.status(200).json({
            success: true,
            data: weatherData
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
