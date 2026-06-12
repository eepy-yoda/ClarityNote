from fastapi import APIRouter, Depends, UploadFile, File, Form
from app.schemas.schemas import Note
from app.core.security import get_current_user
from app.services import note_service
from typing import List

router = APIRouter()

@router.post("/", response_model=Note)
def create_note(
    title: str = Form(...),
    notebook_id: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    return note_service.process_note_upload(current_user["user_id"], notebook_id, title, file)

@router.get("/notebook/{notebook_id}", response_model=List[Note])
def get_notes(notebook_id: str, current_user: dict = Depends(get_current_user)):
    return note_service.get_notes_for_notebook(notebook_id)

@router.get("/all", response_model=List[Note])
def get_all_notes(current_user: dict = Depends(get_current_user)):
    return note_service.get_all_user_notes(current_user["user_id"])

@router.delete("/{note_id}")
def delete_note(note_id: str, current_user: dict = Depends(get_current_user)):
    note_service.delete_note(note_id)
    return {"message": "Note supprimée"}
