import { SarvamAI } from 'sarvamai';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

// Initialize SDK for STT
const getSarvamClient = () => {
    return new SarvamAI({
        apiSubscriptionKey: process.env.SARVAM_API_KEY
    });
};

/**
 * Transcribe local audio file to Hindi Text using saaras:v3
 * @param {string} filePath - path to audio file
 * @returns {Promise<string>} - Transcription text
 */
export const transcribeAudio = async (filePath) => {
    try {
        const client = getSarvamClient();

        // Use the Sarvam API for Saaras v3
        // Note: SDK structure might differ depending on actual npm version provided.
        // If SDK methods fail, we would fallback to a direct POST request
        const job = await client.speechToTextJob.createJob({
            model: "saaras:v3",
            mode: "transcribe",
            languageCode: "unknown",
            withDiarization: false
        });

        await job.uploadFiles({ filePaths: [filePath] });
        await job.start();

        // We can't actually wait synchronously with job.waitUntilComplete easily if it blocks too long,
        // but since this is a voice bot, we want synchronous.
        await job.waitUntilComplete();

        const fileResults = await job.getFileResults();
        
        if (fileResults.successful.length > 0) {
            // Assuming result structure has a 'transcript' or similar payload
            // For a prototype, extracting text from the first successful result
            return fileResults.successful[0].transcript || fileResults.successful[0].text || "";
        } else {
            console.error("STT Failed:", fileResults.failed[0]?.errorMessage);
            throw new Error(`STT processing failed: ${fileResults.failed[0]?.errorMessage}`);
        }
    } catch (e) {
        console.warn("SDK failed or not matching docs, falling back to direct API call for STT", e.message);
        return await transcribeAudioDirect(filePath);
    }
}

/**
 * Direct HTTPS fallback for STT, just in case SDK docs are outdated
 */
const transcribeAudioDirect = async (filePath) => {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('model', 'saaras:v3');

    const res = await axios.post('https://api.sarvam.ai/speech-to-text-translate', formData, {
        headers: {
            'api-subscription-key': process.env.SARVAM_API_KEY,
            ...formData.getHeaders()
        }
    });
    // This endpoint gives standard text
    return res.data.transcript;
}

/**
 * Generate Speech from Text using bulbul:v3
 * Streams output to a local file, returns path
 * @param {string} text - text to speak
 * @param {string} outputPath - where to save mp3
 */
export const synthesizeSpeech = async (text, outputPath) => {
    const API_URL = "https://api.sarvam.ai/text-to-speech/stream";

    const payload = {
        text: text,
        target_language_code: "hi-IN",
        speaker: "shubh",
        model: "bulbul:v3",
        pace: 1.1,
        speech_sample_rate: 22050,
        output_audio_codec: "mp3",
        enable_preprocessing: true
    };

    const response = await axios.post(API_URL, payload, {
        headers: {
            "api-subscription-key": process.env.SARVAM_API_KEY,
            "Content-Type": "application/json"
        },
        responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);
        writer.on('finish', () => resolve(outputPath));
        writer.on('error', reject);
    });
};
