# Deployment Guide

## AI CV Assistant — Production Deployment

**Version:** 1.0  
**Last Updated:** July 2026

---

## Architecture Overview

| Service | Platform | Cost (Starter) |
|---------|---------|----------------|
| Frontend | Vercel | Free tier |
| Backend API | Railway | ~$5/month |
| PostgreSQL | Railway (managed) | ~$5/month |
| File Storage | Server disk (Railway) | Included |
| Domain | Namecheap / Cloudflare | ~$10/year |

---

## Prerequisites

- [ ] GitHub account with the repository pushed
- [ ] Vercel account (free) → https://vercel.com
- [ ] Railway account (free trial) → https://railway.app
- [ ] OpenAI API key → https://platform.openai.com

---

## Part 1: Deploy PostgreSQL on Railway

1. Go to [railway.app](https://railway.app) and create a new project
2. Click **"Add Service"** → **"Database"** → **"PostgreSQL"**
3. Railway will provision a PostgreSQL 15 instance
4. Click the database service → **"Variables"** tab
5. Copy the `DATABASE_URL` connection string (format: `postgresql://...`)

> [!NOTE]
> Convert the URL from `postgresql://` to `postgresql+asyncpg://` for SQLAlchemy async compatibility.

---

## Part 2: Deploy Backend on Railway

### 2.1 Create the Backend Service

1. In your Railway project, click **"Add Service"** → **"GitHub Repo"**
2. Select your repository
3. Set **"Root Directory"** to `backend`
4. Railway will auto-detect Python and use the `Dockerfile`

### 2.2 Configure Environment Variables

In Railway → Backend service → **"Variables"** tab, add:

```
DATABASE_URL=postgresql+asyncpg://postgres:password@host:5432/railway
SECRET_KEY=generate-a-random-64-char-string-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
OPENAI_API_KEY=sk-your-key-here
MOCK_AI_MODE=false
MAX_UPLOAD_SIZE_MB=10
UPLOAD_DIR=uploads
FAISS_DIR=faiss_indexes
CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
ENVIRONMENT=production
LOG_LEVEL=INFO
```

**Generate a secure SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 2.3 Run Database Migrations

After deployment, open the Railway shell:
```bash
alembic upgrade head
```

Or add this as the start command:
```
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 2.4 Verify Backend

Visit `https://your-backend.railway.app/api/v1/health` — should return:
```json
{"status": "healthy", "database": "connected"}
```

Visit `https://your-backend.railway.app/docs` for the interactive API documentation.

---

## Part 3: Deploy Frontend on Vercel

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**
2. Import your GitHub repository
3. Set **"Root Directory"** to `frontend`
4. Set **"Framework Preset"** to `Vite`

### 3.2 Configure Environment Variables

In Vercel → Project → **"Settings"** → **"Environment Variables"**:

```
VITE_API_URL=https://your-backend.railway.app
```

### 3.3 Deploy

Click **"Deploy"**. Vercel will:
1. Run `npm install`
2. Run `npm run build`
3. Serve the `dist/` folder via its global CDN

### 3.4 Custom Domain (Optional)

In Vercel → **"Domains"** tab, add your custom domain and follow the DNS configuration instructions.

---

## Part 4: Post-Deployment Verification

### Manual Checklist

- [ ] `GET /health` returns `{"status": "healthy"}`
- [ ] Register a new user account
- [ ] Upload a PDF CV
- [ ] Trigger an AI analysis
- [ ] Start a chat session
- [ ] Match CV against a sample JD
- [ ] Check that data persists after page refresh

### Monitoring

Railway provides basic metrics (CPU, memory, logs) in the dashboard.

For production monitoring, consider adding:
- **Sentry** for error tracking (free tier available)
- **Uptime Robot** for availability monitoring (free)

---

## Part 5: Local Development vs Production Differences

| Aspect | Development | Production |
|--------|-------------|-----------|
| `MOCK_AI_MODE` | `true` (no API key needed) | `false` |
| `ENVIRONMENT` | `development` | `production` |
| Error details | Full stacktrace in response | Generic message only |
| CORS origins | `localhost:5173` | Your Vercel domain |
| Database | Local Docker PostgreSQL | Railway managed PostgreSQL |
| File storage | Local `uploads/` folder | Railway persistent disk |
| Log format | Human-readable | JSON structured |

---

## Part 6: Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|---------|---------|-------------|
| `DATABASE_URL` | ✅ | — | PostgreSQL async connection string |
| `SECRET_KEY` | ✅ | — | JWT signing key (min 32 chars) |
| `ALGORITHM` | ❌ | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ❌ | `1440` | Token lifetime (24h) |
| `OPENAI_API_KEY` | ⚠️ | `""` | Required when `MOCK_AI_MODE=false` |
| `MOCK_AI_MODE` | ❌ | `true` | Use mock AI responses |
| `MAX_UPLOAD_SIZE_MB` | ❌ | `10` | Max CV file size |
| `UPLOAD_DIR` | ❌ | `uploads` | File storage directory |
| `FAISS_DIR` | ❌ | `faiss_indexes` | Vector index directory |
| `CORS_ORIGINS` | ❌ | `["http://localhost:5173"]` | Allowed CORS origins (JSON array) |
| `ENVIRONMENT` | ❌ | `development` | `development` or `production` |
| `LOG_LEVEL` | ❌ | `INFO` | Logging level |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|---------|---------|-------------|
| `VITE_API_URL` | ✅ | `http://localhost:8000` | Backend API base URL |

---

## Rollback Procedure

### Backend Rollback
Railway supports instant rollback to previous deployments:
1. Railway Dashboard → Deployments tab
2. Click the previous deployment → **"Rollback"**

### Database Rollback
```bash
# Rollback one migration
alembic downgrade -1

# Rollback to specific revision
alembic downgrade abc123
```

> [!CAUTION]
> Always back up the database before running migrations in production:
> ```bash
> pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
> ```
