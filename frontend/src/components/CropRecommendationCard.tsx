"use client";

import { useState, useEffect } from "react";
import { predictCrop, CropRecommendation, CropInput, WeatherData } from "@/lib/api";
import { Button } from "@/components/ui";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Alert } from "@/components/ui/Alert";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface CropRecommendationCardProps {
  weatherData?: WeatherData | null;
  onRecommendationFetched?: (data: CropRecommendation) => void;
}

const defaultInputs: CropInput = {
  N: 90,
  P: 42,
  K: 43,
  temperature: 25,
  humidity: 80,
  ph: 6.5,
  rainfall: 200,
};

export default function CropRecommendationCard({ weatherData, onRecommendationFetched }: CropRecommendationCardProps) {
  const [inputs, setInputs] = useState<CropInput>(defaultInputs);
  const [result, setResult] = useState<CropRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  // Auto-fill weather data when available
  useEffect(() => {
    if (weatherData) {
      setInputs(prev => ({
        ...prev,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
      }));
    }
  }, [weatherData]);

  const handleInputChange = (field: keyof CropInput, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await predictCrop(inputs);
      setResult(data);
      setShowForm(false);
      onRecommendationFetched?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get recommendation");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setShowForm(true);
    setError(null);
  };

  const getConfidenceColor = (confidence: number): "green" | "yellow" | "red" => {
    if (confidence >= 70) return "green";
    if (confidence >= 40) return "yellow";
    return "red";
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg
              className="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Crop Recommendation
          </h2>
        </div>
        {result && (
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            New Analysis
          </button>
        )}
      </div>

      {weatherData && showForm && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Weather data auto-filled from {weatherData.city}
          </p>
        </div>
      )}

      {error && <Alert type="error" message={error} className="mb-4" />}

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                N (kg/ha)
              </label>
              <input
                type="number"
                value={inputs.N}
                onChange={(e) => handleInputChange("N", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0" max="200" required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                P (kg/ha)
              </label>
              <input
                type="number"
                value={inputs.P}
                onChange={(e) => handleInputChange("P", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0" max="200" required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                K (kg/ha)
              </label>
              <input
                type="number"
                value={inputs.K}
                onChange={(e) => handleInputChange("K", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0" max="300" required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                pH
              </label>
              <input
                type="number"
                value={inputs.ph}
                onChange={(e) => handleInputChange("ph", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0" max="14" step="0.1" required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Temp (°C) {weatherData && "✓"}
              </label>
              <input
                type="number"
                value={inputs.temperature}
                onChange={(e) => handleInputChange("temperature", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0" max="60" step="0.1" required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Humidity (%) {weatherData && "✓"}
              </label>
              <input
                type="number"
                value={inputs.humidity}
                onChange={(e) => handleInputChange("humidity", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0" max="100" required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Rainfall (mm)
            </label>
            <input
              type="number"
              value={inputs.rainfall}
              onChange={(e) => handleInputChange("rainfall", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0" max="500" required
            />
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Get Recommendation
          </Button>
        </form>
      ) : (
        result && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Recommended Crop</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                {result.recommended_crop}
              </p>
            </div>

            <ProgressBar
              value={result.confidence}
              label="Confidence"
              showValue
              color={getConfidenceColor(result.confidence)}
            />

            {result.alternatives.length > 0 && (
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Alternatives</p>
                <div className="space-y-2">
                  {result.alternatives.map((alt, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                      <span className="text-sm text-zinc-700 dark:text-zinc-300 capitalize">{alt.crop}</span>
                      <span className={`text-sm font-medium ${
                        alt.confidence >= 70 ? "text-green-600" : alt.confidence >= 40 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {alt.confidence}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
