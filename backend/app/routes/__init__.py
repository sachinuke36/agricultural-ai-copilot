from fastapi import APIRouter
from .crop import router as crop_router
from .yield_pred import router as yield_router
from .weather import router as weather_router
from .chat import router as chat_router
from .metadata import router as metadata_router

api_router = APIRouter()

api_router.include_router(crop_router, tags=["Crop Recommendation"])
api_router.include_router(yield_router, tags=["Yield Prediction"])
api_router.include_router(weather_router, tags=["Weather"])
api_router.include_router(chat_router, tags=["AI Assistant"])
api_router.include_router(metadata_router, tags=["Metadata"])
