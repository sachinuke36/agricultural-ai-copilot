import numpy as np
import pandas as pd
from typing import Dict, Any
from ..core.ml_models import ml_models
from ..schemas.yield_pred import YieldInput

class YieldService:
    """Service for yield prediction"""

    @staticmethod
    def predict(data: YieldInput) -> Dict[str, Any]:
        """
        Predict crop yield based on agricultural inputs.

        Args:
            data: YieldInput with agricultural parameters

        Returns:
            Dictionary with predicted yield

        Raises:
            ValueError: If model is not available or inputs are invalid
        """
        if ml_models.yield_model is None:
            raise ValueError("Yield prediction model not available")

        # Validate categorical inputs
        if data.Crop not in ml_models.yield_crops:
            raise ValueError(f"Invalid crop. Use /model-metadata for available options.")

        if data.Season not in ml_models.yield_seasons:
            raise ValueError(f"Invalid season. Available: {ml_models.yield_seasons}")

        if data.State not in ml_models.yield_states:
            raise ValueError(f"Invalid state. Use /model-metadata for available options.")

        features = pd.DataFrame([{
            "Crop": data.Crop,
            "Crop_Year": data.Crop_Year,
            "Season": data.Season,
            "State": data.State,
            "Area": data.Area,
            "Annual_Rainfall": data.Annual_Rainfall,
            "Fertilizer": data.Fertilizer,
            "Pesticide": data.Pesticide,
            "Avg_Temperature": data.Avg_Temperature,
            "Max_Temperature": data.Max_Temperature,
            "Min_Temperature": data.Min_Temperature
        }])

        log_prediction = ml_models.yield_model.predict(features)[0]
        predicted_yield = np.expm1(log_prediction)

        return {
            "crop": data.Crop,
            "state": data.State,
            "season": data.Season,
            "area": data.Area,
            "predicted_yield": round(float(predicted_yield), 3),
            "unit": "tonnes/hectare"
        }

    @staticmethod
    def get_metadata() -> Dict[str, Any]:
        """Get yield model metadata"""
        return {
            "crops": ml_models.yield_crops,
            "seasons": ml_models.yield_seasons,
            "states": ml_models.yield_states
        }
