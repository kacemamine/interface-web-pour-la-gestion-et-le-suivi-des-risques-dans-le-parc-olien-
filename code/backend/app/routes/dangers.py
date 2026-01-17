from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
import mysql.connector
import os
from typing import List, Optional

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

# Config MySQL
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="123456",
        database="dangers_db",
        autocommit=True
    )

db = get_db_connection()
cursor = db.cursor(dictionary=True)

# Function to check and reconnect if needed
def ensure_connection():
    global db, cursor
    try:
        db.ping(reconnect=True, attempts=3, delay=5)
    except mysql.connector.Error as err:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@router.post("", status_code=201)
async def ajouter_danger(
    type_danger: str = Form(...),
    lieu: str = Form(...),
    date: str = Form(...),
    heure: str = Form(...),
    personne_concernee: str = Form(...),
    source_danger: str = Form(...),
    description: str = Form(...),
    dommages: str = Form(...),
    declarant: str = Form(...),
    image: Optional[UploadFile] = File(None),
    status: str = Form(default="en_attente")
):
    try:
        print("Données reçues:")
        print(f"type_danger: {type_danger}")
        print(f"lieu: {lieu}")
        print(f"date: {date}")
        print(f"heure: {heure}")
        print(f"personne_concernee: {personne_concernee}")
        print(f"source_danger: {source_danger}")
        print(f"description: {description}")
        print(f"dommages: {dommages}")
        print(f"declarant: {declarant}")
        print(f"status: {status}")

        # Validate inputs
        if not all([type_danger, lieu, date, heure, personne_concernee, source_danger, description, dommages, declarant]):
            missing_fields = [field for field, value in {
                'type_danger': type_danger,
                'lieu': lieu,
                'date': date,
                'heure': heure,
                'personne_concernee': personne_concernee,
                'source_danger': source_danger,
                'description': description,
                'dommages': dommages,
                'declarant': declarant
            }.items() if not value]
            raise HTTPException(status_code=400, detail=f"Champs manquants: {', '.join(missing_fields)}")

        # Validate status
        if status not in ["en_attente", "corrige"]:
            status = "en_attente"
            
        # Validate file type if image is provided
        if image and not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Le fichier doit être une image")

        image_path = None
        if image:
            filename = image.filename
            image_path = os.path.join(UPLOAD_FOLDER, filename)
            with open(image_path, "wb") as buffer:
                buffer.write(await image.read())

        sql = """
            INSERT INTO dangers (type_danger, lieu, date, heure, personne_concernee, source_danger, description, dommages, declarant, image, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (type_danger, lieu, date, heure, personne_concernee, source_danger, description, dommages, declarant, image_path, 'en_attente'))
        db.commit()
        return {"message": "Danger ajouté avec succès", "status": "success"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Erreur lors de l'ajout")


@router.get("", response_model=List[dict])
async def lister_dangers(token: str = Depends(oauth2_scheme)):
    try:
        ensure_connection()
        cursor.execute("SELECT * FROM dangers")
        dangers = cursor.fetchall()
        return dangers
    except Exception as e:
        print(f"Erreur lors de la récupération des dangers: {e}")
        raise HTTPException(
            status_code=500,
            detail="Erreur lors de la récupération des dangers"
        )


@router.put("/{danger_id}")
async def modifier_danger(
    danger_id: int,
    type_danger: str = Form(...),
    lieu: str = Form(...),
    date: str = Form(...),
    heure: str = Form(...),
    personne_concernee: str = Form(...),
    source_danger: str = Form(...),
    description: str = Form(...),
    dommages: str = Form(...),
    declarant: str = Form(...),
    image: Optional[UploadFile] = File(None),
    status: str = Form("en_attente")
):
    try:
        print(f"Modification demandée pour id={danger_id}")
        print(f"Données reçues: type_danger={type_danger}, lieu={lieu}, date={date}, heure={heure}, personne_concernee={personne_concernee}, source_danger={source_danger}, description={description}, dommages={dommages}, declarant={declarant}, status={status}")

        # Vérifier si le danger existe
        cursor.execute("SELECT image FROM dangers WHERE id=%s", (danger_id,))
        old = cursor.fetchone()
        if old is None:
            raise HTTPException(status_code=404, detail="Danger non trouvé")

        image_path = old['image']  # image actuelle par défaut
        if image:
            filename = image.filename
            image_path = os.path.join(UPLOAD_FOLDER, filename)
            print(f"Image reçue : {filename}, sauvegarde sous {image_path}")
            with open(image_path, "wb") as buffer:
                buffer.write(await image.read())
        else:
            print(f"Aucune nouvelle image reçue, on conserve l'ancienne: {image_path}")

        sql = """
            UPDATE dangers SET 
                type_danger=%s, lieu=%s, date=%s, heure=%s, personne_concernee=%s, 
                source_danger=%s, description=%s, dommages=%s, declarant=%s, image=%s, status=%s
            WHERE id=%s
        """
        cursor.execute(sql, (type_danger, lieu, date, heure, personne_concernee, source_danger, description, dommages, declarant, image_path, status, danger_id))
        db.commit()

        print(f"Modification effectuée avec succès pour id={danger_id}")
        return {"message": "Danger modifié avec succès"}
    except Exception as e:
        print(f"Erreur lors de la modification: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la modification")


@router.delete("/{danger_id}")
async def supprimer_danger(danger_id: int):
    try:
        sql = "DELETE FROM dangers WHERE id=%s"
        cursor.execute(sql, (danger_id,))
        db.commit()
        return {"message": "Danger supprimé avec succès"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression")

# ------------------- Mise à jour uniquement du statut -------------------
@router.put("/{danger_id}/status")
async def update_danger_status(danger_id: int, status: str):
    try:
        sql = "UPDATE dangers SET status=%s WHERE id=%s"
        cursor.execute(sql, (status, danger_id))
        db.commit()
        return {"message": f"Statut du danger {danger_id} mis à jour avec succès"}
    except Exception as e:
        print(f"Erreur lors de la mise à jour du statut: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour du statut")
