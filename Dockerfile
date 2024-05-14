# Utilisation d'une image de base Node.js
FROM node:20.13.1

# Définition du répertoire de travail de l'application
WORKDIR usr/src/app

# Copie des fichiers de dépendances
COPY package*.json ./
COPY package-lock.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source de l'application
COPY . .

# Exposition du port sur lequel l'application écoute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "index.js"]