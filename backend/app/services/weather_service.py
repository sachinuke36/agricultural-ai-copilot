import httpx
from typing import Dict, Any
from ..core.config import settings

class WeatherService:
    """Service for weather data fetching"""

    OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"

    @staticmethod
    async def get_weather(city: str) -> Dict[str, Any]:
        """
        Get current weather for a city.

        Args:
            city: City name

        Returns:
            Dictionary with weather data

        Raises:
            ValueError: If API key is not configured
            LookupError: If city is not found
            ConnectionError: If weather service is unavailable
        """
        if not settings.OPENWEATHER_API_KEY:
            raise ValueError("Weather service not configured")

        params = {
            "q": city,
            "appid": settings.OPENWEATHER_API_KEY,
            "units": "metric"
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(WeatherService.OPENWEATHER_URL, params=params)

            if response.status_code == 401:
                raise ValueError("Weather API key invalid or not activated")

            if response.status_code == 404:
                raise LookupError(f"City '{city}' not found")

            if response.status_code != 200:
                raise ConnectionError("Weather service unavailable")

            data = response.json()

            return {
                "city": data["name"],
                "country": data["sys"]["country"],
                "temperature": data["main"]["temp"],
                "feels_like": data["main"]["feels_like"],
                "humidity": data["main"]["humidity"],
                "pressure": data["main"]["pressure"],
                "wind_speed": data["wind"]["speed"],
                "description": data["weather"][0]["description"]
            }
        except httpx.RequestError:
            raise ConnectionError("Failed to connect to weather service")
