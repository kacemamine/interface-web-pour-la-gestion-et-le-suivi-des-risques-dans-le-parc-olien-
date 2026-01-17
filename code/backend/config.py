class Config:
    # Configuration de base
    SECRET_KEY = "votre_clé_secrète"  # Changez ceci en production
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class ProductionConfig(Config):
    # Configuration pour la production
    SQLALCHEMY_DATABASE_URI = "mysql://user:password@localhost/votre_base_de_donnees"
    DEBUG = False
