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
