import os
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_current_user
from config import settings
from database import get_db
from models.db_models import Prediction, User
from models.schemas import PredictionOut

router = APIRouter(prefix="/history", tags=["History"])


@router.get("", response_model=List[PredictionOut], summary="List prediction history")
def get_history(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Prediction)
        .filter(Prediction.user_id == current_user.id)
        .order_by(Prediction.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{prediction_id}", response_model=PredictionOut, summary="Get a single prediction")
def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pred = db.query(Prediction).filter(
        Prediction.id == prediction_id,
        Prediction.user_id == current_user.id,
    ).first()
    if not pred:
        raise HTTPException(404, "Prediction not found")
    return pred


@router.delete("/{prediction_id}", summary="Delete a single prediction")
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pred = db.query(Prediction).filter(
        Prediction.id == prediction_id,
        Prediction.user_id == current_user.id,
    ).first()
    if not pred:
        raise HTTPException(404, "Prediction not found")

    if pred.image_path and os.path.exists(pred.image_path):
        try:
            os.remove(pred.image_path)
        except OSError:
            pass

    db.delete(pred)
    db.commit()
    return {"message": "Prediction deleted"}


@router.delete("", summary="Clear all prediction history")
def clear_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    preds = db.query(Prediction).filter(Prediction.user_id == current_user.id).all()
    count = len(preds)
    for p in preds:
        if p.image_path and os.path.exists(p.image_path):
            try:
                os.remove(p.image_path)
            except OSError:
                pass
        db.delete(p)
    db.commit()
    return {"message": f"Deleted {count} prediction(s)"}
