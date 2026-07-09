from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from auth import get_admin_user
from database import get_db
from models.db_models import Prediction, User

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", summary="Admin dashboard statistics")
def get_stats(
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    total_predictions = db.query(Prediction).count()
    total_users = db.query(User).count()

    # Species distribution
    species_rows = (
        db.query(Prediction.predicted_class, func.count(Prediction.id).label("n"))
        .group_by(Prediction.predicted_class)
        .order_by(func.count(Prediction.id).desc())
        .all()
    )
    predictions_by_species = {row[0]: row[1] for row in species_rows}
    most_predicted = species_rows[0][0] if species_rows else None

    # Daily counts — last 14 days
    today = datetime.utcnow().date()
    predictions_by_date: dict = {}
    for offset in range(13, -1, -1):
        day = today - timedelta(days=offset)
        cnt = db.query(Prediction).filter(
            func.date(Prediction.created_at) == day
        ).count()
        predictions_by_date[day.strftime("%Y-%m-%d")] = cnt

    # Recent predictions
    recent = (
        db.query(Prediction).order_by(Prediction.created_at.desc()).limit(10).all()
    )
    recent_list = [
        {
            "id":              p.id,
            "predicted_class": p.predicted_class,
            "confidence":      round(p.confidence * 100, 1),
            "created_at":      p.created_at.isoformat() if p.created_at else None,
        }
        for p in recent
    ]

    # Users table
    users = db.query(User).order_by(User.created_at.desc()).all()
    users_list = [
        {
            "id":               u.id,
            "username":         u.username,
            "email":            u.email,
            "is_admin":         u.is_admin,
            "prediction_count": db.query(Prediction).filter(Prediction.user_id == u.id).count(),
            "created_at":       u.created_at.isoformat() if u.created_at else None,
        }
        for u in users
    ]

    return {
        "total_predictions":    total_predictions,
        "total_users":          total_users,
        "most_predicted":       most_predicted,
        "predictions_by_species": predictions_by_species,
        "predictions_by_date":  predictions_by_date,
        "recent_predictions":   recent_list,
        "users":                users_list,
    }
