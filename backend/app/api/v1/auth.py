from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import SessionLocal
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.auth import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: UserRegisterRequest, db: AsyncSession = Depends(get_db)):
    user = await AuthService.register(db, request)
    access_token = AuthService.create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=TokenResponse)
async def login(request: UserLoginRequest, db: AsyncSession = Depends(get_db)):
    user = await AuthService.authenticate(db, request)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = AuthService.create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
