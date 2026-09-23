
# ✈️ AI Travel Assistant — Plateforme Full-Stack

Application mobile et API intelligente de planification de voyages au Maroc alimentées par l'IA 🇲🇦

---

## 📖 À propos

**AI Travel Assistant** est une solution complète (Mobile + Backend REST) conçue pour aider les voyageurs à découvrir, organiser et optimiser leurs séjours au Maroc (Marrakech, Fès, Tanger, etc.).

L'application intègre un agent conversationnel autonome capable de répondre en direct grâce au **Streaming SSE**, de retrouver des spots précis par **recherche sémantique vectorielle via Pinecone** et de manipuler les données utilisateur via le **Function Calling**.

### 💡 Exemple d'utilisation :
> **Voyageur :** *"J'ai 1 500 DH et je veux passer 3 jours à Marrakech. Je cherche des spots calmes et de la bonne cuisine locale."*  
> **Assistant IA :** Interroge l'index vectoriel Pinecone, propose un planning structuré Jour 1 à Jour 3, et déclenche la création du voyage dans l'application après confirmation.

---

## 🚀 Fonctionnalités

### 📱 Application Mobile (React Native / Expo)
- **Authentification sécurisée :** Stockage chiffré des tokens via `Expo SecureStore`, persistance d'état avec `Zustand`.
- **Chat interactif en Streaming (SSE) :** Affichage fluide et progressif mot par mot des réponses de l'agent.
- **Visualisation d'Itinéraire :** Cartes interactives par jour (Jour 1, Jour 2, etc.) avec activités, restaurants et budget estimé.
- **Mode hors-ligne / Cache :** Persistance locale des voyages enregistrés avec `AsyncStorage`.

### ⚙️ Backend & Agent IA (Express + PostgreSQL + Pinecone)
- **Recherche sémantique (RAG) :** Découverte de lieux basée sur les embeddings stockés et indexés dans **Pinecone**.
- **Appel d'outils (Function Calling) :**
  - `searchPlaces(city, category, budget)` : Récupère les données fiables de la base SQL.
  - `createTrip(title, city, budget, days, plan_json)` : Sauvegarde le voyage validé en base.
- **Architecture de sécurité :** Protection JWT (Access & Refresh), validation stricte des entrées (`Zod` / `express-validator`) et protection contre les injections de prompt.

---

## 🛠 Stack Technique

| Couche | Technologies |
| :--- | :--- |
| **Frontend Mobile** | React Native, Expo, Expo Router, Zustand, Axios, React Native Reanimated |
| **Backend API** | Node.js, Express.js |
| **Base Relationnelle** | PostgreSQL normalisée (3NF) |
| **Base Vectorielle** | Pinecone (Serverless Vector Index) |
| **ORM** | Sequelize|
| **Authentification** | JWT (Access & Refresh) + bcrypt + Expo SecureStore |
| **Moteur IA** | API OpenAI / Anthropic Claude (Function Calling, Embeddings, SSE) |
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
│   │   │   ├── pinecone.js           # Client et configuration d'index Pinecone
│   │   │   ├── ai.js
│   │   │   └── env.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── place.controller.js
│   │   │   ├── trip.controller.js
│   │   │   └── ai.controller.js
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
│   │   │   ├── ai.routes.js
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
│   │   │   ├── pinecone.service.js   # Requêtes upsert et query vers Pinecone
│   │   │   └── ai.service.js
│   │   │
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── trip.validator.js
│   │   │   └── place.validator.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
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
│   │   │   ├── chat.jsx              # Interface de discussion avec l'agent
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
│   │   ├── stores/                   # Stores Zustand modulaires
│   │   │   ├── authStore.js          # Tokens, session utilisateur
│   │   │   ├── chatStore.js          # Messages, statut du streaming SSE
│   │   │   └── tripStore.js          # Liste et création de voyages
│   │   │
│   │   ├── services/                 # Appels API Axios & SSE
│   │   │   ├── api.js                # Instance Axios centralisée + Intercepteurs
│   │   │   ├── auth.api.js
│   │   │   ├── trip.api.js
│   │   │   └── chatStream.js         # Gestionnaire du flux SSE
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

# Copier et configurer les variables d'environnement
cp .env.example .env

# Lancer la base PostgreSQL via Docker
docker compose up -d db

# Installer les dépendances
npm install

# Exécuter les migrations et les seeders
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# Lancer le serveur backend
npm run dev

```

> Le serveur backend démarrera sur `http://localhost:5000`.

