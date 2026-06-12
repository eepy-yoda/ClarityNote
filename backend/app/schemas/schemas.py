from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Notebook schemas
class NotebookBase(BaseModel):
    name: str

class NotebookCreate(BaseModel):
    activation_code: str

class Notebook(NotebookBase):
    id: str
    owner_id: Optional[str] = None
    activation_code: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Note schemas
class NoteBase(BaseModel):
    title: str

class NoteCreate(NoteBase):
    notebook_id: str
    # When uploading an image, the content will be generated and image URL stored.
    # In a real app we'd use Form data, but for API structure:
    content: Optional[str] = None
    image_url: Optional[str] = None

class Note(NoteBase):
    id: str
    notebook_id: str
    content: Optional[str] = None
    image_url: Optional[str] = None
    pdf_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Event schemas
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: datetime

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
