# Portfolio AI Backend

Backend MVP for a personal portfolio website with an AI "Chat with me" assistant.

## What is included

- `Next.js` app router project with backend API routes
- PostgreSQL-backed knowledge store
- File-based source-of-truth knowledge under `content/knowledge`
- Automatic knowledge sync from files into DB tables
- Keyword-based retrieval over normalized knowledge chunks
- OpenAI Responses API integration for grounded answers
- Basic guardrails for insufficient context and malformed knowledge

## API endpoints

- `POST /api/chat`
- `GET /api/health`

## Local run

1. Start PostgreSQL:

```bash
docker compose up -d postgres
```

2. Copy `.env.example` to `.env` and set your real `OPENAI_API_KEY`.

3. Start the app:

```bash
npm run dev
```

4. Test the chat endpoint:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"Tell me about your backend experience\"}"
```

## Run with Docker

```bash
docker compose up --build
```

Services:

- App: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`
- Postgres: `localhost:5432`

Notes:

- PostgreSQL schema is defined in `db/schema.sql`.
- Knowledge files from `content/knowledge` are synced into the database on first access.
- LLM calls require `OPENAI_API_KEY` and `ENABLE_LLM=true`.
