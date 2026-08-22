"use client";

import { useEffect, useState } from "react";
import { checkApiHealth } from "@/lib/api";

export default function Header() {
  const [apiStatus, setApiStatus] = useState<"loading" | "online" | "offline">("loading");

  useEffect(() => {
    const checkStatus = async () => {
      const isOnline = await checkApiHealth();
      setApiStatus(isOnline ? "online" : "offline");
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-500/20">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Agricultural AI Copilot
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Intelligent Farming Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  apiStatus === "online"
                    ? "bg-green-500"
                    : apiStatus === "offline"
                    ? "bg-red-500"
                    : "bg-yellow-500 animate-pulse"
                }`}
              />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {apiStatus === "online"
                  ? "API Online"
                  : apiStatus === "offline"
                  ? "API Offline"
                  : "Checking..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
