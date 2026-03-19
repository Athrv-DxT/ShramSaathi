import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './cron/schemeScraper.js'; // initialize cron job on startup

import voiceRoutes, { setupStaticAudioRoute } from './routes/voice.js';
import weatherRoutes from './routes/weather.js';
import chatRoutes from './routes/chats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve trailing slash CORS issues cleanly
const safeFrontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : '*';
const allowedOrigins = safeFrontendUrl !== '*' ? [safeFrontendUrl, `${safeFrontendUrl}/`] : '*';

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Routes
app.use('/api/voice', voiceRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/chats', chatRoutes);

// Setup static serving for TTS audio
setupStaticAudioRoute(app);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Shram Saathi Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
