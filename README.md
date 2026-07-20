# AI CV Assistant 🤖📄

> **A production-grade AI-powered career tool** that analyses your CV, matches it to job descriptions, and lets you chat with an AI career coach — all backed by GPT-4o and Retrieval-Augmented Generation.

![Dashboard Preview](docs/images/dashboard.png)

---

## ✨ Features

- **🔐 Secure Authentication** — JWT-based auth with bcrypt password hashing
- **📤 CV Upload & Parsing** — Supports PDF and DOCX with automatic text extraction
- **🧠 AI CV Analysis** — Structured feedback on structure, grammar, ATS compatibility, keywords, and achievements
- **🎯 Job Description Matching** — Paste any JD and get a compatibility score with gap analysis
- **💬 RAG-Powered Chatbot** — Ask your CV questions in natural language using Retrieval-Augmented Generation
- **📊 Analysis History** — Track improvements across multiple CV analyses

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 · TypeScript · Vite · Tailwind CSS · React Query · React Router |
| **Backend** | Python 3.11 · FastAPI · Pydantic v2 · SQLAlchemy 2.0 · Alembic |
| **Database** | PostgreSQL 15 |
| **AI / ML** | OpenAI GPT-4o · LangChain · FAISS · text-embedding-3-small |
| **DevOps** | Docker · Docker Compose · GitHub Actions |
| **Hosting** | Vercel (frontend) · Railway (backend + DB) |

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 18+](https://nodejs.org/)
- [Python 3.11+](https://www.python.org/)
- An [OpenAI API key](https://platform.openai.com/) *(optional — app runs in mock mode without it)*

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cv-enhancer.git
cd cv-enhancer
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` and add your OpenAI API key (or leave `MOCK_AI_MODE=true` to run without one).

### 3. Start with Docker Compose

```bash
docker-compose up --build
```

This starts:
- **PostgreSQL** on port `5432`
- **FastAPI backend** on port `8000` → API docs at http://localhost:8000/docs
- **React frontend** on port `5173` → http://localhost:5173

### 4. Run database migrations

```bash
docker-compose exec backend alembic upgrade head
```

---

## 🏗 Project Structure

```
cv-enhancer/
├── backend/          # FastAPI Python API
│   ├── app/
│   │   ├── api/      # Route handlers
│   │   ├── models/   # SQLAlchemy ORM models
│   │   ├── schemas/  # Pydantic request/response models
│   │   ├── services/ # Business logic
│   │   └── ai/       # LangChain + RAG pipeline
│   └── tests/
├── frontend/         # React TypeScript SPA
│   └── src/
│       ├── api/      # Axios API clients
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── store/
└── docs/             # Architecture, API, deployment docs
```

---

## 📚 Documentation

| Doc | Link |
|-----|------|
| Architecture | [docs/architecture.md](docs/architecture.md) |
| API Reference | [docs/api.md](docs/api.md) |
| Database Schema | [docs/database.md](docs/database.md) |
| AI Pipeline | [docs/ai-pipeline.md](docs/ai-pipeline.md) |
| Deployment | [docs/deployment.md](docs/deployment.md) |

Interactive API docs available at `/docs` (Swagger UI) and `/redoc` when the backend is running.

---

## 🧪 Testing

```bash
# Backend — unit & integration tests
cd backend
pip install -r requirements-dev.txt
pytest tests/ -v --cov=app --cov-report=term-missing

# Frontend — component tests
cd frontend
npm run test
```

---

## 🌍 Deployment

See [docs/deployment.md](docs/deployment.md) for full instructions.

| Service | Platform |
|---------|---------|
| Frontend | Vercel (auto-deploy from `main`) |
| Backend API | Railway |
| Database | Railway PostgreSQL |

---

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `SECRET_KEY` | JWT signing secret (min 32 chars) | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | ⚠️ Optional if `MOCK_AI_MODE=true` |
| `MOCK_AI_MODE` | Return mock AI responses (for dev/testing) | ✅ Default: `true` |
| `MAX_UPLOAD_SIZE_MB` | Max CV file size in MB | Default: `10` |

See `backend/.env.example` for the full list.

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

## 👤 Author

Built as a portfolio project demonstrating full-stack AI engineering for graduate software engineering roles.
