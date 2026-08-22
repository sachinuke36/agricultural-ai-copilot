import os
import joblib
import httpx
from typing import Optional, List
from .config import settings


def download_from_google_drive(file_id: str, destination: str) -> bool:
    """Download a file from Google Drive"""
    url = f"https://drive.google.com/uc?export=download&id={file_id}"

    print(f"Downloading model to {destination}...")

    try:
        # First request to get confirmation token for large files
        with httpx.Client(follow_redirects=True, timeout=300) as client:
            response = client.get(url)

            # Check if we need to confirm download (large file warning)
            if b"confirm=" in response.content:
                # Extract confirm token and retry
                confirm_url = f"{url}&confirm=t"
                response = client.get(confirm_url)

            # Ensure models directory exists
            os.makedirs(os.path.dirname(destination), exist_ok=True)

            with open(destination, "wb") as f:
                f.write(response.content)

        print(f"Successfully downloaded {destination}")
        return True
    except Exception as e:
        print(f"Error downloading from Google Drive: {e}")
        return False


class MLModels:
    """Singleton class to manage ML model loading and access"""

    _instance: Optional["MLModels"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self.crop_model = None
        self.yield_model = None
        self.crop_classes: List[str] = []
        self.yield_crops: List[str] = []
        self.yield_seasons: List[str] = []
        self.yield_states: List[str] = []
        self._ensure_models_exist()
        self._load_models()

    def _ensure_models_exist(self):
        """Download models from Google Drive if they don't exist locally"""
        # Download crop model if needed
        if not os.path.exists(settings.CROP_MODEL_PATH):
            print("Crop model not found locally, downloading from Google Drive...")
            download_from_google_drive(
                settings.CROP_MODEL_GDRIVE_ID,
                settings.CROP_MODEL_PATH
            )

        # Download yield model if needed
        if not os.path.exists(settings.YIELD_MODEL_PATH):
            print("Yield model not found locally, downloading from Google Drive...")
            download_from_google_drive(
                settings.YIELD_MODEL_GDRIVE_ID,
                settings.YIELD_MODEL_PATH
            )

    def _load_models(self):
        """Load ML models and extract metadata"""
        try:
            self.crop_model = joblib.load(settings.CROP_MODEL_PATH)
            self.crop_classes = list(self.crop_model.classes_)
            print(f"Loaded crop model with {len(self.crop_classes)} classes")
        except Exception as e:
            print(f"Error loading crop model: {e}")

        try:
            self.yield_model = joblib.load(settings.YIELD_MODEL_PATH)
            self._extract_yield_categories()
            print(f"Loaded yield model with {len(self.yield_crops)} crops")
        except Exception as e:
            print(f"Error loading yield model: {e}")

    def _extract_yield_categories(self):
        """Extract categorical values from yield model preprocessor"""
        if self.yield_model is None:
            return

        try:
            preprocessor = self.yield_model.named_steps['preprocessor']
            for name, transformer, cols in preprocessor.transformers_:
                if name == 'categorical':
                    self.yield_crops = [c.strip() for c in transformer.categories_[0]]
                    self.yield_seasons = [s.strip() for s in transformer.categories_[1]]
                    self.yield_states = [s.strip() for s in transformer.categories_[2]]
        except Exception as e:
            print(f"Error extracting yield categories: {e}")

# Global instance
ml_models = MLModels()
