import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.main import app
from app.dependencies import get_db
from app.db.base import Base
from app.models.user import User
from app.models.cv_document import CVDocument
from app.services.auth_service import AuthService
import uuid
import os
from unittest.mock import patch, MagicMock

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(TEST_DB_URL, echo=False)
TestingSessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db

@pytest_asyncio.fixture(autouse=True)
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture
async def async_client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client

@pytest_asyncio.fixture
async def test_user():
    async with TestingSessionLocal() as db:
        user = User(
            name="Test User",
            email="test@example.com",
            password_hash=AuthService.hash_password("password123")
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

@pytest.fixture
def auth_headers(test_user):
    token = AuthService.create_access_token({"sub": str(test_user.id)})
    return {"Authorization": f"Bearer {token}"}

@pytest_asyncio.fixture
async def test_cv(test_user):
    async with TestingSessionLocal() as db:
        cv = CVDocument(
            user_id=test_user.id,
            filename="test_cv.pdf",
            file_path="uploads/test_cv.pdf",
            extracted_text="Test CV Content Python SQL",
            word_count=5
        )
        db.add(cv)
        await db.commit()
        await db.refresh(cv)
        # Create dummy file
        os.makedirs("uploads", exist_ok=True)
        with open("uploads/test_cv.pdf", "w") as f:
            f.write("dummy")
        return cv
