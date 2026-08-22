// API Types
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
  input_summary: CropInput;
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

// UI Component Types
export interface CardProps {
  title: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}
