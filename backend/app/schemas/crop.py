from pydantic import BaseModel, Field
from typing import List

class CropInput(BaseModel):
    """Input schema for crop recommendation"""
    N: float = Field(..., ge=0, le=200, description="Nitrogen content in soil (kg/ha)")
    P: float = Field(..., ge=0, le=200, description="Phosphorus content in soil (kg/ha)")
    K: float = Field(..., ge=0, le=300, description="Potassium content in soil (kg/ha)")
    temperature: float = Field(..., ge=0, le=60, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity (%)")
    ph: float = Field(..., ge=0, le=14, description="Soil pH value")
    rainfall: float = Field(..., ge=0, le=500, description="Rainfall in mm")

class CropAlternative(BaseModel):
    """Alternative crop recommendation"""
    crop: str
    confidence: float

class CropRecommendationResponse(BaseModel):
    """Response schema for crop recommendation"""
    recommended_crop: str
    confidence: float
    alternatives: List[CropAlternative]
    input_summary: dict
