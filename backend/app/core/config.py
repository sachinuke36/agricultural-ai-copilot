import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings loaded from environment variables"""

    # API Keys
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # CORS Settings
    CORS_ORIGINS: list = ["http://localhost:3000"]

    # Model Paths
    CROP_MODEL_PATH: str = "models/crop_recommendation_model.pkl"
    YIELD_MODEL_PATH: str = "models/yield_prediction.pkl"

    # API Settings
    API_TITLE: str = "Agricultural AI Copilot"
    API_DESCRIPTION: str = "ML-powered agriculture recommendation and yield prediction API"
    API_VERSION: str = "1.0.0"

settings = Settings()
