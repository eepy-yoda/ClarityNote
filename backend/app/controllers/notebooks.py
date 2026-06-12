from fastapi import APIRouter, Depends
from app.schemas.schemas import NotebookCreate, Notebook
from app.core.security import get_current_user
from app.services import notebook_service
from typing import List

router = APIRouter()


@router.post("/activate", response_model=Notebook)
def activate(notebook_in: NotebookCreate, current_user: dict = Depends(get_current_user)):
    print(f"[POST /activate] user={current_user['user_id']!r}, body={notebook_in}")
    return notebook_service.activate_notebook(current_user["user_id"], notebook_in.activation_code)


@router.get("/", response_model=List[Notebook])
def get_notebooks(current_user: dict = Depends(get_current_user)):
    return notebook_service.get_user_notebooks(current_user["user_id"])


@router.get("/my", response_model=List[Notebook])
def get_my_notebooks(current_user: dict = Depends(get_current_user)):
    return notebook_service.get_user_notebooks(current_user["user_id"])
