from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    """Single chat message"""
    role: str
    content: str

class ChatRequest(BaseModel):
    """Request schema for AI chat"""
    message: str
    context: Optional[dict] = None
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    """Response schema for AI chat"""
    response: str
    context_used: bool
