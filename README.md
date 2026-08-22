# Agricultural AI Copilot

An intelligent farming assistant that provides AI-powered crop recommendations, yield predictions, real-time weather data, and conversational agricultural guidance.

## Overview

Agricultural AI Copilot is a full-stack application that helps farmers make data-driven decisions. It combines machine learning models with real-time data to provide:

- **Crop Recommendations** - AI-powered suggestions based on soil and climate conditions
- **Yield Predictions** - ML-based forecasting of expected crop yields
- **Weather Integration** - Real-time weather data for informed decision-making
- **AI Assistant** - Conversational interface for agricultural questions

## Features

### Smart Copilot Flow
1. Enter your location to get weather data
2. Provide soil conditions for crop recommendations
3. Get yield predictions for selected crops
4. Chat with AI assistant for personalized advice

### ML Models

**Crop Recommendation Model**
- Algorithm: Random Forest Classifier
- Features: N, P, K, temperature, humidity, pH, rainfall
- Supported Crops: 22 types (rice, wheat, maize, etc.)
- Accuracy: ~99.55%

**Yield Prediction Model**
- Algorithm: Random Forest Regressor (Pipeline with preprocessing)
- Features: Crop, Year, Season, State, Area, Rainfall, Fertilizer, Pesticide, Temperature
- Supported States: 30 Indian states
- Performance: R² ≈ 0.9576, MAE ≈ 11.62, RMSE ≈ 174.87

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐   │
│  │ Weather │ │  Crop   │ │  Yield  │ │  AI Assistant   │   │
│  │  Card   │ │ Recomm. │ │ Predict │ │    (Chat)       │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └───────┬─────────┘   │
│       │           │           │              │              │
│       └───────────┴───────────┴──────────────┘              │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────┼───────────────────────────────────┐
│                     FastAPI Backend                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    API Routes                        │    │
│  │  /weather  /predict-crop  /predict-yield  /chat     │    │
│  └────┬────────────┬──────────────┬────────────┬───────┘    │
│       │            │              │            │             │
│  ┌────┴────┐ ┌─────┴─────┐ ┌─────┴─────┐ ┌────┴────┐       │
│  │Weather  │ │   Crop    │ │   Yield   │ │  Chat   │       │
│  │Service  │ │  Service  │ │  Service  │ │ Service │       │
│  └────┬────┘ └─────┬─────┘ └─────┬─────┘ └────┬────┘       │
│       │            │              │            │             │
│       ▼            ▼              ▼            ▼             │
│  ┌─────────┐ ┌──────────────────────────┐ ┌─────────┐       │
│  │OpenWeather│ │     ML Models (.pkl)     │ │ Groq AI │       │
│  │   API    │ │ RandomForest + Pipeline  │ │  LLM    │       │
│  └──────────┘ └──────────────────────────┘ └─────────┘       │
└──────────────────────────────────────────────────────────────┘
```

## Tech Stack

**Backend**
- FastAPI
- Python 3.11
- scikit-learn 1.6.1
- pandas, numpy
- Groq (LLM integration)

**Frontend**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

**ML Models**
- RandomForestClassifier (Crop Recommendation)
- Pipeline with ColumnTransformer + RandomForestRegressor (Yield Prediction)

## Project Structure

```
agricultural-ai-copilot/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py        # Environment settings
│   │   │   └── ml_models.py     # Model loading
│   │   ├── routes/
│   │   │   ├── crop.py          # Crop recommendation endpoint
│   │   │   ├── yield_pred.py    # Yield prediction endpoint
│   │   │   ├── weather.py       # Weather endpoint
│   │   │   ├── chat.py          # AI assistant endpoint
│   │   │   └── metadata.py      # Model metadata endpoint
│   │   ├── schemas/             # Pydantic models
│   │   └── services/            # Business logic
│   ├── models/
│   │   ├── crop_recommendation_model.pkl
│   │   └── yield_prediction.pkl
│   ├── main.py                  # FastAPI application
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx         # Main dashboard
        │   └── layout.tsx
        ├── components/
        │   ├── ui/              # Reusable UI components
        │   ├── dashboard/       # Dashboard components
        │   ├── WeatherCard.tsx
        │   ├── CropRecommendationCard.tsx
        │   ├── YieldPredictionCard.tsx
        │   └── AIAssistant.tsx
        ├── lib/
        │   └── api.ts           # API client
        └── types/
            └── index.ts         # TypeScript types
```

## Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/weather` | GET | Get weather by city |
| `/predict-crop` | POST | Get crop recommendation |
| `/predict-yield` | POST | Predict crop yield |
| `/chat` | POST | Chat with AI assistant |
| `/model-metadata` | GET | Get model options |

## Environment Variables

### Backend (.env)
```
OPENWEATHER_API_KEY=your_key   # Required for weather
GROQ_API_KEY=your_key          # Required for AI assistant
```

## Model Performance

### Crop Recommendation
- **Model**: RandomForestClassifier
- **Classes**: 22 crops
- **Accuracy**: ~99.55%
- **Features**: N, P, K, temperature, humidity, pH, rainfall

### Yield Prediction
- **Model**: RandomForestRegressor with Pipeline
- **R² Score**: 0.9576
- **MAE**: 11.62
- **RMSE**: 174.87
- **Features**: 11 (categorical + numerical)

## Usage Example

### Crop Recommendation
```python
POST /predict-crop
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 25,
  "humidity": 80,
  "ph": 6.5,
  "rainfall": 200
}
```

### Yield Prediction
```python
POST /predict-yield
{
  "Crop": "Rice",
  "Crop_Year": 2024,
  "Season": "Kharif",
  "State": "West Bengal",
  "Area": 1000,
  "Annual_Rainfall": 1200,
  "Fertilizer": 150,
  "Pesticide": 5,
  "Avg_Temperature": 28,
  "Max_Temperature": 35,
  "Min_Temperature": 22
}
```

## Future Improvements

- Satellite imagery integration for crop health monitoring
- Disease detection from plant images
- Soil sensor integration for real-time data
- Market price predictions
- Irrigation recommendations
- Multi-language support
- Voice assistant integration
- Mobile application

## License

MIT License

---

Built with ML and AI for smarter farming decisions.
