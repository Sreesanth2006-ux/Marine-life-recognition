import json
import os
import uuid
from datetime import datetime

import aiofiles
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import Response
from sqlalchemy.orm import Session

from auth import get_current_user
from config import settings
from database import get_db
from models.db_models import Prediction, User
from models.schemas import PredictResponse, Top3Item
from services import ai_service, model_service, report_service

router = APIRouter(tags=["Predictions"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"}
MAX_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/predict", response_model=PredictResponse, summary="Upload an image and get a prediction")
async def predict(
    file: UploadFile = File(..., description="Marine organism image (JPEG / PNG / WebP, max 10 MB)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ── Validate ──────────────────────────────────────────────────────────────
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(400, f"Unsupported file type '{file.content_type}'. Use JPEG, PNG or WebP.")

    image_bytes = await file.read()
    if len(image_bytes) > MAX_BYTES:
        raise HTTPException(400, "File exceeds 10 MB limit.")

    # ── Save file ─────────────────────────────────────────────────────────────
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = (file.filename or "upload.jpg").rsplit(".", 1)[-1].lower()
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    async with aiofiles.open(file_path, "wb") as fh:
        await fh.write(image_bytes)

    # ── Inference ─────────────────────────────────────────────────────────────
    result = model_service.predict(image_bytes)

    # ── AI description ────────────────────────────────────────────────────────
    ai_info = ai_service.generate_marine_info(result["predicted_class"])

    # ── Persist ───────────────────────────────────────────────────────────────
    pred = Prediction(
        user_id=current_user.id,
        image_path=file_path,
        image_filename=filename,
        predicted_class=result["predicted_class"],
        confidence=result["confidence"],
        top3_predictions=json.dumps(result["top3_predictions"]),
        ai_description=ai_info.get("description", ""),
        scientific_name=ai_info.get("scientific_name"),
        habitat=ai_info.get("habitat"),
        food=ai_info.get("food"),
        lifespan=ai_info.get("lifespan"),
        conservation_status=ai_info.get("conservation_status"),
        interesting_facts=json.dumps(ai_info.get("interesting_facts", [])),
        threats=json.dumps(ai_info.get("threats", [])),
        protection=json.dumps(ai_info.get("protection", [])),
        educational_summary=ai_info.get("educational_summary"),
        created_at=datetime.utcnow(),
    )
    db.add(pred)
    db.commit()
    db.refresh(pred)

    return PredictResponse(
        id=pred.id,
        predicted_class=pred.predicted_class,
        confidence=pred.confidence,
        top3_predictions=[Top3Item(**p) for p in result["top3_predictions"]],
        ai_description=pred.ai_description,
        scientific_name=pred.scientific_name,
        habitat=pred.habitat,
        food=pred.food,
        lifespan=pred.lifespan,
        conservation_status=pred.conservation_status,
        interesting_facts=pred.interesting_facts,
        threats=pred.threats,
        protection=pred.protection,
        educational_summary=pred.educational_summary,
        image_url=f"/uploads/{filename}",
        created_at=pred.created_at,
    )


@router.get("/report/pdf/{prediction_id}", summary="Download PDF report for a prediction")
async def download_pdf(
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

    pdf_bytes = report_service.generate_pdf({
        "predicted_class":     pred.predicted_class,
        "confidence":          pred.confidence,
        "top3_predictions":    pred.top3_predictions,
        "scientific_name":     pred.scientific_name,
        "ai_description":      pred.ai_description,
        "habitat":             pred.habitat,
        "food":                pred.food,
        "lifespan":            pred.lifespan,
        "conservation_status": pred.conservation_status,
        "interesting_facts":   pred.interesting_facts,
        "threats":             pred.threats,
        "protection":          pred.protection,
        "educational_summary": pred.educational_summary,
        "created_at":          pred.created_at.isoformat() if pred.created_at else None,
    })

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="marine_report_{prediction_id}.pdf"'},
    )


@router.get("/report/csv", summary="Download CSV of all your predictions")
async def download_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    preds = (
        db.query(Prediction)
        .filter(Prediction.user_id == current_user.id)
        .order_by(Prediction.created_at.desc())
        .all()
    )
    csv_str = report_service.generate_csv(preds)
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="marine_predictions.csv"'},
    )
