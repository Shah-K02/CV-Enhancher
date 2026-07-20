from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.config import get_settings
from app.models.user import User
from app.schemas.auth import UserRegisterRequest, UserLoginRequest

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()

class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain: str, hashed: str) -> bool:
        return pwd_context.verify(plain, hashed)

    @staticmethod
    def create_access_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

    @staticmethod
    def decode_token(token: str) -> dict:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])

    @staticmethod
    async def register(db: AsyncSession, request: UserRegisterRequest) -> User:
        result = await db.execute(select(User).where(User.email == request.email))
        if result.scalars().first():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        
        user = User(
            name=request.name,
            email=request.email,
            password_hash=AuthService.hash_password(request.password)
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def authenticate(db: AsyncSession, request: UserLoginRequest) -> User | None:
        result = await db.execute(select(User).where(User.email == request.email))
        user = result.scalars().first()
        if not user or not AuthService.verify_password(request.password, user.password_hash):
            return None
        return user
