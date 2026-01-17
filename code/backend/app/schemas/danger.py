from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class DangerBase(BaseModel):
    type_danger: str
    lieu: str
    date: str
    heure: str
    personne_concernee: str
    source_danger: str
    description: str
    dommages: str
    declare_par: str
    image_url: Optional[str] = None

class DangerCreate(DangerBase):
    pass

class DangerUpdate(DangerBase):
    status: Optional[str] = None

class Danger(DangerBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
