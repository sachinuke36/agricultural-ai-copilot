"use client";

import { useState } from "react";
import Header from "@/components/dashboard/Header";
import FarmAnalysis from "@/components/dashboard/FarmAnalysis";
import WeatherCard from "@/components/WeatherCard";
import CropRecommendationCard from "@/components/CropRecommendationCard";
import YieldPredictionCard from "@/components/YieldPredictionCard";
import AIAssistant from "@/components/AIAssistant";
import { WeatherData, CropRecommendation, YieldPrediction, ChatContext } from "@/types";

export default function Dashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [cropRecommendation, setCropRecommendation] = useState<CropRecommendation | null>(null);
  const [yieldPrediction, setYieldPrediction] = useState<YieldPrediction | null>(null);

  // Build context for AI Assistant
  const chatContext: ChatContext = {};
  if (weather) chatContext.weather = weather;
  if (cropRecommendation) chatContext.crop_recommendation = cropRecommendation;
  if (yieldPrediction) chatContext.yield_prediction = yieldPrediction;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-green-50/30 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Welcome to Your Farm Dashboard
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Get AI-powered insights for smarter farming decisions. Start by checking your weather, then get crop recommendations.
          </p>
        </div>

        {/* Farm Analysis Summary - Always visible at top */}
        <div className="mb-8">
          <FarmAnalysis
            weather={weather}
            cropRecommendation={cropRecommendation}
            yieldPrediction={yieldPrediction}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Weather & Crop */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WeatherCard onWeatherFetched={setWeather} />
              <CropRecommendationCard
                weatherData={weather}
                onRecommendationFetched={setCropRecommendation}
              />
            </div>
            <YieldPredictionCard
              cropRecommendation={cropRecommendation}
              onPredictionFetched={setYieldPrediction}
            />
          </div>

          {/* Right Column - AI Assistant */}
          <div className="lg:col-span-1">
            <AIAssistant context={Object.keys(chatContext).length > 0 ? chatContext : undefined} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Model Accuracy"
            value="99.55%"
            subtext="Crop Recommendation"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="green"
          />
          <StatCard
            label="R² Score"
            value="0.9576"
            subtext="Yield Prediction"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            color="blue"
          />
          <StatCard
            label="Crops"
            value="22"
            subtext="Supported Types"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            color="amber"
          />
          <StatCard
            label="States"
            value="30"
            subtext="Indian States"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            color="purple"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-green-600 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Agricultural AI Copilot
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Powered by Machine Learning | FastAPI | Next.js | Groq AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
  icon,
  color
}: {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  color: "green" | "blue" | "amber" | "purple";
}) {
  const colors = {
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{subtext}</p>
        </div>
      </div>
    </div>
  );
}
