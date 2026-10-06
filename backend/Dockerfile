# Étape 1 : Image de base légère Node.js
FROM node:20-alpine

# Répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances de production
RUN npm install --omit=dev

# Copie du reste des sources
COPY . .

# Exposition du port HTTP
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "start"]
