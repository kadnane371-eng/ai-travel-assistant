/**
 * Spécification OpenAPI 3.1.0 pour AI Travel Assistant API
 */
export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "AI Travel Assistant API 🇲🇦",
    version: "1.0.0",
    description: `
Plateforme backend REST & WebSockets pour l'application **AI Travel Assistant**.

### 🌟 Fonctionnalités clés :
- 🔐 **Authentification complète :** JWT avec Access Tokens & Refresh Tokens.
- 📍 **Découverte de lieux :** Recherche et filtrage dynamique des attractions au Maroc.
- ✈️ **Planification d'itinéraires :** Gestion structurée des voyages par jour et créneaux (matin, après-midi, soir).
- 💬 **Assistant IA & WebSockets :** Chat temps réel avec streaming token par token et Function Calling.

---

### ⚡ Protocole Temps Réel (WebSockets Socket.io)
En complément des routes REST, le serveur expose un serveur Socket.io sur la même origine (\`ws://localhost:5000\`).
- **Authentification Handshake :** \`{ auth: { token: "<accessToken>" } }\`
- **Événements supportés :**
  - \`send_message\` (Client -> Serveur) : \`{ conversationId?: number, content: string }\`
  - \`agent_typing\` (Serveur -> Client) : \`{ isTyping: boolean }\`
  - \`agent_chunk\` (Serveur -> Client) : \`{ conversationId: number, textChunk: string }\`
  - \`confirm_trip\` (Client -> Serveur) : \`{ tripData: object }\`
  - \`trip_created\` (Serveur -> Client) : \`{ trip: object }\`
  - \`error\` (Serveur -> Client) : \`{ message: string }\`
    `,
    contact: {
      name: "Équipe AI Travel Assistant",
      url: "https://github.com/kadnane371-eng/ai-travel-assistant",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Serveur de développement local",
    },
  ],
  tags: [
    {
      name: "Authentification",
      description: "Endpoints pour la gestion des comptes, la connexion et les tokens JWT",
    },
    {
      name: "Lieux & Attractions",
      description: "Consultation, recherche et ajout de spots touristiques au Maroc",
    },
    {
      name: "Voyages & Itinéraires",
      description: "Gestion des séjours personnalisés, journées et activités planifiées",
    },
    {
      name: "Chat & Conversations",
      description: "Historique des échanges avec l'assistant virtuel",
    },
    {
      name: "Système",
      description: "Vérification de l'état de l'API (Healthcheck)",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Entrez votre JWT Access Token sous la forme : `Bearer <token>`",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          fullName: { type: "string", example: "Anas El Amrani" },
          email: { type: "string", format: "email", example: "anas@example.com" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["fullName", "email", "password"],
        properties: {
          fullName: {
            type: "string",
            description: "Nom complet du voyageur (min. 2 caractères)",
            example: "Anas El Amrani",
          },
          email: {
            type: "string",
            format: "email",
            description: "Adresse email valide",
            example: "anas@example.com",
          },
          password: {
            type: "string",
            format: "password",
            description: "Mot de passe sécurisé (min. 6 caractères)",
            example: "password123",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "anas@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "password123",
          },
        },
      },
      RefreshRequest: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: {
            type: "string",
            description: "Token de rafraîchissement reçu lors de la connexion",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      AuthResponseData: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          accessToken: {
            type: "string",
            description: "Jeton JWT à inclure dans l'en-tête Authorization: Bearer <token>",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          refreshToken: {
            type: "string",
            description: "Jeton de rafraîchissement longue durée",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      Place: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Palais Bahia" },
          city: { type: "string", example: "Marrakech" },
          category: { type: "string", example: "Monument" },
          description: {
            type: "string",
            example: "Chef-d'œuvre de l'architecture marocaine du XIXe siècle avec ses cours et jardins luxuriants.",
          },
          budgetLevel: {
            type: "string",
            enum: ["low", "medium", "high"],
            example: "low",
          },
          estimatedPriceDh: { type: "number", example: 70 },
          imageUrl: {
            type: "string",
            format: "uri",
            example: "https://images.unsplash.com/photo-1548013146-72479768bada",
          },
          latitude: { type: "number", format: "float", example: 31.6218 },
          longitude: { type: "number", format: "float", example: -7.9818 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreatePlaceRequest: {
        type: "object",
        required: ["name", "city", "category"],
        properties: {
          name: { type: "string", example: "Jardin Majorelle" },
          city: { type: "string", example: "Marrakech" },
          category: { type: "string", example: "Jardin" },
          description: {
            type: "string",
            example: "Célèbre jardin botanique créé par le peintre français Jacques Majorelle.",
          },
          budgetLevel: {
            type: "string",
            enum: ["low", "medium", "high"],
            default: "medium",
            example: "medium",
          },
          estimatedPriceDh: { type: "number", example: 150 },
          imageUrl: {
            type: "string",
            format: "uri",
            example: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4",
          },
          latitude: { type: "number", format: "float", example: 31.6416 },
          longitude: { type: "number", format: "float", example: -8.0028 },
        },
      },
      TripItem: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          tripDayId: { type: "integer", example: 1 },
          placeId: { type: "integer", nullable: true, example: 1 },
          timeSlot: {
            type: "string",
            enum: ["morning", "afternoon", "evening"],
            example: "morning",
          },
          title: { type: "string", example: "Visite du Palais Bahia" },
          description: { type: "string", example: "Découvrir les cours ornées de mosaïques zellige." },
          costDh: { type: "number", example: 70 },
          place: { $ref: "#/components/schemas/Place" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      TripDay: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          tripId: { type: "integer", example: 1 },
          dayNumber: { type: "integer", example: 1 },
          title: { type: "string", example: "Jour 1 : Randonnée et Médina" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/TripItem" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Trip: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          userId: { type: "integer", example: 1 },
          title: { type: "string", example: "Escapade à Chefchaouen" },
          city: { type: "string", example: "Chefchaouen" },
          budgetTotalDh: { type: "number", example: 900 },
          daysCount: { type: "integer", example: 2 },
          status: {
            type: "string",
            enum: ["draft", "confirmed", "completed"],
            example: "confirmed",
          },
          days: {
            type: "array",
            items: { $ref: "#/components/schemas/TripDay" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateTripItemInput: {
        type: "object",
        required: ["title"],
        properties: {
          placeId: { type: "integer", nullable: true, example: 1 },
          timeSlot: {
            type: "string",
            enum: ["morning", "afternoon", "evening"],
            default: "morning",
            example: "morning",
          },
          title: { type: "string", example: "Cascades d'Akchour" },
          description: { type: "string", example: "Randonnée fraîcheur vers les cascades." },
          costDh: { type: "number", example: 50 },
        },
      },
      CreateTripDayInput: {
        type: "object",
        properties: {
          dayNumber: { type: "integer", example: 1 },
          title: { type: "string", example: "Jour 1 : Randonnée et Médina" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/CreateTripItemInput" },
          },
        },
      },
      CreateTripRequest: {
        type: "object",
        required: ["title", "city"],
        properties: {
          title: { type: "string", example: "Escapade à Chefchaouen" },
          city: { type: "string", example: "Chefchaouen" },
          budgetTotalDh: { type: "number", default: 0, example: 900 },
          daysCount: { type: "integer", example: 2 },
          days: {
            type: "array",
            items: { $ref: "#/components/schemas/CreateTripDayInput" },
          },
        },
      },
      Message: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          conversationId: { type: "integer", example: 1 },
          sender: {
            type: "string",
            enum: ["user", "assistant"],
            example: "user",
          },
          content: {
            type: "string",
            example: "J'ai 1500 DH et je veux visiter Marrakech pendant 3 jours.",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Conversation: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          userId: { type: "integer", example: 1 },
          title: { type: "string", example: "Visite Marrakech 3 jours..." },
          messages: {
            type: "array",
            items: { $ref: "#/components/schemas/Message" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Opération réussie" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Une erreur est survenue." },
          errors: {
            type: "array",
            items: { type: "string" },
            nullable: true,
            example: ["Le mot de passe doit contenir au moins 6 caractères."],
          },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["Système"],
        summary: "Healthcheck de l'API",
        description: "Permet de vérifier le bon fonctionnement de l'API et affiche les informations système.",
        responses: {
          200: {
            description: "API opérationnelle",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "AI Travel Assistant API 🇲🇦" },
                    status: { type: "string", example: "online" },
                    version: { type: "string", example: "1.0.0" },
                    docs: { type: "string", example: "/docs" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Authentification"],
        summary: "Inscription d'un nouvel utilisateur",
        description: "Enregistre un nouveau compte utilisateur et génère une paire de jetons JWT (access & refresh).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Utilisateur créé avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Utilisateur créé avec succès !" },
                    data: { $ref: "#/components/schemas/AuthResponseData" },
                  },
                },
              },
            },
          },
          400: {
            description: "Données de validation incorrectes",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "Adresse email déjà existante",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Authentification"],
        summary: "Connexion utilisateur",
        description: "Authentifie l'utilisateur via email et mot de passe, renvoie les tokens JWT.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Connexion réussie",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Connexion réussie !" },
                    data: { $ref: "#/components/schemas/AuthResponseData" },
                  },
                },
              },
            },
          },
          400: {
            description: "Champs obligatoires manquants",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Identifiants invalides",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Authentification"],
        summary: "Renouvellement du token d'accès",
        description: "Utilise le refreshToken pour obtenir un nouvel accessToken valide sans reconnecter l'utilisateur.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Token rafraîchi avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Token rafraîchi avec succès !" },
                    data: {
                      type: "object",
                      properties: {
                        accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "RefreshToken invalide ou expiré",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Authentification"],
        summary: "Déconnexion",
        description: "Invalide le refreshToken stocké en base de données pour l'utilisateur connecté.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Déconnexion réussie",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          401: {
            description: "Non authentifié",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Authentification"],
        summary: "Profil de l'utilisateur connecté",
        description: "Renvoie les informations du compte utilisateur actuellement authentifié.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Profil récupéré",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: {
            description: "Jeton manquant ou expiré",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/places": {
      get: {
        tags: ["Lieux & Attractions"],
        summary: "Lister les lieux touristiques",
        description: "Récupère les attractions et points d'intérêt avec filtres de ville, catégorie, budget et recherche.",
        parameters: [
          {
            name: "city",
            in: "query",
            required: false,
            description: "Filtrer par ville (ex: Marrakech, Chefchaouen, Tanger)",
            schema: { type: "string", example: "Marrakech" },
          },
          {
            name: "category",
            in: "query",
            required: false,
            description: "Filtrer par type de lieu (ex: Monument, Restaurant, Souk, Jardin)",
            schema: { type: "string", example: "Monument" },
          },
          {
            name: "budgetLevel",
            in: "query",
            required: false,
            description: "Filtrer selon le niveau de prix",
            schema: { type: "string", enum: ["low", "medium", "high"], example: "low" },
          },
          {
            name: "search",
            in: "query",
            required: false,
            description: "Recherche textuelle par mot-clé dans le nom ou la description",
            schema: { type: "string", example: "Bahia" },
          },
        ],
        responses: {
          200: {
            description: "Liste des lieux trouvés",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    count: { type: "integer", example: 1 },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Place" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Lieux & Attractions"],
        summary: "Ajouter un lieu touristique",
        description: "Enregistre un nouveau lieu ou monument dans la base de données.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePlaceRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Lieu ajouté avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Lieu ajouté avec succès" },
                    data: { $ref: "#/components/schemas/Place" },
                  },
                },
              },
            },
          },
          400: {
            description: "Erreur de validation",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/places/{id}": {
      get: {
        tags: ["Lieux & Attractions"],
        summary: "Détail d'un lieu",
        description: "Retourne les informations complètes d'un lieu à partir de son identifiant numérique.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID unique du lieu",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Lieu trouvé",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Place" },
                  },
                },
              },
            },
          },
          404: {
            description: "Lieu introuvable",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/trips": {
      get: {
        tags: ["Voyages & Itinéraires"],
        summary: "Lister mes voyages",
        description: "Récupère tous les voyages de l'utilisateur connecté avec les journées et activités détaillées.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Liste des voyages",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    count: { type: "integer", example: 2 },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Trip" },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Non authentifié",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Voyages & Itinéraires"],
        summary: "Créer un voyage complet",
        description: "Enregistre un nouvel itinéraire de voyage avec ses journées découpées et ses activités.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTripRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Voyage créé avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Voyage créé avec succès !" },
                    data: { $ref: "#/components/schemas/Trip" },
                  },
                },
              },
            },
          },
          400: {
            description: "Données de voyage invalides",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Non authentifié",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/trips/{id}": {
      get: {
        tags: ["Voyages & Itinéraires"],
        summary: "Détail d'un voyage",
        description: "Retourne un voyage complet (jours, activités et informations des lieux associés).",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID unique du voyage",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Détails du voyage",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Trip" },
                  },
                },
              },
            },
          },
          401: {
            description: "Non authentifié",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Voyage introuvable ou non autorisé",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Voyages & Itinéraires"],
        summary: "Supprimer un voyage",
        description: "Supprime définitivement un voyage et ses journées associées pour l'utilisateur connecté.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID du voyage à supprimer",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          200: {
            description: "Voyage supprimé",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          401: {
            description: "Non authentifié",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Voyage introuvable",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/conversations": {
      get: {
        tags: ["Chat & Conversations"],
        summary: "Historique des conversations",
        description: "Renvoie l'ensemble des discussions de l'utilisateur connecté avec tous les messages échangés.",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Historique récupéré avec succès",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Conversation" },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Non authentifié",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};

export default openApiSpec;
