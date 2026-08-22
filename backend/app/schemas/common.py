from pydantic import BaseModel
from typing import Optional

class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str
    details: Optional[str] = None

class ModelMetadataResponse(BaseModel):
    """Response schema for model metadata"""
    crop_recommendation: dict
    yield_prediction: dict
