# Mon Vieux Grimoire 

Ce projet est le Back-end et le Front-end du site "Mon Vieux Grimoire", une plateforme de référencement et de notation de livres, réalisé dans le cadre du Projet 7 de la formation Développeur Web d'OpenClassrooms.


## Installation et exécution du projet

Le projet est divisé en deux parties : le Frontend (React) et le Backend (Node/Express). Il faut lancer les deux simultanément.


###  Démarrer le Backend (Serveur)
Ouvrez un terminal et tapez :
\`\`\`bash
cd backend
npm install
\`\`\`

**Configuration de la base de données :**
À la racine du dossier `backend`, créez un fichier nommé `.env` en vous basant sur le fichier `.env.sample` fourni.
Vous devrez y insérer votre propre lien de connexion MongoDB et une clé secrète de votre choix :
\`\`\`env
MONGODB_URI=votre_lien_mongodb_ici
TOKEN_SECRET=votre_cle_secrete_ici
PORT=4000
\`\`\`

Lancez ensuite le serveur :
\`\`\`bash
node server.js
\`\`\`
Le serveur tournera sur le port `4000`.

###  Démarrer le Frontend (Site web)
Ouvrez un **nouveau** terminal (en gardant le premier ouvert) et tapez :
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`
Le site s'ouvrira automatiquement dans votre navigateur à l'adresse `http://localhost:3000`.