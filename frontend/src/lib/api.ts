const API_BASE_URL = "http://127.0.0.1:8000";

// ==================== Types ====================

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  description: string;
}

export interface CropAlternative {
  crop: string;
  confidence: number;
}

export interface CropRecommendation {
  recommended_crop: string;
  confidence: number;
  alternatives: CropAlternative[];
  input_summary: {
    N: number;
    P: number;
    K: number;
    temperature: number;
    humidity: number;
    ph: number;
    rainfall: number;
  };
}

export interface CropInput {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface YieldPrediction {
  crop: string;
  state: string;
  season: string;
  area: number;
  predicted_yield: number;
  unit: string;
}

export interface YieldInput {
  Crop: string;
  Crop_Year: number;
  Season: string;
  State: string;
  Area: number;
  Annual_Rainfall: number;
  Fertilizer: number;
  Pesticide: number;
  Avg_Temperature: number;
  Max_Temperature: number;
  Min_Temperature: number;
}

export interface ModelMetadata {
  crop_recommendation: {
    features: string[];
    possible_crops: string[];
    feature_ranges: Record<string, { min: number; max: number; unit: string }>;
  };
  yield_prediction: {
    crops: string[];
    seasons: string[];
    states: string[];
  };
}

export interface ApiError {
  detail: string;
}

// ==================== API Functions ====================

export async function fetchWeather(city: string): Promise<WeatherData> {
  const response = await fetch(
    `${API_BASE_URL}/weather?city=${encodeURIComponent(city)}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to fetch weather");
  }

  return response.json();
}

export async function predictCrop(input: CropInput): Promise<CropRecommendation> {
  const response = await fetch(`${API_BASE_URL}/predict-crop`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to get crop recommendation");
  }

  return response.json();
}

export async function predictYield(input: YieldInput): Promise<YieldPrediction> {
  const response = await fetch(`${API_BASE_URL}/predict-yield`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to get yield prediction");
  }

  return response.json();
}

export async function fetchModelMetadata(): Promise<ModelMetadata> {
  const response = await fetch(`${API_BASE_URL}/model-metadata`);

  if (!response.ok) {
    throw new Error("Failed to fetch model metadata");
  }

  return response.json();
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.ok;
  } catch {
    return false;
  }
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatContext {
  weather?: WeatherData;
  crop_recommendation?: CropRecommendation;
  yield_prediction?: YieldPrediction;
}

export interface ChatResponse {
  response: string;
  context_used: boolean;
}

export async function chatWithAssistant(
  message: string,
  context?: ChatContext,
  history?: ChatMessage[]
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      context,
      history,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to get AI response");
  }

  return response.json();
}
