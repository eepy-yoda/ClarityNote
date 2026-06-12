from fastapi import APIRouter
from app.schemas.schemas import Event
from app.services import event_service
from typing import List

router = APIRouter()

@router.get("/", response_model=List[Event])
def get_events():
    # Leaving events public or can add generic auth
    return event_service.get_all_events()
