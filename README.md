
# ✈️ AI Travel Assistant — Plateforme Full-Stack

Application mobile et API intelligente de planification de voyages au Maroc alimentées par l'IA 🇲🇦

---

## 📖 À propos

**AI Travel Assistant** est une solution complète (Mobile + Backend REST & Temps Réel) conçue pour aider les voyageurs à découvrir, organiser et optimiser leurs séjours au Maroc (Marrakech, Fès, Tanger, etc.).

L'application intègre un agent conversationnel autonome capable d'interagir en direct grâce aux **WebSockets (Socket.io)** pour un streaming bidirectionnel fluide, de retrouver des spots précis par **recherche sémantique vectorielle via Pinecone** et de manipuler les données utilisateur via le **Function Calling**.

### 💡 Exemple d'utilisation :
> **Voyageur :** *"J'ai 1 500 DH et je veux passer 3 jours à Marrakech. Je cherche des spots calmes et de la bonne cuisine locale."*  
> **Assistant IA :** Interroge l'index vectoriel Pinecone, propose un planning structuré Jour 1 à Jour 3, et déclenche la création du voyage dans l'application après confirmation.

---

## 🚀 Fonctionnalités

### 📱 Application Mobile (React Native / Expo)
- **Authentification sécurisée :** Stockage chiffré des tokens via `Expo SecureStore`, persistance d'état avec `Zustand`.
- **Chat interactif en WebSockets :** Connexion persistante bidirectionnelle, affichage progressif des réponses de l'agent et statut de saisie ("en train d'écrire...").
- **Visualisation d'Itinéraire :** Cartes interactives par jour (Jour 1, Jour 2, etc.) avec activités, restaurants et budget estimé.
- **Mode hors-ligne / Cache :** Persistance locale des voyages enregistrés avec `AsyncStorage`.

### ⚙️ Backend & Agent IA (Express + Socket.io + PostgreSQL + Pinecone)
- **Communication Temps Réel :** Passerelle WebSocket sécurisée avec authentification par handshake JWT.
- **Recherche sémantique (RAG) :** Découverte de lieux basée sur les embeddings stockés et indexés dans **Pinecone**.
- **Appel d'outils (Function Calling) :**
  - `searchPlaces(city, category, budget)` : Récupère les données fiables de la base SQL.
  - `createTrip(title, city, budget, days, plan_json)` : Sauvegarde le voyage validé en base.
- **Architecture de sécurité :** Protection JWT (Access & Refresh), validation stricte des entrées (`Zod` / `express-validator`) et protection contre les injections de prompt.

---

## 🛠 Stack Technique

| Couche | Technologies |
| :--- | :--- |
| **Frontend Mobile** | React Native, Expo, Expo Router, Zustand, Socket.io-client, Axios |
| **Backend API & Realtime** | Node.js, Express.js, Socket.io (WebSockets) |
| **Base Relationnelle** | PostgreSQL normalisée (3NF) |
| **Base Vectorielle** | Pinecone (Serverless Vector Index) |
| **ORM** | Sequelize  |
| **Authentification** | JWT (Handshake WebSocket & REST) + bcrypt + Expo SecureStore |
| **Moteur IA** | API OpenAI / Anthropic Claude (Function Calling, Embeddings, Token Streaming) |
| **Validation & Logs** | Zod / Express-validator, Morgan |
| **DevOps & Tests** | Docker, Docker Compose, Postman |

---

## 📂 Structure du Projet (Monorepo)

```text
ai-travel-assistant/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── pinecone.js           # Configuration Pinecone
│   │   │   ├── socket.js             # Initialisation Socket.io
│   │   │   ├── ai.js
│   │   │   └── env.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── place.controller.js
│   │   │   └── trip.controller.js
│   │   │
│   │   ├── sockets/
│   │   │   ├── chat.socket.js        # Gestion des événements WebSocket (chat, stream)
│   │   │   └── auth.socket.js        # Middleware de vérification JWT pour sockets
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Place.js
│   │   │   ├── Trip.js
│   │   │   ├── TripDay.js
│   │   │   ├── TripItem.js
│   │   │   ├── Conversation.js
│   │   │   ├── Message.js
│   │   │   └── index.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── place.routes.js
│   │   │   ├── trip.routes.js
│   │   │   └── index.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── validate.middleware.js
│   │   │   └── error.middleware.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── trip.service.js
│   │   │   ├── rag.service.js
│   │   │   ├── pinecone.service.js
│   │   │   └── ai.service.js
│   │   │
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── trip.validator.js
│   │   │   └── place.validator.js
│   │   │
│   │   ├── app.js
│   │   └── server.js                 # Serveur HTTP + Socket.io
│   │
│   ├── migrations/
│   ├── seeders/
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── app/                          # Navigation Expo Router
│   │   ├── (auth)/
│   │   │   ├── login.jsx
│   │   │   └── register.jsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.jsx
│   │   │   ├── index.jsx             # Accueil & exploration
│   │   │   ├── chat.jsx              # Interface de discussion WebSocket
│   │   │   └── trips.jsx             # Liste des voyages planifiés
│   │   ├── trip/
│   │   │   └── [id].jsx              # Détail d'un itinéraire
│   │   └── _layout.jsx
│   │
│   ├── src/
│   │   ├── components/               # Composants réutilisables
│   │   │   ├── ChatBubble.jsx
│   │   │   ├── TripCard.jsx
│   │   │   ├── DayTimeline.jsx
│   │   │   └── CustomButton.jsx
│   │   │
│   │   ├── stores/                   # Stores Zustand
│   │   │   ├── authStore.js          # Tokens, session
│   │   │   ├── chatStore.js          # Messages, statut d'envoi
│   │   │   └── tripStore.js          # Voyages créés
│   │   │
│   │   ├── services/                 # Connecteurs API & WebSockets
│   │   │   ├── api.js                # Instance Axios REST
│   │   │   ├── socket.js             # Connexion et listeners Socket.io
│   │   │   ├── auth.api.js
│   │   │   └── trip.api.js
│   │   │
│   │   ├── constants/
│   │   │   ├── colors.js
│   │   │   └── theme.js
│   │   │
│   │   └── utils/
│   │       └── secureStore.js        # Gestion d'Expo SecureStore
│   │
│   ├── assets/                       # Images, logos et icônes
│   ├── app.json                      # Configuration Expo
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── class-diagram.puml            # Diagramme de classes UML (PlantUML)
│   ├── use-case-diagram.png          # Diagramme de cas d'utilisation
│   ├── CONCEPTION.md
│   ├── PROMPT_JOURNAL.md
│   └── API.md
│
├── docker-compose.yml
└── README.md

```

