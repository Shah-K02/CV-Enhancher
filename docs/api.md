# API Reference

## AI CV Assistant — REST API v1

**Base URL (local):** `http://localhost:8000/api/v1`  
**Interactive Docs:** `http://localhost:8000/docs` (Swagger UI)  
**Alternative Docs:** `http://localhost:8000/redoc`

**Authentication:** Bearer token (JWT) — include in `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## Authentication

### POST `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation:**
- `email`: valid email format, must be unique
- `password`: minimum 8 characters

**Response `201 Created`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Smith",
    "email": "john@example.com",
    "created_at": "2026-07-20T17:00:00Z"
  }
}
```

**Errors:**
- `409 Conflict` — Email already registered
- `422 Unprocessable Entity` — Validation failed

---

### POST `/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response `200 OK`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": { ... }
}
```

**Errors:**
- `401 Unauthorized` — Incorrect email or password

---

### GET `/auth/me` 🔒

Get the current authenticated user's profile.

**Response `200 OK`:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Smith",
  "email": "john@example.com",
  "created_at": "2026-07-20T17:00:00Z"
}
```

---

## CV Management

### POST `/cvs/upload` 🔒

Upload a CV file. Accepts `multipart/form-data`.

**Form Fields:**
- `file`: The CV file (PDF or DOCX, max 10MB)

**Response `201 Created`:**
```json
{
  "id": "7f8e9d10-...",
  "filename": "john_smith_cv.pdf",
  "word_count": 452,
  "upload_date": "2026-07-20T17:05:00Z",
  "is_embedded": false
}
```

**Notes:**
- `is_embedded` starts as `false` and is updated to `true` once the FAISS index is built (background task, typically within 5-10 seconds)
- The chat feature requires `is_embedded: true`

**Errors:**
- `413 Request Entity Too Large` — File exceeds 10MB
- `415 Unsupported Media Type` — Not PDF or DOCX

---

### GET `/cvs/` 🔒

List all CVs uploaded by the current user.

**Response `200 OK`:**
```json
[
  {
    "id": "7f8e9d10-...",
    "filename": "john_smith_cv.pdf",
    "word_count": 452,
    "upload_date": "2026-07-20T17:05:00Z",
    "is_embedded": true
  }
]
```

---

### GET `/cvs/{cv_id}` 🔒

Get full details for a specific CV.

**Response `200 OK`:**
```json
{
  "id": "7f8e9d10-...",
  "filename": "john_smith_cv.pdf",
  "word_count": 452,
  "upload_date": "2026-07-20T17:05:00Z",
  "is_embedded": true,
  "extracted_text_preview": "John Smith\njohn@email.com | +44 7700 900000\n\nEXPERIENCE\n..."
}
```

**Errors:**
- `404 Not Found` — CV not found or belongs to another user

---

### DELETE `/cvs/{cv_id}` 🔒

Delete a CV and all associated data (analyses, chat history, FAISS index, uploaded file).

**Response `204 No Content`**

---

## Analysis

### POST `/analysis/{cv_id}/analyse` 🔒

Trigger a full AI analysis of a CV. This is an expensive operation (~10-20 seconds with real OpenAI).

**Response `200 OK`:**
```json
{
  "id": "abc123-...",
  "cv_id": "7f8e9d10-...",
  "overall_score": 67,
  "sections": [
    {
      "name": "Structure & Formatting",
      "score": 70,
      "feedback": [
        "Clear section headings are present",
        "Consistent formatting throughout"
      ],
      "suggestions": [
        "Add a professional summary at the top",
        "Use bullet points consistently across all experience entries"
      ]
    },
    ...
  ],
  "analysis_type": "full",
  "created_at": "2026-07-20T17:10:00Z"
}
```

**Errors:**
- `404 Not Found` — CV not found
- `502 Bad Gateway` — OpenAI API unavailable (real mode only)

---

### GET `/analysis/{cv_id}/history` 🔒

Get all past analyses for a CV.

**Response `200 OK`:**
```json
[
  {
    "id": "abc123-...",
    "overall_score": 67,
    "analysis_type": "full",
    "created_at": "2026-07-20T17:10:00Z",
    "sections": [...]
  }
]
```

---

### POST `/analysis/{cv_id}/match-jd` 🔒

Match a CV against a job description.

**Request Body:**
```json
{
  "job_description": "We are looking for a Software Engineer with 2+ years experience in Python, REST APIs, Docker, and CI/CD pipelines..."
}
```

**Response `200 OK`:**
```json
{
  "match_score": 58,
  "missing_keywords": [
    "Kubernetes",
    "CI/CD",
    "microservices",
    "REST APIs",
    "Agile/Scrum",
    "unit testing"
  ],
  "recommendations": [
    "Add your experience with REST API development to the experience section",
    "Mention any CI/CD pipelines you've used (GitHub Actions, Jenkins, etc.)",
    "Include team collaboration and Agile methodology experience",
    "Add a projects section showcasing relevant technical work"
  ],
  "tailoring_summary": "Your CV has a solid technical foundation but is missing several keywords that ATS systems will scan for this role..."
}
```

---

## Chat

### POST `/chat/{cv_id}/message` 🔒

Send a message to the AI chatbot about a specific CV.

**Request Body:**
```json
{
  "content": "Do I have enough experience for a junior software engineer role?"
}
```

**Response `200 OK`:**
```json
{
  "id": "msg-xyz-...",
  "role": "assistant",
  "content": "Based on your CV, you have approximately 1 year of internship experience...",
  "created_at": "2026-07-20T17:15:00Z"
}
```

**Notes:**
- Requires the CV to have `is_embedded: true`
- Chat history (last 6 messages) is automatically included as context
- Uses RAG to retrieve relevant CV sections before generating the response

**Errors:**
- `400 Bad Request` — CV embeddings not ready yet
- `404 Not Found` — CV not found

---

### GET `/chat/{cv_id}/history` 🔒

Get the full chat history for a CV.

**Response `200 OK`:**
```json
{
  "cv_id": "7f8e9d10-...",
  "messages": [
    {
      "id": "msg-001-...",
      "role": "user",
      "content": "Do I have enough experience?",
      "created_at": "2026-07-20T17:15:00Z"
    },
    {
      "id": "msg-002-...",
      "role": "assistant",
      "content": "Based on your CV...",
      "created_at": "2026-07-20T17:15:02Z"
    }
  ]
}
```

---

### DELETE `/chat/{cv_id}/history` 🔒

Clear all chat history for a CV.

**Response `200 OK`:**
```json
{
  "deleted_count": 14,
  "message": "Chat history cleared successfully"
}
```

---

## Health Check

### GET `/health`

Check system health — no authentication required.

**Response `200 OK`:**
```json
{
  "status": "healthy",
  "database": "connected",
  "ai_mode": "mock",
  "version": "1.0.0"
}
```

**Response `503 Service Unavailable`** (if DB is down):
```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Connection refused"
}
```

---

## Error Response Format

All errors follow a consistent format:

```json
{
  "detail": "Human-readable error message"
}
```

Validation errors (422):
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created successfully |
| 204 | Deleted successfully (no body) |
| 400 | Bad request (e.g., CV not embedded yet) |
| 401 | Unauthorized (missing or invalid JWT) |
| 403 | Forbidden (resource belongs to another user) |
| 404 | Resource not found |
| 409 | Conflict (duplicate email) |
| 413 | File too large |
| 415 | Unsupported media type |
| 422 | Validation error |
| 500 | Internal server error |
| 502 | OpenAI API error |
| 503 | Service unavailable (database down) |
