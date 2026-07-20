# Architecture Overview

## AI CV Assistant — System Architecture

**Version:** 1.0  
**Last Updated:** July 2026

---

## System Overview

The AI CV Assistant is a cloud-ready SaaS application built on a three-tier architecture:

1. **Frontend** — React 18 SPA served via Vercel (CDN)
2. **Backend API** — FastAPI (Python) deployed on Railway
3. **Data Layer** — PostgreSQL (relational) + FAISS (vector store)

All AI processing is handled server-side; the frontend never communicates with OpenAI directly.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                                                                  │
│   React 18 + TypeScript + Vite                                   │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │  Pages: Landing | Login | Dashboard | CV | Analysis | Chat │ │
│   │  State: React Query (server) + Zustand (auth)             │  │
│   │  API: Axios with JWT interceptors                         │  │
│   └──────────────────────────────────────────────────────────┘   │
│                     Hosted: Vercel CDN                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS REST API (JWT Bearer)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (FastAPI)                         │
│                                                                  │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  /auth   │  │   /cvs    │  │ /analysis │  │    /chat     │   │
│  │          │  │           │  │           │  │              │   │
│  │ register │  │  upload   │  │  analyse  │  │   message    │   │
│  │ login    │  │  list     │  │  match-jd │  │   history    │   │
│  │ me       │  │  delete   │  │  history  │  │   clear      │   │
│  └──────────┘  └───────────┘  └──────────┘  └──────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Service Layer                          │   │
│  │  AuthService | CVService | AnalysisService | ChatService  │  │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   AI Pipeline Layer                       │   │
│  │  TextExtractor | Embedder | VectorStore                   │  │
│  │  Analyser | JDMatcher | Chatbot                           │  │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Data Access Layer                        │   │
│  │  SQLAlchemy 2.0 Async ORM                                 │  │
│  └──────────────────────────────────────────────────────────┘   │
│                     Hosted: Railway                              │
└──────┬───────────────────────────────────────┬──────────────────┘
       │                                       │
       ▼                                       ▼
┌──────────────┐                    ┌──────────────────────────┐
│  OpenAI API  │                    │     PostgreSQL 15         │
│              │                    │  ┌──────────────────────┐ │
│  GPT-4o      │                    │  │ users                │ │
│  GPT-4o-mini │                    │  │ cv_documents         │ │
│  text-emb-   │                    │  │ analyses             │ │
│  3-small     │                    │  │ chat_history         │ │
└──────────────┘                    │  └──────────────────────┘ │
                                    │     Hosted: Railway        │
                                    └──────────────────────────┘
                                               │
                                               ▼
                                    ┌──────────────────────────┐
                                    │   FAISS Vector Store      │
                                    │   (server filesystem)     │
                                    │   faiss_indexes/          │
                                    │   └── {user_id}/          │
                                    │       └── {cv_id}.faiss   │
                                    └──────────────────────────┘
```

---

## Component Descriptions

### Frontend (React SPA)

- **React Query**: Manages all server state — caching, background refetching, loading/error states
- **Zustand**: Lightweight client-side auth state (token, user object) persisted to localStorage
- **React Router**: Declarative routing with protected route wrappers
- **Axios**: HTTP client with request/response interceptors for JWT injection and 401 handling

### Backend (FastAPI)

- **Async throughout**: Uses Python's `asyncio` for non-blocking I/O on database and AI API calls
- **Dependency injection**: FastAPI's `Depends()` for database sessions and auth validation
- **Structured logging**: `structlog` for JSON-formatted logs with request context
- **Background tasks**: CV embedding runs as a FastAPI `BackgroundTask` after upload — user doesn't wait

### AI Pipeline

| Component | Purpose | Technology |
|-----------|---------|-----------|
| `text_extractor.py` | Parse PDF/DOCX → plain text | PyMuPDF, python-docx |
| `embedder.py` | Chunk text + generate embeddings | LangChain, OpenAI text-embedding-3-small |
| `vector_store.py` | Store/retrieve embedding vectors | FAISS |
| `analyser.py` | Structured CV analysis | GPT-4o + Pydantic output |
| `jd_matcher.py` | CV ↔ JD compatibility scoring | GPT-4o + Pydantic output |
| `chatbot.py` | RAG-powered Q&A | GPT-4o-mini + FAISS retrieval |

---

## Data Flow: CV Upload

```
1. User selects PDF/DOCX in browser
2. Frontend POSTs multipart/form-data to /api/v1/cvs/upload
3. FastAPI validates: file type, MIME type, file size (≤10MB)
4. File saved to server: uploads/{user_id}/{uuid}_{filename}
5. TextExtractor extracts plain text
6. CVDocument saved to PostgreSQL (metadata + extracted_text)
7. Response returned immediately to user (201 Created)
8. BackgroundTask starts: chunk text → generate embeddings → build FAISS index
9. Database updated: cv_documents.is_embedded = true
```

## Data Flow: Chat Message (RAG)

```
1. User types message in chat UI
2. Frontend POSTs to /api/v1/chat/{cv_id}/message
3. ChatService loads FAISS index for (user_id, cv_id)
4. Query is embedded with text-embedding-3-small
5. Similarity search: top-5 most relevant CV chunks retrieved
6. Prompt constructed:
   - System: "You are a career coach. Use ONLY the following CV context to answer."
   - Context: [5 retrieved chunks]
   - History: [last 6 messages]
   - User: [current message]
7. GPT-4o-mini generates response
8. Both user message + AI response saved to chat_history
9. Response returned to frontend
```

---

## Security Architecture

| Concern | Implementation |
|---------|---------------|
| Authentication | JWT (HS256), 24h expiry, signed with SECRET_KEY |
| Password storage | bcrypt, cost factor 12 |
| File validation | Extension + MIME type + size check before any processing |
| User isolation | All DB queries scoped to authenticated user_id |
| API key safety | OpenAI key in environment variable only — never in source or logs |
| CORS | Strict origin allowlist from settings |
| SQL injection | SQLAlchemy ORM with parameterised queries |
| Error leakage | Generic error messages in production; detailed in development only |

---

## Technology Choice Rationale

| Choice | Why not alternative |
|--------|-------------------|
| FastAPI over Django/Flask | Native async, auto OpenAPI docs, Pydantic integration |
| SQLAlchemy 2.0 over Tortoise | Mature, most support, Alembic migrations |
| FAISS over Pinecone | Free, local, no external service dependency |
| LangChain over raw OpenAI | Text splitting, retrieval chains, model abstraction |
| React Query over Redux | Purpose-built for async server state; far less boilerplate |
| Zustand over Context | Minimal, no Provider hell, excellent TypeScript support |
| Vite over CRA | 10x faster HMR, native ESM, modern standard |
