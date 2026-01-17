from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.routes.auth import get_password_hash
from app.database import Base
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Créer l'URL de connexion à la base de données
DATABASE_URL = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"

# Créer le moteur de base de données
engine = create_engine(DATABASE_URL)

# Créer les tables si elles n'existent pas
Base.metadata.create_all(bind=engine)

# Créer une session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    # Créer un nouvel utilisateur
    new_user = User(
        username="admin",
        email="admin@example.com",
        hashed_password=get_password_hash("admin123"),
        role="admin"
    )
    
    # Vérifier si l'utilisateur existe déjà
    existing_user = db.query(User).filter(User.username == "admin").first()
    if existing_user:
        print("L'utilisateur 'admin' existe déjà")
    else:
        # Ajouter l'utilisateur à la base de données
        db.add(new_user)
        db.commit()
        print("Utilisateur 'admin' créé avec succès!")
        print("Identifiants de connexion:")
        print("Username: admin")
        print("Password: admin123")

except Exception as e:
    print(f"Une erreur s'est produite: {e}")
    db.rollback()

finally:
    db.close()
