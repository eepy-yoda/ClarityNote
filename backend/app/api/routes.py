from fastapi import APIRouter
from app.controllers import notebooks, notes, events, ai_controller, auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(notebooks.router, prefix="/notebooks", tags=["notebooks"])
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(ai_controller.router, prefix="/ai", tags=["ai"])
