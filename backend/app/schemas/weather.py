from pydantic import BaseModel

class WeatherResponse(BaseModel):
    """Response schema for weather data"""
    city: str
    country: str
    temperature: float
    feels_like: float
    humidity: int
    pressure: int
    wind_speed: float
    description: str
