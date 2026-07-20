from uuid import UUID
from datetime import datetime
from typing import List
from pydantic import BaseModel

class ChatMessageRequest(BaseModel):
    content: str
    cv_id: UUID

class ChatMessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatHistoryResponse(BaseModel):
    cv_id: UUID
    messages: List[ChatMessageResponse]
