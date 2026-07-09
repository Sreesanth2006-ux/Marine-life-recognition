"""
Marine Life Recognition API
============================
FastAPI application entry point.

Run:  uvicorn main:app --reload
Docs: http://localhost:8000/docs
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from database import engine
from models.db_models import Base

# Routers
from auth import router as auth_router
from routers.predict import router as predict_router
from routers.history import router as history_router
from routers.chat import router as chat_router
from routers.admin import router as admin_router

# Services (model loaded on startup)
from services import model_service

# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Marine Life Recognition API",
    description=(
        "AI-powered marine organism classification using CNN deep learning "
        "and Gemini-generated educational explanations."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# For production replace allow_origins=["*"] with your frontend URL(s).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Database ──────────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── Static files ──────────────────────────────────────────────────────────────
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(history_router)
app.include_router(chat_router)
app.include_router(admin_router)


# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    model_service.load_model()
    print("[INFO] Marine Life Recognition API is running!")


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
def root():
    return {
        "name":    "Marine Life Recognition API",
        "version": "1.0.0",
        "docs":    "/docs",
        "status":  "running",
    }


@app.get("/health", tags=["Root"])
def health():
    return {
        "status":       "healthy",
        "model_loaded": model_service.model is not None,
        "classes":      len(model_service.class_indices),
    }
