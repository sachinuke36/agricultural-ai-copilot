from pydantic import BaseModel, Field

class YieldInput(BaseModel):
    """Input schema for yield prediction"""
    Crop: str = Field(..., description="Crop type")
    Crop_Year: int = Field(..., ge=1990, le=2030, description="Year of cultivation")
    Season: str = Field(..., description="Season (Kharif, Rabi, etc.)")
    State: str = Field(..., description="State in India")
    Area: float = Field(..., ge=0, description="Area in hectares")
    Annual_Rainfall: float = Field(..., ge=0, description="Annual rainfall in mm")
    Fertilizer: float = Field(..., ge=0, description="Fertilizer used (kg/ha)")
    Pesticide: float = Field(..., ge=0, description="Pesticide used (kg/ha)")
    Avg_Temperature: float = Field(..., description="Average temperature (C)")
    Max_Temperature: float = Field(..., description="Maximum temperature (C)")
    Min_Temperature: float = Field(..., description="Minimum temperature (C)")

class YieldPredictionResponse(BaseModel):
    """Response schema for yield prediction"""
    crop: str
    state: str
    season: str
    area: float
    predicted_yield: float
    unit: str = "tonnes/hectare"
