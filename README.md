# Checklist - Gestion des dangers

Application web de gestion des dangers et des risques.

Le projet contient:

- un frontend React lance sur le port `3000`;
- un backend FastAPI lance sur le port `8000`;
- une base de donnees MySQL;
- un script Windows `demarrer_services.bat` pour demarrer automatiquement les services et generer un QR code d'acces reseau.

## Fonctionnalites

- Authentification des utilisateurs.
- Tableau de bord de gestion des dangers.
- Ajout, modification, suppression et recherche de dangers.
- Suivi des dangers corriges et en attente.
- Statistiques.
- Gestion des utilisateurs.
- Acces depuis un autre appareil du meme reseau via adresse IP ou QR code.

## Structure du projet

```text
.
+-- demarrer_services.bat
+-- README.md
+-- QR/
+-- uploads/
+-- code/
    +-- backend/
    |   +-- app/
    |   |   +-- main.py
    |   |   +-- database.py
    |   |   +-- models/
    |   |   +-- routes/
    |   |   +-- schemas/
    |   +-- requirements.txt
    |   +-- generate_qr.py
    +-- frontend/
        +-- public/
        +-- src/
        +-- package.json
```

## Prerequis

- Windows.
- Python 3.12 ou version compatible.
- Node.js et npm.
- MySQL.

## Configuration de la base de donnees

Le backend lit la configuration MySQL depuis les variables d'environnement suivantes:

```text
DB_USER=root
DB_PASSWORD=123456
DB_HOST=localhost
DB_NAME=dangers_db
```

Si aucune variable n'est definie, ces valeurs par defaut sont utilisees.

Avant de lancer l'application, creez la base de donnees MySQL:

```sql
CREATE DATABASE dangers_db;
```

Les tables sont creees automatiquement au demarrage du backend par SQLAlchemy.

## Installation

### Backend

Depuis la racine du projet:

```bat
cd code\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend

```bat
cd code\frontend
npm install
```

## Demarrage rapide

Depuis la racine du projet, lancez:

```bat
demarrer_services.bat
```

Le script:

1. libere les ports `3000` et `8000` si necessaire;
2. detecte l'adresse IP active de la machine;
3. genere un QR code d'acces;
4. demarre le backend FastAPI;
5. demarre le frontend React;
6. affiche les adresses locales et reseau.

Exemple:

```text
Frontend:
- Local : http://localhost:3000
- Reseau : http://ADRESSE_IP:3000

Backend:
- Local : http://localhost:8000
- Reseau : http://ADRESSE_IP:8000
```

## Demarrage manuel

### Backend

```bat
cd code\backend
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Test du backend:

```text
http://localhost:8000/
```

Documentation interactive FastAPI:

```text
http://localhost:8000/docs
```

### Frontend

Dans une autre fenetre:

```bat
cd code\frontend
npm start
```

Puis ouvrez:

```text
http://localhost:3000
```

## Acces depuis un autre appareil

Pour acceder a l'application depuis un telephone, une tablette ou un autre PC:

1. Connectez les deux appareils au meme reseau.
2. Lancez `demarrer_services.bat`.
3. Ouvrez l'adresse reseau affichee, par exemple `http://192.168.1.20:3000`.
4. Vous pouvez aussi scanner le QR code genere dans le dossier `QR`.

Le frontend construit automatiquement l'URL de l'API a partir de l'adresse utilisee dans le navigateur. Il n'est donc pas necessaire de modifier les fichiers React quand l'adresse IP change.

## Changer de reseau

Quand vous changez de WiFi, de partage de connexion, de VPN ou de cable reseau, l'adresse IP peut changer.

Pour readapter l'application:

1. Fermez les anciennes fenetres Backend et Frontend.
2. Relancez `demarrer_services.bat`.
3. Utilisez la nouvelle adresse `Reseau` affichee.
4. Regenerez ou scannez le nouveau QR code si besoin.

## Fichiers importants

- `demarrer_services.bat`: demarre le backend, le frontend et affiche l'adresse reseau.
- `code/backend/app/main.py`: point d'entree FastAPI et configuration CORS.
- `code/backend/app/database.py`: configuration de connexion MySQL.
- `code/backend/requirements.txt`: dependances Python du backend.
- `code/backend/generate_qr.py`: generation du QR code d'acces.
- `code/frontend/package.json`: scripts et dependances React.
- `code/frontend/src/component/config.js`: configuration de l'URL API cote frontend.
- `code/frontend/src/dashboard/config.js`: configuration API pour le dashboard.
- `code/frontend/src/home/config.js`: configuration API pour les pages home.

## Tests

Backend:

```bat
cd code\backend
pytest
```

Frontend:

```bat
cd code\frontend
npm test
```

## Depannage

### Erreur de connexion au serveur

Si le navigateur affiche `ERR_CONNECTION_TIMED_OUT` ou `Erreur de connexion au serveur`:

1. Verifiez que `demarrer_services.bat` est lance.
2. Verifiez que l'adresse utilisee correspond a l'adresse affichee par le script.
3. Testez `http://localhost:8000/` sur le PC serveur.
4. Testez `http://ADRESSE_IP:8000/` depuis l'autre appareil.
5. Autorisez Node.js et Python/Uvicorn dans le pare-feu Windows.
6. Verifiez que les ports `3000` et `8000` ne sont pas bloques.

### Adresse IP incorrecte

Dans PowerShell ou CMD:

```bat
ipconfig
```

Cherchez l'adresse IPv4 de la carte reseau utilisee, puis ouvrez:

```text
http://ADRESSE_IP:3000
```

### Probleme MySQL

Verifiez que:

- MySQL est demarre;
- la base `dangers_db` existe;
- l'utilisateur et le mot de passe correspondent aux variables `DB_USER` et `DB_PASSWORD`;
- le backend peut se connecter a `DB_HOST`.

## Notes

- Les fichiers generes comme les QR codes et les uploads peuvent changer pendant l'utilisation.
- En production, changez les valeurs sensibles comme les mots de passe et les cles secretes.
