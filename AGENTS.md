# Consignes Codex - gestion des dangers

Le code utile se trouve dans `code/backend/app/` (FastAPI/SQLAlchemy/MySQL) et `code/frontend/src/` (React). Lisez d'abord les fichiers directement concernes par la tache, puis les tests associes.

Pour reduire les tokens, ignorez les repertoires generes `venv/`, `.venv/`, `node_modules/`, `__pycache__/`, `*.egg-info/`, `uploads/`, `QR/`, ainsi que les images et les fichiers `package-lock.json`, sauf necessite demontree. Ne scannez pas tout le depot a chaque iteration.

Conservez les contrats d'API utilises par React (`/api/auth`, `/api/dangers`, `/api/statistiques`), le mode visiteur de signalement, les donnees MySQL existantes et les champs `declarant` / `image` visibles cote frontend. Toute migration de schema doit etre explicite et reversible.

Appliquez le plus petit correctif verifiable, ajoutez un test cible, executez-le, puis creez une pull request avec les risques et les tests. Ne fusionnez pas si les tests echouent ou si une migration/une perte de donnees est possible.
