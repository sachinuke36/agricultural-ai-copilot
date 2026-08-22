from typing import Dict, Any, List, Optional
from groq import Groq
from ..core.config import settings
from ..schemas.chat import ChatMessage

class ChatService:
    """Service for AI chat functionality"""

    SYSTEM_PROMPT = """You are an expert Agricultural AI Assistant. You help farmers with:
- Crop selection and recommendations
- Yield optimization strategies
- Weather impact on farming
- Soil management and fertilization
- Pest control and disease management
- Irrigation and water management
- Seasonal farming practices

Provide practical, actionable advice. Be concise but thorough. If the user provides context about their farm (weather, crops, soil conditions), reference it in your responses.

Important guidelines:
- Use metric units (Celsius, mm, kg/ha)
- Consider Indian agricultural practices when relevant
- Provide specific recommendations when possible
- Explain the reasoning behind your advice"""

    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None

    def chat(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None,
        history: Optional[List[ChatMessage]] = None
    ) -> Dict[str, Any]:
        """
        Chat with AI assistant.

        Args:
            message: User message
            context: Optional farm context (weather, crop, yield data)
            history: Conversation history

        Returns:
            Dictionary with AI response

        Raises:
            ValueError: If AI service is not configured
        """
        if self.client is None:
            raise ValueError("AI Assistant not configured")

        system_prompt = self.SYSTEM_PROMPT
        context_used = False

        # Add context to system prompt
        if context:
            context_used = True
            context_parts = []

            if "weather" in context:
                w = context["weather"]
                context_parts.append(
                    f"Current Weather in {w.get('city', 'unknown')}: "
                    f"{w.get('temperature', 'N/A')}°C, {w.get('description', 'N/A')}, "
                    f"Humidity: {w.get('humidity', 'N/A')}%"
                )

            if "crop_recommendation" in context:
                c = context["crop_recommendation"]
                context_parts.append(
                    f"Recommended Crop: {c.get('recommended_crop', 'N/A')} "
                    f"(Confidence: {c.get('confidence', 'N/A')}%)"
                )
                if c.get("input_summary"):
                    s = c["input_summary"]
                    context_parts.append(
                        f"Soil Conditions: N={s.get('N')} kg/ha, P={s.get('P')} kg/ha, "
                        f"K={s.get('K')} kg/ha, pH={s.get('ph')}, "
                        f"Temperature={s.get('temperature')}°C, "
                        f"Humidity={s.get('humidity')}%, Rainfall={s.get('rainfall')}mm"
                    )

            if "yield_prediction" in context:
                y = context["yield_prediction"]
                context_parts.append(
                    f"Yield Prediction: {y.get('crop', 'N/A')} in {y.get('state', 'N/A')}, "
                    f"Expected: {y.get('predicted_yield', 'N/A')} tonnes/hectare"
                )

            if context_parts:
                system_prompt += "\n\nCurrent Farm Context:\n" + "\n".join(context_parts)

        # Build messages
        messages = [{"role": "system", "content": system_prompt}]

        for msg in history or []:
            messages.append({"role": msg.role, "content": msg.content})

        messages.append({"role": "user", "content": message})

        try:
            completion = self.client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=messages,
                temperature=0.7,
                max_tokens=4096,
            )

            return {
                "response": completion.choices[0].message.content,
                "context_used": context_used
            }
        except Exception as e:
            raise RuntimeError(f"AI Assistant error: {str(e)}")


# Global instance
chat_service = ChatService()