### 3. Démarrer le Frontend Mobile (Expo)

```bash
cd ../frontend

# Copier et configurer les variables d'environnement
cp .env.example .env

# Installer les dépendances
npm install

# Lancer Expo Metro Bundler
npx expo start

```

> Scannez le QR Code affiché dans votre terminal avec l'application **Expo Go** (Android ou iOS).

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

```

*(Remplacez `VOTRE_IP_LOCALE` par l'adresse IP locale de votre machine sur le réseau local, ex: `192.168.1.15`).*

---

## 🐳 Docker

**Construire et démarrer les conteneurs :**

```bash
docker compose up --build -d

```

**Arrêter les conteneurs :**

```bash
docker compose down

```

**Afficher les logs en direct :**

```bash
docker compose logs -f

```

---

## 🔐 Authentification & Endpoints Clés

### Authentification

| Méthode | Point d'accès | Description |
| --- | --- | --- |
| **POST** | `/api/auth/register` | Inscription d'un nouveau voyageur |
| **POST** | `/api/auth/login` | Connexion et émission des tokens JWT |
| **POST** | `/api/auth/refresh` | Renouvellement du token d'accès |
| **POST** | `/api/auth/logout` | Déconnexion et invalidation de session |

### Lieux & Recommandations

```http
GET    /api/places
GET    /api/places/:id
POST   /api/places/search-vector       (Recherche vectorielle via Pinecone)

```

### Voyages & Itinéraires

```http
GET    /api/trips
POST   /api/trips
GET    /api/trips/:id
PUT    /api/trips/:id
DELETE /api/trips/:id

```

### Agent IA & Discussion

```http
POST   /api/ai/chat              (Chat standard)
POST   /api/ai/chat/stream       (Flux de réponses SSE)
GET    /api/ai/conversations     (Historique des échanges)

```

---

## 🤖 Rôle & Périmètre de l'Agent IA

L'assistant intelligent est habilité à :

* Effectuer des recherches de similarité sémantique sur les descriptions des lieux indexées dans **Pinecone**.
* Déclencher des fonctions métier spécifiques :
* `searchPlaces(city, category, budget)` : Recherche de lieux filtrés par critères.
* `createTrip(title, city, budget, days, plan_json)` : Persistance de l'itinéraire en base SQL.


* Répondre en langage naturel (français, darija, anglais).
* Diffuser sa réponse en streaming temps réel via SSE (Server-Sent Events).
* Refuser toute demande sortant du cadre du voyage (paiements bancaires directs, réservations de billets d'avion).
* Exiger une confirmation explicite de l'utilisateur avant d'enregistrer des modifications en base de données.

---

## 📬 Exemple de Conversation

> 🧳 **Voyageur :**
> *"J'ai 1 500 DH et je veux passer 3 jours à Marrakech."*

> 🤖 **IA :**
> *"Voici une proposition d'itinéraire sur 3 jours pour un budget estimé à 1 350 DH :*
> * **Jour 1 :** Visite de la Koutoubia, déjeuner au Café des Épices, balade nocturne sur la place Jemaa el-Fna.
> * **Jour 2 :** Jardin Majorelle, pause déjeuner chez Nomad, visite des souks de la Médina.
> * **Jour 3 :** Palais de la Bahia, moment de détente dans un hammam traditionnel.
> 
> 
> *Budget total estimé : 1 350 DH.*
> **Souhaitez-vous que j'enregistre cet itinéraire dans votre compte ?**"

> 🧳 **Voyageur :**
> *"Oui, enregistre-le."*

> 🤖 **IA :**
> *"C'est fait ! Votre voyage 'Escapade de 3 jours à Marrakech' a été enregistré avec succès."*

---

## 📝 Méthodologie Vibe Coding & Journal de Prompts

Le développement de ce projet applique une démarche itérative assistée par IA :

1. **Architecture First :** Spécification manuelle des modèles de données et des contrats d'interface (OpenAPI).
2. **Prompts Itératifs :** Génération incrémentale par blocs fonctionnels courts (Middleware JWT, Endpoint SSE, Store Zustand).
3. **Audit et Validation :** Chaque bloc généré est testé, documenté et vérifié avant intégration.
4. **Journal de Bord :** Les prompts structurants, erreurs rencontrées et résolutions manuelles sont consignés dans `/docs/PROMPT_JOURNAL.md`.

---

## 📄 Licence

Ce projet est réalisé à des fins d'apprentissage et de validation du projet de fin de formation (Projet Fil Rouge).

```

```
