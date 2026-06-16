from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.routes.auth import get_current_user
from app.models.user import User
import qrcode
import io
import base64
import json
from datetime import datetime
import os

router = APIRouter()

@router.get("/generate-access-qr")
async def generate_access_qr(current_user: User = Depends(get_current_user)):
    """Génère un QR code d'accès pour l'utilisateur actuel"""
    try:
        access_info = {
            "user": current_user.username,
            "role": current_user.role,
            "timestamp": datetime.utcnow().isoformat(),
            "app": "Checklist"
        }
        
        # Créer le QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(json.dumps(access_info))
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convertir en base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        # Sauvegarder aussi dans le dossier QR
        qr_folder = "QR"
        if not os.path.exists(qr_folder):
            os.makedirs(qr_folder)
        
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        
        # Sauvegarder le fichier JSON
        json_path = os.path.join(qr_folder, f"access_info_{timestamp}.json")
        with open(json_path, 'w') as f:
            json.dump(access_info, f, indent=2)
        
        # Sauvegarder l'image QR
        img_path = os.path.join(qr_folder, f"qr_code_{timestamp}.html")
        with open(img_path, 'w') as f:
            f.write(f"""
            <html>
                <head>
                    <title>QR Code d'accès</title>
                </head>
                <body>
                    <img src="data:image/png;base64,{img_str}" />
                    <p>Utilisateur: {current_user.username}</p>
                    <p>Rôle: {current_user.role}</p>
                </body>
            </html>
            """)
        
        return {
            "qr_data_url": f"data:image/png;base64,{img_str}",
            "access_info": access_info
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la génération du QR code: {str(e)}"
        )

@router.post("/generate-user-qr")
async def generate_user_qr(
    username: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Génère un QR code pour un utilisateur spécifique (admin uniquement)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Seuls les admins peuvent générer des QR codes d'utilisateurs"
        )
    
    try:
        user_info = {
            "username": username,
            "app": "Checklist",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Créer le QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(json.dumps(user_info))
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convertir en base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return {
            "qr_code_url": f"data:image/png;base64,{img_str}",
            "access_info": user_info
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la génération du QR code: {str(e)}"
        )
