import { supabase } from './supabase.js';

export const saveChat = async (sessionId, role, content, audioUrl = null) => {
    try {
        const { data, error } = await supabase
            .from('chats')
            .insert([
                {
                    session_id: sessionId,
                    role: role,
                    content: content,
                    audio_url: audioUrl
                }
            ]);

        if (error) throw error;
        return data;
    } catch (e) {
        console.error("[ChatService] Error saving chat:", e.message);
        return null;
    }
};

export const getChatsBySession = async (sessionId) => {
    try {
        const { data, error } = await supabase
            .from('chats')
            .select('role, content, audio_url, created_at')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("[ChatService] Error fetching chats:", e.message);
        return [];
    }
};
