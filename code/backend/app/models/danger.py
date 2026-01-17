from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.database import Base

class Danger(Base):
    __tablename__ = "dangers"

    id = Column(Integer, primary_key=True, index=True)
    type_danger = Column(String(100))
    lieu = Column(String(200))
    date = Column(String(50))
    heure = Column(String(50))
    personne_concernee = Column(String(200))
    source_danger = Column(String(200))
    description = Column(Text)
    dommages = Column(Text)
    declare_par = Column(String(200))
    image_url = Column(String(500), nullable=True)
    status = Column(String(50), default="en_attente")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
