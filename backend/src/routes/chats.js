import express from 'express';
import { getChatsBySession } from '../services/chatService.js';

const router = express.Router();

router.get('/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        if (!sessionId) {
            return res.status(400).json({ success: false, error: "Session ID required" });
        }

        const history = await getChatsBySession(sessionId);
        return res.status(200).json({ success: true, chats: history });

    } catch (error) {
        console.error("[Chat Route Error]", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});

export default router;
