from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class UserRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
