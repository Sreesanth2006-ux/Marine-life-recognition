from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # File
    image_path = Column(String, nullable=False)
    image_filename = Column(String, nullable=False)

    # Model output
    predicted_class = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    top3_predictions = Column(Text)          # JSON-encoded list

    # AI generated info
    ai_description = Column(Text)
    scientific_name = Column(String(150))
    habitat = Column(Text)
    food = Column(Text)
    lifespan = Column(String(100))
    conservation_status = Column(String(100))
    interesting_facts = Column(Text)          # JSON-encoded list
    threats = Column(Text)                    # JSON-encoded list
    protection = Column(Text)                 # JSON-encoded list
    educational_summary = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="predictions")
