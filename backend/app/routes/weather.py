from fastapi import APIRouter, HTTPException, Query
from ..schemas.weather import WeatherResponse
from ..services.weather_service import WeatherService

router = APIRouter()

@router.get("/weather", response_model=WeatherResponse)
async def get_weather(city: str = Query(..., min_length=1, description="City name")):
    """Get current weather for a city"""
    try:
        return await WeatherService.get_weather(city)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ConnectionError as e:
        raise HTTPException(status_code=502, detail=str(e))
