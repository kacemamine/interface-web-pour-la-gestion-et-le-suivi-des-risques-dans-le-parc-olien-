from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.models.danger import Danger

router = APIRouter()

# ------------------- GET avec filtre par statut -------------------
@router.get("/dangers")
async def get_dangers(status: Optional[str] = Query(None), db: AsyncSession = Depends(get_db)):
    stmt = select(Danger)
    if status:
        stmt = stmt.where(Danger.status == status)
    query = await db.execute(stmt)
    return query.scalars().all()

# ------------------- GET danger par ID -------------------
@router.get("/dangers/{danger_id}")
async def get_danger(danger_id: int, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Danger).where(Danger.id == danger_id))
    danger = query.scalar_one_or_none()
    if not danger:
        raise HTTPException(status_code=404, detail="Danger non trouvé")
    return danger

# ------------------- Mise à jour complète -------------------
class DangerUpdate(BaseModel):
    status: Optional[str] = None
    # ajoute d'autres champs si nécessaire

@router.put("/dangers/{danger_id}")
async def modifier_danger(danger_id: int, danger_update: DangerUpdate, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Danger).where(Danger.id == danger_id))
    danger = query.scalar_one_or_none()
    if not danger:
        raise HTTPException(status_code=404, detail="Danger non trouvé")

    update_data = danger_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        if hasattr(danger, key):
            setattr(danger, key, value if value is not None else "en_attente")

    await db.commit()
    await db.refresh(danger)
    return danger

# ------------------- Mise à jour uniquement du statut -------------------
class StatusUpdate(BaseModel):
    status: str

@router.put("/dangers/{danger_id}/status")
async def update_danger_status(danger_id: int, status_update: StatusUpdate, db: AsyncSession = Depends(get_db)):
    stmt = (
        update(Danger)
        .where(Danger.id == danger_id)
        .values(status=status_update.status)
    )
    result = await db.execute(stmt)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Danger non trouvé")
    await db.commit()
    return {"message": f"Danger {danger_id} mis à jour avec le statut {status_update.status}"}
