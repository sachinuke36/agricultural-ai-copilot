"use client";

import { useState, useEffect } from "react";
import { predictYield, fetchModelMetadata, YieldPrediction, YieldInput, ModelMetadata, CropRecommendation } from "@/lib/api";
import { Button } from "@/components/ui";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Alert } from "@/components/ui/Alert";

interface YieldPredictionCardProps {
  cropRecommendation?: CropRecommendation | null;
  onPredictionFetched?: (data: YieldPrediction) => void;
}

const defaultInputs: YieldInput = {
  Crop: "Rice",
  Crop_Year: 2024,
  Season: "Kharif",
  State: "West Bengal",
  Area: 1000,
  Annual_Rainfall: 1200,
  Fertilizer: 150,
  Pesticide: 5,
  Avg_Temperature: 28,
  Max_Temperature: 35,
  Min_Temperature: 22,
};

export default function YieldPredictionCard({ cropRecommendation, onPredictionFetched }: YieldPredictionCardProps) {
  const [inputs, setInputs] = useState<YieldInput>(defaultInputs);
  const [result, setResult] = useState<YieldPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [metadata, setMetadata] = useState<ModelMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await fetchModelMetadata();
        setMetadata(data);
      } catch {
        console.error("Failed to load metadata");
      } finally {
        setLoadingMetadata(false);
      }
    };
    loadMetadata();
  }, []);

  // Suggest crop from recommendation
  useEffect(() => {
    if (cropRecommendation && metadata) {
      const recommendedCrop = cropRecommendation.recommended_crop;
      // Try to match with yield crops (case-insensitive partial match)
      const matchedCrop = metadata.yield_prediction.crops.find(
        c => c.toLowerCase().includes(recommendedCrop.toLowerCase()) ||
             recommendedCrop.toLowerCase().includes(c.toLowerCase())
      );
      if (matchedCrop) {
        setInputs(prev => ({ ...prev, Crop: matchedCrop }));
      }
    }
  }, [cropRecommendation, metadata]);

  const handleInputChange = (field: keyof YieldInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof defaultInputs[field] === "number" ? parseFloat(value as string) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await predictYield(inputs);
      setResult(data);
      setShowForm(false);
      onPredictionFetched?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get yield prediction");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setShowForm(true);
    setError(null);
  };

  const crops = metadata?.yield_prediction.crops || [];
  const seasons = metadata?.yield_prediction.seasons || [];
  const states = metadata?.yield_prediction.states || [];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Yield Prediction
          </h2>
        </div>
        {result && (
          <button onClick={handleReset} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            New Prediction
          </button>
        )}
      </div>

      {cropRecommendation && showForm && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Using recommended crop: {cropRecommendation.recommended_crop}
          </p>
        </div>
      )}

      {error && <Alert type="error" message={error} className="mb-4" />}

      {loadingMetadata ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" className="text-amber-500" />
        </div>
      ) : showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Crop</label>
              <select
                value={inputs.Crop}
                onChange={(e) => handleInputChange("Crop", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              >
                {crops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Season</label>
              <select
                value={inputs.Season}
                onChange={(e) => handleInputChange("Season", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              >
                {seasons.map(season => <option key={season} value={season}>{season}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">State</label>
              <select
                value={inputs.State}
                onChange={(e) => handleInputChange("State", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              >
                {states.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Year</label>
              <input type="number" value={inputs.Crop_Year} onChange={(e) => handleInputChange("Crop_Year", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="1990" max="2030" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Area (ha)</label>
              <input type="number" value={inputs.Area} onChange={(e) => handleInputChange("Area", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="0" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Rainfall (mm)</label>
              <input type="number" value={inputs.Annual_Rainfall} onChange={(e) => handleInputChange("Annual_Rainfall", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="0" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Fertilizer (kg/ha)</label>
              <input type="number" value={inputs.Fertilizer} onChange={(e) => handleInputChange("Fertilizer", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="0" required />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Pesticide (kg/ha)</label>
              <input type="number" value={inputs.Pesticide} onChange={(e) => handleInputChange("Pesticide", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="0" step="0.1" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Avg Temp (°C)</label>
              <input type="number" value={inputs.Avg_Temperature} onChange={(e) => handleInputChange("Avg_Temperature", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                step="0.1" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Max Temp (°C)</label>
              <input type="number" value={inputs.Max_Temperature} onChange={(e) => handleInputChange("Max_Temperature", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                step="0.1" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Min Temp (°C)</label>
              <input type="number" value={inputs.Min_Temperature} onChange={(e) => handleInputChange("Min_Temperature", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                step="0.1" required />
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full bg-amber-600 hover:bg-amber-700">
            Predict Yield
          </Button>
        </form>
      ) : (
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Predicted Yield</p>
                <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                  {result.predicted_yield.toLocaleString()}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{result.unit}</p>
              </div>
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Total Production</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {(result.predicted_yield * result.area).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">tonnes</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Crop</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{result.crop}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Season</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{result.season}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">State</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{result.state}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Area</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{result.area.toLocaleString()} ha</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
