# Contributing to AI CV Assistant

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

## Development Workflow

### Branch Strategy

```
main           ← protected; production-ready code only
development    ← integration branch; merge all features here first
feature/*      ← individual feature branches
fix/*          ← bug fix branches
docs/*         ← documentation-only changes
```

### Steps

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch from `development`:
   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/your-feature-name
   ```
4. **Commit** your changes following the [commit convention](#commit-convention)
5. **Push** to your fork and open a **Pull Request** against `development`

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Dependency updates, build changes |
| `ci` | CI/CD configuration changes |
| `perf` | Performance improvements |

### Examples

```bash
feat(auth): add JWT refresh token endpoint
feat(cv): implement DOCX text extraction with python-docx
fix(ai): handle OpenAI rate limit errors gracefully
docs(api): add request/response examples for /cvs endpoint
refactor(chat): extract RAG retrieval logic into separate class
test(auth): add integration tests for login endpoint
chore(deps): upgrade langchain to 0.2.x
ci: add GitHub Actions workflow for automated testing
```

---

## Code Style

### Backend (Python)

- **Formatter**: Black (`black app/`)
- **Linter**: Ruff (`ruff check app/`)
- **Type hints**: Required on all function signatures
- **Docstrings**: Required on all public classes and functions

```bash
cd backend
black app/ tests/
ruff check app/ tests/ --fix
```

### Frontend (TypeScript)

- **Formatter**: Prettier
- **Linter**: ESLint
- **Types**: No `any` — use proper TypeScript types

```bash
cd frontend
npm run lint
npm run format
```

---

## Testing

All PRs must include tests for new functionality.

```bash
# Backend
cd backend
pytest tests/ -v --cov=app

# Frontend
cd frontend
npm run test
```

**Coverage target**: 80%+ on backend, critical paths on frontend.

---

## Pull Request Guidelines

- PRs should be **small and focused** — one feature/fix per PR
- Include a clear **description** of what changed and why
- All **tests must pass**
- No drop in **code coverage**
- Request a review from a maintainer
