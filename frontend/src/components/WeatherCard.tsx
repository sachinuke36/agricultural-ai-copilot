"use client";

import { useState } from "react";
import { fetchWeather, WeatherData } from "@/lib/api";
import { Button } from "@/components/ui";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Alert } from "@/components/ui/Alert";

interface WeatherCardProps {
  onWeatherFetched?: (data: WeatherData) => void;
}

export default function WeatherCard({ onWeatherFetched }: WeatherCardProps) {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const data = await fetchWeather(city.trim());
      setWeather(data);
      onWeatherFetched?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes("rain")) return "🌧️";
    if (desc.includes("cloud")) return "☁️";
    if (desc.includes("sun") || desc.includes("clear")) return "☀️";
    if (desc.includes("snow")) return "❄️";
    if (desc.includes("thunder")) return "⛈️";
    if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
    return "🌤️";
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <svg
            className="w-6 h-6 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Weather
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !city.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? <LoadingSpinner size="sm" /> : "Search"}
          </Button>
        </div>
      </form>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {weather && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {weather.city}, {weather.country}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 capitalize flex items-center gap-2">
                <span className="text-2xl">{getWeatherIcon(weather.description)}</span>
                {weather.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                {Math.round(weather.temperature)}°C
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Feels like {Math.round(weather.feels_like)}°C
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <div className="text-center p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {weather.humidity}%
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Humidity</p>
            </div>
            <div className="text-center p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {weather.pressure}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">hPa</p>
            </div>
            <div className="text-center p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {weather.wind_speed}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">m/s</p>
            </div>
          </div>
        </div>
      )}

      {!weather && !error && !loading && (
        <div className="text-center py-6 text-zinc-400 dark:text-zinc-500">
          <p className="text-sm">Enter a city to get weather data</p>
        </div>
      )}
    </div>
  );
}
