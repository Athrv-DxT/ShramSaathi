import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import { transcribeAudio, synthesizeSpeech } from '../services/sarvam.js';
import { saveChat } from '../services/chatService.js';
import { generateResponse } from '../services/gemini.js';
import { determineContext } from '../services/intentRouter.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file uploaded.' });
        }

        const audioPath = req.file.path;
        const lat = req.body.lat; // optional
        const lon = req.body.lon; // optional
        const sessionId = req.body.sessionId || 'default-session';

        console.log(`[Voice] Received audio ${audioPath}. Lat: ${lat}, Lon: ${lon}`);

        // 1. Transcribe Audio (STT) via Sarvam AI
        console.log('[Voice] Transcribing...');
        const transcript = await transcribeAudio(audioPath);
        console.log(`[STT Output] ${transcript}`);

        // Cleanup original upload immediately
        try { fs.unlinkSync(audioPath); } catch (e) { console.error('temp file cleanup fail', e.message); }

        if (!transcript || transcript.trim().length === 0) {
            // Early return for empty audio
            return res.status(200).json({ 
                success: true, 
                audioUrl: null, 
                transcript: "", 
                response: "Mai kuchh sun nahi paaya. Kripya phirse bole." 
            });
        }

        // 2. Intent Routing (check for Weather or Scheme queries, find context)
        console.log('[Voice] Routing intent...');
        const context = await determineContext(transcript, { lat, lon });

        // 3. LLM Generation via Gemini Flash 1.5
        console.log('[Voice] Generating response (context attached if found)...');
        const llmResponseText = await generateResponse(transcript, context);
        console.log(`[LLM Output] ${llmResponseText}`);

        // Save user chat immediately
        await saveChat(sessionId, 'user', transcript);

        // 4. Synthesize Speech (TTS) via Sarvam AI
        console.log('[Voice] Synthesizing speech...');
        // Saving generated audio file to public/responses/ so client can fetch it
        // In a real prod environment we upload to S3, but local files work for prototype UI.
        const outputDir = path.resolve('public/responses/');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputFileName = `res_${Date.now()}.mp3`;
        const outputPath = path.join(outputDir, outputFileName);
        
        await synthesizeSpeech(llmResponseText, outputPath);
        
        // Expose path relative to backend root, which we'd typically serve statically.
        // E.g. /public/responses/res_123.mp3
        const servePath = `/responses/${outputFileName}`;

        // Save AI response
        await saveChat(sessionId, 'ai', llmResponseText, servePath);

        // Send back data
        return res.status(200).json({
            success: true,
            audioUrl: servePath,     // The frontend will play this audio
            transcript: transcript,  // Original transcirpt
            response: llmResponseText // The text result shown in chat log
        });

    } catch (e) {
        console.error("[Voice Route Error]", e);
        return res.status(500).json({ 
            success: false, 
            error: e.message 
        });
    }
});

// Since we output audio to `public/`, make sure express serves it
// We will export a static middleware configuration helper for index.js
export const setupStaticAudioRoute = (app) => {
    app.use('/responses', express.static(path.resolve('public/responses')));
};

export default router;
