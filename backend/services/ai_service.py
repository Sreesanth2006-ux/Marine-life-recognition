"""
AI Service
==========
Generates educational marine-biology content via the Gemini API.
Falls back to static placeholder data when the key is absent.
"""

from __future__ import annotations

import json
from typing import Dict, Any

from config import settings


# ── Gemini call ──────────────────────────────────────────────────────────────

def generate_marine_info(species: str) -> Dict[str, Any]:
    """Return structured educational info about *species*."""
    if not settings.GEMINI_API_KEY:
        return _fallback(species)

    try:
        import google.generativeai as genai

        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")

        prompt = f"""
You are an expert marine biologist. Provide comprehensive, accurate, educational
information about the marine organism: "{species}".

Return ONLY a valid JSON object — no markdown, no code fences, no extra text.
Use this exact schema:
{{
  "description": "2–3 sentence overview",
  "scientific_name": "Genus species",
  "habitat": "Detailed habitat description",
  "food": "Diet and feeding behaviour",
  "lifespan": "Average lifespan as a string, e.g. '20–30 years'",
  "conservation_status": "IUCN Red List status",
  "interesting_facts": ["fact 1", "fact 2", "fact 3", "fact 4", "fact 5"],
  "threats": ["threat 1", "threat 2", "threat 3"],
  "protection": ["action 1", "action 2", "action 3"],
  "educational_summary": "2–3 sentences suitable for students"
}}
"""
        response = model.generate_content(prompt)
        text = response.text.strip()

        # Strip accidental markdown fences
        if text.startswith("```"):
            parts = text.split("```")
            text = parts[1]
            if text.startswith("json"):
                text = text[4:]
            text = text.strip()

        return json.loads(text)

    except Exception as exc:
        print(f"[WARNING] Gemini generate_marine_info error: {exc}")
        return _fallback(species)


def generate_chat_response(species: str, question: str) -> str:
    """Answer a user's question about *species* via Gemini."""
    if not settings.GEMINI_API_KEY:
        return (
            f"Detailed AI answers about '{species}' require a configured Gemini API key. "
            "Ask your administrator to add GEMINI_API_KEY to the backend .env file."
        )

    try:
        import google.generativeai as genai

        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")

        prompt = f"""
You are a friendly, expert marine biologist assistant.
The user has identified a "{species}" and asks:

"{question}"

Answer in 2–4 engaging, educational sentences. Be accurate and enthusiastic.
"""
        response = model.generate_content(prompt)
        return response.text.strip()

    except Exception as exc:
        print(f"[WARNING] Gemini chat error: {exc}")
        return "I encountered an issue generating a response. Please try again shortly."


# ── Fallback ─────────────────────────────────────────────────────────────────

def _fallback(species: str) -> Dict[str, Any]:
    return {
        "description": (
            f"The {species} is a fascinating marine organism found in ocean environments worldwide. "
            "It plays an important ecological role in marine food webs and biodiversity. "
            "Configure the Gemini API key in your backend .env for detailed AI-generated information."
        ),
        "scientific_name": "Scientific name unavailable",
        "habitat": "Marine and coastal environments (detailed habitat requires Gemini API key).",
        "food": "Diet information requires Gemini API key.",
        "lifespan": "Lifespan data requires Gemini API key.",
        "conservation_status": "Status requires Gemini API key.",
        "interesting_facts": [
            f"The {species} is an important part of marine ecosystems.",
            "Marine organisms play crucial roles in ocean food webs.",
            "Many marine species are still being actively studied.",
            "Ocean conservation is vital for these species' survival.",
            "Climate change is affecting marine habitats worldwide.",
        ],
        "threats": [
            "Habitat destruction and coastal development",
            "Climate change and ocean warming",
            "Pollution and plastic waste",
        ],
        "protection": [
            "Support marine conservation organisations",
            "Reduce single-use plastic consumption",
            "Choose certified sustainable seafood",
        ],
        "educational_summary": (
            f"The {species} is a remarkable marine organism worth learning about. "
            "Understanding marine life helps us appreciate the importance of ocean conservation. "
            "Add your Gemini API key to unlock fully AI-generated educational content."
        ),
    }
