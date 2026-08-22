"""
Agricultural AI Copilot API

ML-powered agriculture recommendation and yield prediction API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes import api_router

# Create FastAPI application
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)


@app.get("/")
def root():
    """Health check and API information"""
    return {
        "message": "Agricultural AI Copilot API is running",
        "version": settings.API_VERSION,
        "docs": "/docs",
        "endpoints": {
            "health": "/",
            "weather": "/weather?city={city}",
            "crop_recommendation": "/predict-crop",
            "yield_prediction": "/predict-yield",
            "ai_assistant": "/chat",
            "model_metadata": "/model-metadata"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
