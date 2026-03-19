-- Supabase Setup Script for Shram Saathi (V2 Update for 3072 dimensions)
-- Please run this script in the Supabase SQL Editor to UPDATE the vector table from 768 to 3072 dimensions.

-- 1. Drop existing table and function
DROP FUNCTION IF EXISTS match_scheme_chunks;
DROP TABLE IF EXISTS scheme_chunks;

-- 2. Re-create the chunk table with 3072 dimensions for gemini-embedding-001
CREATE TABLE IF NOT EXISTS scheme_chunks (
  id uuid primary key default gen_random_uuid(),
  scheme_id text not null,
  scheme_name text not null,
  chunk_text text not null,
  embedding vector(3072) -- Changed from 768 to 3072 to support gemini-embedding-001
);

-- 3. Create the vector search function (cosine similarity)
CREATE OR REPLACE FUNCTION match_scheme_chunks (
  query_embedding vector(3072), -- Match new dimensions
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  scheme_id text,
  scheme_name text,
  chunk_text text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    scheme_chunks.id,
    scheme_chunks.scheme_id,
    scheme_chunks.scheme_name,
    scheme_chunks.chunk_text,
    1 - (scheme_chunks.embedding <=> query_embedding) AS similarity
  FROM scheme_chunks
  WHERE 1 - (scheme_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY scheme_chunks.embedding <=> query_embedding
  LIMIT match_count;
$$;
