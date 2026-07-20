import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.chat import ChatMessageRequest, ChatMessageResponse, ChatHistoryResponse
from app.services.chat_service import ChatService
from app.services.cv_service import CVService
from app.ai.chatbot import CVChatbot

router = APIRouter()

@router.post("/{cv_id}/message", response_model=ChatMessageResponse)
async def send_message(cv_id: uuid.UUID, request: ChatMessageRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if cv_id != request.cv_id:
        raise HTTPException(status_code=400, detail="CV ID mismatch")
        
    cv = await CVService.get_cv_by_id(db, cv_id, current_user.id)
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
        
    await ChatService.save_message(db, current_user.id, cv_id, "user", request.content)
    
    history = await ChatService.get_chat_history(db, current_user.id, cv_id)
    
    chatbot = CVChatbot()
    bot_response = await chatbot.get_response(request.content, str(current_user.id), str(cv_id), history)
    
    assistant_msg = await ChatService.save_message(db, current_user.id, cv_id, "assistant", bot_response)
    return assistant_msg

@router.get("/{cv_id}/history", response_model=ChatHistoryResponse)
async def get_history(cv_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    msgs = await ChatService.get_chat_history(db, current_user.id, cv_id)
    return {"cv_id": cv_id, "messages": msgs}

@router.delete("/{cv_id}/history")
async def clear_history(cv_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    count = await ChatService.clear_history(db, current_user.id, cv_id)
    return {"deleted_count": count}