---

## ⚙️ Installation & Démarrage

### 1. Cloner le Projet

```bash
git clone git@github.com:VotreNomUtilisateur/ai-travel-assistant.git
cd ai-travel-assistant

```

### 2. Démarrer le Backend & la Base de Données

```bash
cd backend

# Configurer les variables d'environnement
cp .env.example .env

# Lancer PostgreSQL via Docker
docker compose up -d db

# Installer les dépendances (y compris socket.io)
npm install

# Exécuter les migrations et seeders
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# Lancer le serveur backend
npm run dev

```

> Le serveur écoutera sur `http://localhost:5000` (REST & WebSockets).

### 3. Démarrer le Frontend Mobile (Expo)

```bash
cd ../frontend

# Configurer les variables d'environnement
cp .env.example .env

# Installer les dépendances (y compris socket.io-client)
npm install

# Lancer Expo
npx expo start

```

> Scannez le QR Code affiché dans votre terminal avec l'application **Expo Go**.

---

## 🔧 Variables d'Environnement

### Backend (`backend/.env`)

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=travel_assistant
DB_USER=postgres
DB_PASSWORD=motdepasse
JWT_SECRET=votre_cle_jwt_secrete
JWT_REFRESH_SECRET=votre_cle_refresh_secrete
OPENAI_API_KEY=votre_cle_openai
PINECONE_API_KEY=votre_cle_pinecone
PINECONE_INDEX=travel-places

```

### Frontend (`frontend/.env`)

```env
EXPO_PUBLIC_API_URL=http://VOTRE_IP_LOCALE:5000/api
EXPO_PUBLIC_SOCKET_URL=http://VOTRE_IP_LOCALE:5000

```

*(Remplacez `VOTRE_IP_LOCALE` par l'IP de votre machine locale, ex: `192.168.1.15`).*

---

## ⚡ Événements WebSockets (Socket.io)

L'échange entre l'application mobile et l'agent IA se fait en temps réel via des événements typés :

| Événement Client $\rightarrow$ Serveur | Paramètres | Rôle |
| --- | --- | --- |
| `send_message` | `{ conversationId, content }` | Envoi d'un message utilisateur à l'agent |
| `confirm_trip` | `{ conversationId, planId }` | Validation de la proposition de séjour |

| Événement Serveur $\rightarrow$ Client | Paramètres | Rôle |
| --- | --- | --- |
| `agent_typing` | `{ isTyping: true/false }` | Indicateur visuel d'attente |
| `agent_chunk` | `{ textChunk: String }` | Réception du texte token par token en streaming |
| `trip_created` | `{ trip: Object }` | Notification dès qu'une action `createTrip` aboutit |
| `error` | `{ message: String }` | Gestion d'erreur d'exécution ou refus de l'agent |

---

## 🔐 Endpoints REST Clés

| Méthode | Route | Description |
| --- | --- | --- |
| **POST** | `/api/auth/register` | Inscription voyageur |
| **POST** | `/api/auth/login` | Connexion et délivrance des tokens |
| **POST** | `/api/auth/refresh` | Renouvellement du token d'accès |
| **GET** | `/api/places` | Liste des lieux touristiques |
| **GET** | `/api/trips` | Récupération des itinéraires de l'utilisateur |
| **GET** | `/api/trips/:id` | Détail complet d'un voyage planifié |

---

## 🤖 Rôle & Périmètre de l'Agent IA

L'assistant intelligent est habilité à :

* Trouver des adresses pertinentes en interrogeant l'index vectoriel **Pinecone**.
* Déclencher des fonctions métier via **Function Calling** :
* `searchPlaces(city, category, budget)` : Récupère les données validées en SQL.
* `createTrip(title, city, budget, days, plan_json)` : Génère le programme après confirmation WebSocket de l'utilisateur.


* Répondre en langage naturel (français, darija, anglais).
* Refuser les demandes hors périmètre (vols réels, paiements bancaires).

---

## 📝 Méthodologie Vibe Coding & Journal de Prompts

Le développement de ce projet applique une démarche itérative assistée par IA :

1. **Architecture First :** Spécification manuelle des modèles de données et contrats WebSocket/REST.
2. **Prompts Itératifs :** Génération incrémentale par briques courtes (Passerelle Socket.io, Service Pinecone, Store Zustand).
3. **Audit et Validation :** Chaque bloc généré est testé, documenté et vérifié avant intégration.
4. **Journal de Bord :** Les prompts structurants, erreurs rencontrées et résolutions manuelles sont consignés dans `/docs/PROMPT_JOURNAL.md`.

---

## 📄 Licence

Ce projet est réalisé à des fins d'apprentissage et de validation du projet de fin de formation (Projet Fil Rouge).

```

```
