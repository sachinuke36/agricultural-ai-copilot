from fastapi import APIRouter, HTTPException
from ..schemas.chat import ChatRequest, ChatResponse
from ..services.chat_service import chat_service

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    """AI Agriculture Assistant - answers farming questions with context awareness"""
    try:
        return chat_service.chat(
            message=request.message,
            context=request.context,
            history=request.history
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
