from fastapi import APIRouter
from ..schemas.common import ModelMetadataResponse
from ..services.crop_service import CropService
from ..services.yield_service import YieldService

router = APIRouter()

@router.get("/model-metadata", response_model=ModelMetadataResponse)
def get_model_metadata():
    """Get available options for ML model inputs"""
    return {
        "crop_recommendation": CropService.get_metadata(),
        "yield_prediction": YieldService.get_metadata()
    }
