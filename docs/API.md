# 📖 Documentation de l'API REST & WebSockets

Cette documentation présente les spécifications techniques complètes des routes de l'API **AI Travel Assistant**.

- **Interface interactive Scalar UI :** [`http://localhost:5000/docs`](http://localhost:5000/docs) ou [`http://localhost:5000/reference`](http://localhost:5000/reference)
- **Spécification OpenAPI (JSON) :** [`http://localhost:5000/openapi.json`](http://localhost:5000/openapi.json)
- **Base URL API :** `http://localhost:5000/api`  
- **WebSockets :** `ws://localhost:5000`

---

## 🔐 1. Authentification (`/api/auth`)

### Inscription
- **Route :** `POST /api/auth/register`
- **Body JSON :**
```json
{
  "fullName": "Anas El Amrani",
  "email": "anas@example.com",
  "password": "password123"
}
```
- **Réponse (201 Created) :**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès !",
  "data": {
    "user": { "id": 1, "fullName": "Anas El Amrani", "email": "anas@example.com" },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

### Connexion
- **Route :** `POST /api/auth/login`
- **Body JSON :**
```json
{
  "email": "anas@example.com",
  "password": "password123"
}
```
- **Réponse (200 OK) :** Retourne les tokens et données de l'utilisateur.

### Renouveler Token
- **Route :** `POST /api/auth/refresh`
- **Body JSON :** `{ "refreshToken": "eyJhbGciOi..." }`
- **Réponse (200 OK) :** `{ "success": true, "data": { "accessToken": "..." } }`

### Profil Utilisateur
- **Route :** `GET /api/auth/me`
- **Header :** `Authorization: Bearer <accessToken>`

---

## 📍 2. Lieux Touristiques (`/api/places`)

### Lister les lieux (avec filtres optionnels)
- **Route :** `GET /api/places?city=Marrakech&category=Monument&budgetLevel=low`
- **Réponse (200 OK) :**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Palais Bahia",
      "city": "Marrakech",
      "category": "Monument",
      "estimatedPriceDh": 70,
      "budgetLevel": "low"
    }
  ]
}
```

### Détail d'un lieu
- **Route :** `GET /api/places/:id`

---

## ✈️ 3. Voyages (`/api/trips`) — Authentification Requise

### Obtenir mes voyages
- **Route :** `GET /api/trips`
- **Header :** `Authorization: Bearer <accessToken>`

### Détail d'un voyage
- **Route :** `GET /api/trips/:id`

### Créer un voyage
- **Route :** `POST /api/trips`
- **Body JSON :**
```json
{
  "title": "Escapade à Chefchaouen",
  "city": "Chefchaouen",
  "budgetTotalDh": 900,
  "daysCount": 2,
  "days": [
    {
      "dayNumber": 1,
      "title": "Jour 1 : Randonnée et Médina",
      "items": [
        { "timeSlot": "morning", "title": "Cascades d'Akchour", "costDh": 50 },
        { "timeSlot": "afternoon", "title": "Déjeuner Place Uta el-Hammam", "costDh": 90 }
      ]
    }
  ]
}
```

### Supprimer un voyage
- **Route :** `DELETE /api/trips/:id`

---

## ⚡ 4. Événements Temps Réel (WebSockets Socket.io)

### Connexion Handshake
- **Auth Data :** `{ auth: { token: "<accessToken>" } }`

### Événements
| Direction | Événement | Charge Utile | Description |
| :--- | :--- | :--- | :--- |
| Client $\rightarrow$ Serveur | `send_message` | `{ conversationId, content }` | Envoi d'un message utilisateur |
| Client $\rightarrow$ Serveur | `confirm_trip` | `{ tripData }` | Validation d'un plan pour création |
| Serveur $\rightarrow$ Client | `agent_typing` | `{ isTyping: true/false }` | Indicateur visuel d'attente |
| Serveur $\rightarrow$ Client | `agent_chunk` | `{ conversationId, textChunk }` | Streaming token par token |
| Serveur $\rightarrow$ Client | `trip_created` | `{ trip }` | Notification voyage créé |
| Serveur $\rightarrow$ Client | `error` | `{ message }` | Gestion d'erreur |
