# Portfolio AI Representative

- Project type: Personal project
- Timeline: 2026
- Role: Sole builder

## Problem

Recruiters and visitors often want quick answers about a candidate's background, projects, strengths, and working style, but a traditional portfolio forces them to scan multiple pages manually.

## Solution

Alex built a portfolio backend with a grounded AI chat experience that answers questions using only verified knowledge stored in local content files and synced into PostgreSQL. The project emphasizes maintainability, explicit retrieval flow, and guardrails against hallucination.

## Contributions

- Designed the backend architecture for a portfolio chatbot MVP using Next.js route handlers and TypeScript services.
- Created a local knowledge ingestion flow from JSON and Markdown into normalized database records and retrieval chunks.
- Implemented keyword-based retrieval as the MVP strategy, while keeping the architecture open for a future upgrade to embeddings and vector search.
- Added prompt construction rules that force the assistant to stay grounded in available facts.
- Added Docker and Docker Compose for local development with PostgreSQL.

## Technical stack

- Next.js
- TypeScript
- PostgreSQL
- Docker
- OpenAI API

## Impact

- Demonstrates Alex's ability to structure an AI feature around reliability, not just model output.
- Shows backend ownership across schema design, content ingestion, retrieval logic, prompt orchestration, and deployment setup.
- Serves as a practical example of building a small but extensible AI product without unnecessary infrastructure at MVP stage.
