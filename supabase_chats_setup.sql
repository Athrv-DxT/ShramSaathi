-- Supabase Setup Script for Shram Saathi Conversation History
-- Please run this script in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS chats (
  id uuid primary key default gen_random_uuid(),
  session_id text not null, -- To group chats by a specific browser session or user device
  role text not null,       -- 'user' or 'ai'
  content text not null,    -- The text message
  audio_url text,           -- The optional backend path to the synthesized audio
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast lookup by session ID
CREATE INDEX IF NOT EXISTS idx_chats_session_id ON chats (session_id);
