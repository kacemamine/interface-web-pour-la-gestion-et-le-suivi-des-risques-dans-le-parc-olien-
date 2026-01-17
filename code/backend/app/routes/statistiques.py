from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.models.danger import Danger
from sqlalchemy import select, func, extract, case

router = APIRouter()

@router.get("/statistiques")
async def get_statistiques(db: AsyncSession = Depends(get_db)):
    # Total users
    total_users = (await db.execute(select(func.count()).select_from(User))).scalar()
    # Dangers en attente (status == 'en_attente' ou '⚠️')
    dangers_en_attente = (await db.execute(
        select(func.count())
        .select_from(Danger)
        .where(Danger.status.in_(['en_attente', '⚠️']))
    )).scalar() or 0
    
    # Dangers traités (status == 'corrige' ou '✅')
    dangers_traites = (await db.execute(
        select(func.count())
        .select_from(Danger)
        .where(Danger.status.in_(['corrige', '✅']))
    )).scalar() or 0

    # Total dangers est la somme des deux
    total_dangers = dangers_en_attente + dangers_traites

    # Types de danger (group by type_danger)
    types_de_danger_result = await db.execute(select(Danger.type_danger, func.count()).group_by(Danger.type_danger))
    types_de_danger = [
        {"name": row[0], "count": row[1]} for row in types_de_danger_result.fetchall()
    ]

    # Evolution mensuelle (group by mois)
    evolution_result = await db.execute(
        select(
            extract('month', Danger.date).label('mois'),
            func.count().label('total'),
            func.sum(case((Danger.status == 'corrige', 1), else_=0)).label('traites'),
            func.sum(case((Danger.status == 'en_attente', 1), else_=0)).label('enAttente')
        ).group_by(extract('month', Danger.date))
    )
    evolution_mensuelle = [
        {
            "mois": int(row[0]),
            "total": int(row[1]),
            "traites": int(row[2]),
            "enAttente": int(row[3])
        } for row in evolution_result.fetchall()
    ]

    return {
        "total_users": total_users,
        "total_dangers": total_dangers,
        "dangers_en_attente": dangers_en_attente,
        "dangers_traites": dangers_traites,
        "types_de_danger": types_de_danger,
        "evolution_mensuelle": evolution_mensuelle
    }
