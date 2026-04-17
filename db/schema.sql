create extension if not exists pg_trgm;

create table if not exists knowledge_documents (
  id text primary key,
  type text not null,
  title text not null,
  source_path text not null unique,
  raw_text text not null,
  normalized_text text not null,
  tags text[] not null default '{}',
  checksum text not null,
  last_updated timestamptz not null,
  synced_at timestamptz not null default now()
);

create table if not exists knowledge_chunks (
  id text primary key,
  document_id text not null references knowledge_documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  searchable_text text not null,
  checksum text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create index if not exists idx_knowledge_chunks_document_id
  on knowledge_chunks (document_id);

create table if not exists chat_response_cache (
  id bigserial primary key,
  question_hash text not null,
  normalized_question text not null,
  retrieval_signature text not null,
  prompt_signature text not null,
  answer text not null,
  model text not null,
  sources jsonb not null,
  top_score integer not null,
  context_count integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_hit_at timestamptz not null default now(),
  hit_count integer not null default 1,
  unique (question_hash, retrieval_signature)
);

create index if not exists idx_chat_response_cache_retrieval_signature
  on chat_response_cache (retrieval_signature);

create index if not exists idx_chat_response_cache_similarity
  on chat_response_cache
  using gin (normalized_question gin_trgm_ops);
