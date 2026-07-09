from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models.db_models import Prediction, User
from models.schemas import ChatRequest, ChatResponse
from services.ai_service import generate_chat_response

router = APIRouter(prefix="/chat", tags=["AI Chat"])


@router.post("", response_model=ChatResponse, summary="Ask the AI a question about a species")
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    species = request.species

    # Resolve species from prediction id if not given directly
    if not species and request.prediction_id:
        pred = db.query(Prediction).filter(
            Prediction.id == request.prediction_id,
            Prediction.user_id == current_user.id,
        ).first()
        if pred:
            species = pred.predicted_class

    if not species:
        species = "marine organism"

    answer = generate_chat_response(species, request.message)
    return ChatResponse(response=answer)
