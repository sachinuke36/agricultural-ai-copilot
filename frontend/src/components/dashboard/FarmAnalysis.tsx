"use client";

import { WeatherData, CropRecommendation, YieldPrediction } from "@/types";
import { Badge } from "@/components/ui";

interface FarmAnalysisProps {
  weather: WeatherData | null;
  cropRecommendation: CropRecommendation | null;
  yieldPrediction: YieldPrediction | null;
}

export default function FarmAnalysis({ weather, cropRecommendation, yieldPrediction }: FarmAnalysisProps) {
  const hasData = weather || cropRecommendation || yieldPrediction;

  if (!hasData) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <svg
              className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Farm Analysis Summary
          </h2>
        </div>
        <div className="text-center py-8 text-zinc-400 dark:text-zinc-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm">Complete the analysis steps to see your farm summary</p>
          <p className="text-xs mt-2">Weather + Crop Recommendation + Yield Prediction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl shadow-lg border border-indigo-200 dark:border-indigo-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
          <svg
            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Farm Analysis Summary
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Your personalized agricultural insights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weather Summary */}
        {weather && (
          <div className="bg-white/60 dark:bg-zinc-800/60 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Weather</span>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {Math.round(weather.temperature)}°C
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
              {weather.description} in {weather.city}
            </p>
          </div>
        )}

        {/* Crop Recommendation Summary */}
        {cropRecommendation && (
          <div className="bg-white/60 dark:bg-zinc-800/60 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Recommended</span>
              <Badge variant={cropRecommendation.confidence >= 70 ? "success" : cropRecommendation.confidence >= 40 ? "warning" : "error"}>
                {cropRecommendation.confidence}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 capitalize">
              {cropRecommendation.recommended_crop}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              +{cropRecommendation.alternatives.length} alternatives
            </p>
          </div>
        )}

        {/* Yield Prediction Summary */}
        {yieldPrediction && (
          <div className="bg-white/60 dark:bg-zinc-800/60 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Yield</span>
              <Badge variant="default">{yieldPrediction.crop}</Badge>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {yieldPrediction.predicted_yield.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {yieldPrediction.unit}
            </p>
          </div>
        )}
      </div>

      {/* Analysis Insights */}
      {(weather && cropRecommendation) && (
        <div className="mt-4 p-4 bg-white/40 dark:bg-zinc-800/40 rounded-lg">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Key Insights</h3>
          <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            {weather.humidity > 70 && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                High humidity ({weather.humidity}%) - Good for {cropRecommendation.recommended_crop}
              </li>
            )}
            {cropRecommendation.confidence >= 80 && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                High confidence recommendation - Ideal growing conditions
              </li>
            )}
            {yieldPrediction && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                Expected total production: {(yieldPrediction.predicted_yield * yieldPrediction.area).toLocaleString()} tonnes
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
