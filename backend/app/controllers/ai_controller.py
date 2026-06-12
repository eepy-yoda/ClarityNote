from fastapi import APIRouter, UploadFile, File, Depends
from app.services import ocr_service, ai_service, pdf_service, notebook_service, note_service
from app.schemas.ai import AIProcessResponse
from app.core.security import get_current_user
from datetime import datetime
import uuid

router = APIRouter()


@router.post("/process-note", response_model=AIProcessResponse)
async def process_note(
    image: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["user_id"]
    print(f"[process-note] user_id={user_id}")

    # 1. OCR
    raw_text = ocr_service.extract_raw_text(image)
    print(f"[process-note] raw_text length: {len(raw_text)}")

    # 2. AI cleanup
    clean_text = ai_service.clean_and_structure_text(raw_text)

    # 3. Generate PDF
    filename = f"note_{uuid.uuid4().hex[:8]}.pdf"
    pdf_url = pdf_service.generate_pdf_from_text(clean_text, filename)
    print(f"[process-note] pdf_url: {pdf_url}")

    # 4. Auto-save to default notebook (create one if needed)
    try:
        default_nb = notebook_service.get_or_create_default_notebook(user_id)
        title = f"Note du {datetime.now().strftime('%d/%m/%Y à %H:%M')}"
        saved_note = note_service.save_processed_note(
            notebook_id=default_nb["id"],
            title=title,
            clean_text=clean_text,
            pdf_url=pdf_url,
        )
        print(f"[process-note] note saved: {saved_note.get('id')}")
    except Exception as e:
        print(f"[process-note] auto-save failed: {e}")
        saved_note = None

    return {
        "raw_text": raw_text,
        "clean_text": clean_text,
        "pdf_url": pdf_url,
    }
