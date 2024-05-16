# ! On utilise l'image de Node;js 20.13.1 qu'on récupère depuis le Docker Hub
FROM node:20.13.1

# ! On définit le dossier de travail à l'intérieur de conteneur (dossier de l'application)
WORKDIR usr/src/app

# ! On copie les packages json dans le dossier de travail définit au dessus
COPY package*.json ./

# ! npm install installes les dépendances du projet (définies dans le package.json)
RUN npm install

# ! Copie de tous les fichiers du dossier courant dans le dossier de travail du conteneur
COPY . .

# ! Génération du schéma prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# ! Expose le port 3000 (pour que les conteneurs docker communiquent entre eux)
EXPOSE 3000

# ! Script pour les commandes prisma & le lancement du serveur dans le fichier index.js
CMD ["./init.sh"]