-- Supabase Setup Script for Shram Saathi
-- Please run this script in the Supabase SQL Editor to set up the vector database.

-- 1. Enable the pgvector extension to work with embedding vectors
create extension if not exists vector
with
  schema extensions;

-- 2. Create the scheme_chunks table
create table if not exists public.scheme_chunks (
    id bigserial primary key,
    scheme_name text not null,
    content text not null,
    embedding vector(768), -- text-embedding-004 outputs 768 dimensions
    last_updated timestamp with time zone default now()
);

-- 3. Create an index for faster similarity searches (optional but recommended)
create index on public.scheme_chunks using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- 4. Create a match_scheme_chunks function for vector similarity search via RPC
create or replace function match_scheme_chunks (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  scheme_name text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    scheme_chunks.id,
    scheme_chunks.scheme_name,
    scheme_chunks.content,
    1 - (scheme_chunks.embedding <=> query_embedding) as similarity
  from scheme_chunks
  where 1 - (scheme_chunks.embedding <=> query_embedding) > match_threshold
  order by scheme_chunks.embedding <=> query_embedding
  limit match_count;
$$;
