from typing import Any, List
import socket
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import engine, Base


def get_allowed_origins() -> List[str]:
    # Liste de base avec localhost
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    try:
        # Obtenir toutes les adresses IP de la machine
        hostname = socket.gethostname()
        ip_addresses = []
        
        # Obtenir l'adresse IP principale
        primary_ip = socket.gethostbyname(hostname)
        ip_addresses.append(primary_ip)
        
        # Obtenir toutes les adresses IP
        for info in socket.getaddrinfo(hostname, None):
            ip = info[4][0]
            if ip not in ip_addresses and not ip.startswith('fe80:'):  # Exclure les IPv6 link-local
                ip_addresses.append(ip)
                
        # Ajouter les IPs connues
        known_ips = [
            "192.168.200.61",
            "192.168.200.82",
            "192.168.137.1",  # Ajout de la nouvelle IP
        ]
        ip_addresses.extend(known_ips)
        
        # Ajouter toutes les IPs trouvées à la liste des origines
        for ip in ip_addresses:
            if ip and not ip.startswith('fe80:'):  # Vérifier que l'IP est valide
                origins.append(f"http://{ip}:3000")
                
        # Ajouter les patterns pour les réseaux locaux courants
        network_patterns = [
            "http://192.168.*:3000",
            "http://172.16.*:3000",
            "http://172.17.*:3000",
            "http://172.18.*:3000",
            "http://172.19.*:3000",
            "http://172.20.*:3000",
            "http://172.21.*:3000",
            "http://172.22.*:3000",
            "http://10.*:3000"
        ]
        origins.extend(network_patterns)
        
    except Exception as e:
        print(f"Warning: Error getting IP addresses: {e}")
        # En cas d'erreur, autoriser toutes les origines
        origins = ["*"]
    
    return origins

# Application FastAPI
app = FastAPI(
    title="API de Gestion des Dangers",
    description="API pour la gestion des dangers et des risques",
    version="1.0.0"
)

# Import des routes
from app.routes import dangers, auth, statistiques, modifier_danger
from fastapi.staticfiles import StaticFiles
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(dangers.router, prefix="/api/dangers", tags=["dangers"])
app.include_router(statistiques.router, prefix="/api", tags=["statistiques"])
app.include_router(modifier_danger.router, prefix="/api", tags=["modifier_danger"])
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.on_event("startup")
async def startup() -> None:
    # Créer les tables au démarrage
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Origines CORS autorisées:", get_allowed_origins())

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

# Add security headers middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response
@app.middleware("http")
async def add_cors_to_uploads(request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/uploads"):
        response.headers["Access-Control-Allow-Origin"] = "*"
    return response


# Route racine
@app.get("/")
async def root():
    return {
        "message": "Bienvenue sur l'API de Gestion des Dangers",
        "version": "1.0.0",
        "status": "active"
    }
