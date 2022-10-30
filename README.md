# Projet Groupomania

Le projet consiste à construire un réseau social interne pour les employés de Groupomania. Le
but de cet outil est de faciliter les interactions entre collègues. 

# Installation du projet :

- cloner le répertoire
- installer nodejs et npm
- mettre en place une base de données MongoDB. Importer les collections users et posts si vous en disposez.
- Ouvrir le dossier groupomania dans VS Code ou un autre éditeur de code
- Dans le dossier config, créer un fichier .env et ajouter les variables d'environnements "PORT=5000", "TOKEN_SECRET=" avec la chaine de caractère que vous souhaitez utilisez pour encoder les token (au moins 12 caractères), "DB_USER_PASS=" avec les identifiants de connexion à la base de données sous cette forme : "username:password"
- toujours dans le dossier config, aller dans database.js et renseigner l'adresse de votre base de données après la variable d'environnement DB_USER_PASS
- ouvrir le terminal, puis dans le dossier groupomania, exécuter npm install pour installer les dépendances
- exécuter npm start pour démarrer le serveur
- dans le terminal, se rendre dans le dossier client (saisir "cd ./client/") puis npm install pour installer les dépendances côté client
- exécuter npm start pour démarrer react. 
