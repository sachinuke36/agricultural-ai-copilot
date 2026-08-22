import joblib
from typing import Optional, List
from .config import settings

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
        self._load_models()

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
