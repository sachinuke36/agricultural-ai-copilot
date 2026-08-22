import numpy as np
from typing import Dict, Any
from ..core.ml_models import ml_models
from ..schemas.crop import CropInput

class CropService:
    """Service for crop recommendation predictions"""

    @staticmethod
    def predict(data: CropInput) -> Dict[str, Any]:
        """
        Predict the best crop based on soil and climate conditions.

        Args:
            data: CropInput with soil and climate parameters

        Returns:
            Dictionary with recommended crop, confidence, and alternatives

        Raises:
            ValueError: If model is not available
        """
        if ml_models.crop_model is None:
            raise ValueError("Crop recommendation model not available")

        features = [[
            data.N,
            data.P,
            data.K,
            data.temperature,
            data.humidity,
            data.ph,
            data.rainfall
        ]]

        probabilities = ml_models.crop_model.predict_proba(features)[0]
        classes = ml_models.crop_model.classes_

        top_indices = np.argsort(probabilities)[::-1][:5]

        recommendations = []
        for i in top_indices:
            recommendations.append({
                "crop": classes[i],
                "confidence": round(float(probabilities[i] * 100), 2)
            })

        return {
            "recommended_crop": classes[top_indices[0]],
            "confidence": round(float(probabilities[top_indices[0]] * 100), 2),
            "alternatives": recommendations[1:],
            "input_summary": {
                "N": data.N,
                "P": data.P,
                "K": data.K,
                "temperature": data.temperature,
                "humidity": data.humidity,
                "ph": data.ph,
                "rainfall": data.rainfall
            }
        }

    @staticmethod
    def get_metadata() -> Dict[str, Any]:
        """Get crop model metadata"""
        return {
            "features": ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"],
            "possible_crops": ml_models.crop_classes,
            "feature_ranges": {
                "N": {"min": 0, "max": 200, "unit": "kg/ha"},
                "P": {"min": 0, "max": 200, "unit": "kg/ha"},
                "K": {"min": 0, "max": 300, "unit": "kg/ha"},
                "temperature": {"min": 0, "max": 60, "unit": "°C"},
                "humidity": {"min": 0, "max": 100, "unit": "%"},
                "ph": {"min": 0, "max": 14, "unit": "pH"},
                "rainfall": {"min": 0, "max": 500, "unit": "mm"}
            }
        }
