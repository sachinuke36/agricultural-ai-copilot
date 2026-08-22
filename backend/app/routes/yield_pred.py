from fastapi import APIRouter, HTTPException
from ..schemas.yield_pred import YieldInput, YieldPredictionResponse
from ..services.yield_service import YieldService

router = APIRouter()

@router.post("/predict-yield", response_model=YieldPredictionResponse)
def predict_yield(data: YieldInput):
    """Predict crop yield based on agricultural inputs"""
    try:
        return YieldService.predict(data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
