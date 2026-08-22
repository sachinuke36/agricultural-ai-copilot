from fastapi import APIRouter, HTTPException
from ..schemas.crop import CropInput, CropRecommendationResponse
from ..services.crop_service import CropService

router = APIRouter()

@router.post("/predict-crop", response_model=CropRecommendationResponse)
def predict_crop(data: CropInput):
    """Predict the best crop based on soil and climate conditions"""
    try:
        return CropService.predict(data)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
