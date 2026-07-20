from typing import AsyncGenerator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from jose import jwt, JWTError
import structlog

from app.db.session import SessionLocal
from app.config import get_settings
from app.services.auth_service import AuthService
from app.models.user import User
from app.db.base import Base

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)
settings = get_settings()
logger = structlog.get_logger()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session

async def get_current_user_optional(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> Optional[User]:
    if not token:
        return None
    try:
        payload = AuthService.decode_token(token)
        user_id = payload.get("sub")
        if not user_id:
            return None
        # In a real app we'd fetch the user from DB
        from sqlalchemy import select
        from app.models.user import User
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalars().first()
    except Exception as e:
        logger.error("token_validation_error", error=str(e))
        return None

async def get_current_user(user: Optional[User] = Depends(get_current_user_optional)) -> User:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
