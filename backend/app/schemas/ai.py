from pydantic import BaseModel

class AIProcessResponse(BaseModel):
    raw_text: str
    clean_text: str
    pdf_url: str
