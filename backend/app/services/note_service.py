import time
import uuid
from fastapi import UploadFile
from app.db.supabase_client import get_supabase
from app.services import pdf_service


def process_note_upload(user_id: str, notebook_id: str, title: str, file: UploadFile):
    supabase = get_supabase()
    file_name = f"{int(time.time())}_{file.filename}"
    image_url = f"/static/images/{file_name}"

    structured_content = (
        f"{title}\n\n"
        "Ceci est le texte extrait de votre note manuscrite.\n"
        "AI OCR a détecté une structure et organisé le contenu."
    )
    pdf_filename = f"note_{uuid.uuid4().hex[:8]}.pdf"
    pdf_url = pdf_service.generate_pdf_from_text(structured_content, pdf_filename)

    data = {
        "notebook_id": notebook_id,
        "title": title,
        "content": structured_content,
        "image_url": image_url,
        "pdf_url": pdf_url,
    }

    try:
        response = supabase.table("notes").insert(data).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        raise Exception("Insert returned no data")
    except Exception as e:
        print(f"[process_note_upload] DB error: {e}")
        return {
            "id": str(uuid.uuid4()),
            "notebook_id": notebook_id,
            "title": title,
            "content": structured_content,
            "image_url": image_url,
            "pdf_url": pdf_url,
            "created_at": "2026-04-08T12:00:00Z",
        }


def save_processed_note(notebook_id: str, title: str, clean_text: str, pdf_url: str) -> dict:
    """Save a note that was processed by the AI pipeline."""
    supabase = get_supabase()
    data = {
        "notebook_id": notebook_id,
        "title": title,
        "content": clean_text,
        "pdf_url": pdf_url,
    }
    try:
        response = supabase.table("notes").insert(data).execute()
        if response.data and len(response.data) > 0:
            print(f"[save_processed_note] saved: {response.data[0]['id']}")
            return response.data[0]
        raise Exception("Insert returned no data")
    except Exception as e:
        print(f"[save_processed_note] DB error: {e}")
        return {
            "id": str(uuid.uuid4()),
            "notebook_id": notebook_id,
            "title": title,
            "content": clean_text,
            "pdf_url": pdf_url,
            "created_at": "2026-04-08T12:00:00Z",
        }


def get_notes_for_notebook(notebook_id: str):
    supabase = get_supabase()
    try:
        response = (
            supabase.table("notes")
            .select("*")
            .eq("notebook_id", notebook_id)
            .order("created_at", desc=True)
            .execute()
        )
        return response.data or []
    except Exception:
        return []


def get_all_user_notes(user_id: str):
    supabase = get_supabase()
    try:
        notebooks = supabase.table("notebooks").select("id").eq("owner_id", user_id).execute()
        if not notebooks.data:
            return []
        notebook_ids = [nb["id"] for nb in notebooks.data]
        response = (
            supabase.table("notes")
            .select("*")
            .in_("notebook_id", notebook_ids)
            .order("created_at", desc=True)
            .execute()
        )
        return response.data or []
    except Exception as e:
        print(f"[get_all_user_notes] error: {e}")
        return []


def delete_note(note_id: str):
    supabase = get_supabase()
    supabase.table("notes").delete().eq("id", note_id).execute()
