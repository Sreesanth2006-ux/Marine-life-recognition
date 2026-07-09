from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime


# ── Auth ────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ── Predictions ─────────────────────────────────────────────────────────────

class Top3Item(BaseModel):
    class_name: str
    confidence: float


class PredictResponse(BaseModel):
    id: int
    predicted_class: str
    confidence: float
    top3_predictions: List[Top3Item]
    ai_description: Optional[str]
    scientific_name: Optional[str]
    habitat: Optional[str]
    food: Optional[str]
    lifespan: Optional[str]
    conservation_status: Optional[str]
    interesting_facts: Optional[Any]   # list or JSON string
    threats: Optional[Any]
    protection: Optional[Any]
    educational_summary: Optional[str]
    image_url: str
    created_at: datetime


class PredictionOut(BaseModel):
    id: int
    image_filename: str
    predicted_class: str
    confidence: float
    top3_predictions: Optional[str]
    ai_description: Optional[str]
    scientific_name: Optional[str]
    habitat: Optional[str]
    food: Optional[str]
    lifespan: Optional[str]
    conservation_status: Optional[str]
    interesting_facts: Optional[str]
    threats: Optional[str]
    protection: Optional[str]
    educational_summary: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ── Chat ────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    species: Optional[str] = None
    prediction_id: Optional[int] = None


class ChatResponse(BaseModel):
    response: str
