from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # ── Security ──────────────────────────────────────────
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # ── Gemini AI ─────────────────────────────────────────
    GEMINI_API_KEY: str = ""

    # ── Model ─────────────────────────────────────────────
    MODEL_PATH: str = "ml/marine_model.keras"
    CLASS_INDICES_PATH: str = "ml/class_indices.json"
    IMAGE_SIZE: int = 224
    # "divide" → img / 255.0  |  "mobilenet" → mobilenet_v2.preprocess_input
    PREPROCESS_MODE: str = "divide"

    # ── Database ──────────────────────────────────────────
    DATABASE_URL: str = "sqlite:///./marine.db"

    # ── Storage ───────────────────────────────────────────
    UPLOAD_DIR: str = "uploads"

    # ── Fallback class labels (used when class_indices.json is absent) ──
    DEFAULT_CLASSES: List[str] = [
        "Clams", "Corals", "Crabs", "Dolphin", "Eel", "Fish",
        "Jelly Fish", "Lobster", "Nudibranchs", "Octopus", "Otter",
        "Penguin", "Pufferfish", "Sea Rays", "Sea Urchins", "Seahorse",
        "Seal", "Sharks", "Shrimp", "Squid", "Starfish",
        "Turtle_Tortoise", "Whale",
    ]

    class Config:
        env_file = ".env"


settings = Settings()
