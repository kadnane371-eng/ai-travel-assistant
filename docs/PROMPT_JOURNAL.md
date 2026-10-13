# 📓 Journal de Bord - Vibe Coding & Prompt Engineering

Ce document consigne la démarche itérative de co-développement assisté par IA pour le projet **AI Travel Assistant**.

---

## 🧭 Philosophie & Méthodologie Adoptée
1. **Rôle du Développeur :** Architecte, relecteur, vérificateur de sécurité et intégrateur.
2. **Démarche Itérative :** Découpage du travail en modules unitaires et testables (Modèles -> Middlewares -> Services -> Contrôleurs -> WebSockets -> IA) plutôt qu'une génération monolithique opaque.
3. **Contrôle Qualité :** Vérification systématique du code produit, élimination du code mort ou sur-complexe, et tests de validation.

---

## 📝 Historique des Itérations & Prompts Clés

### Itération 1 : Modélisation des Données & Schéma 3NF
- **Prompt :**
  > *"Définis les modèles Sequelize pour une application de voyage intégrant un utilisateur, des lieux touristiques marocains, des voyages organisés par jours et activités (3NF), ainsi que les conversations et messages du chat IA."*
- **Résultat Obtenu :**
  Modèles `User`, `Place`, `Trip`, `TripDay`, `TripItem`, `Conversation`, `Message` et relations `hasMany`/`belongsTo` déclarées dans `models/index.js`.
- **Revue & Correction Manuelle :**
  - Ajout des contraintes `onDelete: 'CASCADE'` pour garantir l'intégrité référentielle en cas de suppression d'un voyage ou d'une conversation.
  - Prise en compte du budget en Dirhams (`estimatedPriceDh` et `budgetTotalDh`).

---

### Itération 2 : Simplification & Respect de la Configuration
- **Prompt / Décision :**
  > *"Garde dans config uniquement database.js tel qu'il a été conçu initialement, sans fichiers superflus."*
- **Résultat Obtenu :**
  Nettoyage du dossier `config/` pour ne conserver que `database.js` clair et épuré.
- **Revue & Correction Manuelle :**
  - Restauration de la connexion standard avec Sequelize et variables `process.env`.
  - Évitement de sur-ingénierie inutile afin que le code reste lisible et défendable lors de la soutenance.

---

### Itération 3 : Authentification Sécurisée & JWT
- **Prompt :**
  > *"Mets en place un service d'authentification avec hashage bcrypt, génération d'AccessToken (1j) et RefreshToken (7j), middleware de vérification et routes auth."*
- **Résultat Obtenu :**
  Création de `auth.service.js`, `auth.controller.js`, `auth.middleware.js` et `auth.routes.js`.
- **Revue & Correction Manuelle :**
  - Exclusion du hash de mot de passe et du refresh token dans les retours JSON pour des raisons de sécurité.
  - Ajout d'une route `/api/auth/me` pour récupérer facilement le profil courant dans le mobile.

---

### Itération 4 : Moteur IA, RAG & Function Calling
- **Prompt :**
  > *"Conçois le service IA avec un System Prompt délimitant strictement le rôle (voyages au Maroc, budgets en DH), le refus des actions sensibles, deux outils de Function Calling (searchPlaces, createTrip), et un streaming de texte."*
- **Résultat Obtenu :**
  `ai.service.js` et `rag.service.js` avec récupération du contexte documentaire fiable avant génération.
- **Revue & Correction Manuelle :**
  - Ajout d'un mécanisme de secours (*fallback*) simulant le streaming si aucune clé API payante n'est présente, garantissant la fluidité de la démonstration en direct pendant l'évaluation.

---

### Itération 5 : Passerelle Temps Réel (WebSockets Socket.io)
- **Prompt :**
  > *"Configure Socket.io avec handshake JWT, écoute de 'send_message', diffusion de l'indicateur d'écriture 'agent_typing' et des chunks de streaming 'agent_chunk'."*
- **Résultat Obtenu :**
  `sockets/auth.socket.js` et `sockets/chat.socket.js` intégrés dans `server.js`.
- **Revue & Correction Manuelle :**
  - Liaison directe des messages échangés avec les entités Sequelize `Conversation` et `Message` pour assurer la persistance et l'audit.

---

### Itération 6 : Intégration du LLM DeepSeek
- **Prompt :**
  > *"Use DeepSeek instead of OpenAI."*
- **Résultat Obtenu :**
  Mise à jour de `ai.service.js` pour utiliser l'API DeepSeek (`baseURL: 'https://api.deepseek.com'`, modèle `deepseek-chat`) via le SDK OpenAI standard.
- **Revue & Correction Manuelle :**
  - Adaptation des variables d'environnement (`DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL`) dans `.env` et `.env.example`.
  - Maintien du streaming et du function calling compatible avec DeepSeek à un coût très économique.

### Itération 7 : Vectorisation avec Pinecone Inference API (llama-text-embed-v2)
- **Prompt :**
  > *"Using Pinecone llama-text-embed-v2, NVIDIA-Hosted, Inference API, 1024 dimensions."*
- **Résultat Obtenu :**
  Mise à jour de `pinecone.service.js` et `rag.service.js` pour utiliser directement `pc.inference.embed({ model: 'llama-text-embed-v2' })` sans dépendre d'un modèle externe.
- **Revue & Correction Manuelle :**
  - Validation des 1024 dimensions vectorielles et de la métrique `cosine` sur l'index Pinecone `travel-places`.
  - Formatage adapté des types `query` (pour les questions de l'utilisateur) et `passage` (pour l'indexation des spots).
  - Test validé avec succès en direct via l'API Pinecone.

---

### Itération 8 : Développement du Frontend Mobile (React Native / Expo) & Connexion Temps Réel
- **Prompt :**
  > *"À partir du brief, du README et des maquettes d'écran, développe l'application mobile frontend (React Native, Expo Router, Zustand, Axios, Socket.io) et connecte-la au backend REST et WebSockets."*
- **Résultat Obtenu :**
  - Architecture complète sous `frontend/` avec 9 écrans fidèles aux maquettes visuelles :
    1. **Onboarding / Splash** (`app/index.jsx`) avec fond paysager marocain et bouton "Commencer".
    2. **Connexion & Inscription** (`app/(auth)/login.jsx`, `app/(auth)/register.jsx`) avec mot de passe masquable et stockage chiffré des tokens.
    3. **Accueil** (`app/(tabs)/index.jsx`) avec salutation personnalisée, bannière IA et carrousel de destinations (Marrakech, Agadir, Fès).
    4. **Planificateur de voyage** (`app/plan.jsx`) avec sélecteurs de ville, durée, budget en DH, style de voyage et nombre de voyageurs.
    5. **Itinéraire détaillé** (`app/trip/[id].jsx`) avec timeline chronologique reliée, badges budgétaires et onglets Jour 1/2/3.
    6. **Chat IA interactif** (`app/(tabs)/chat.jsx`) avec streaming token par token, statut en ligne, et cartes d'activités riches.
    7. **Exploration des lieux** (`app/(tabs)/explore.jsx`) avec filtres catégories (Lieux, Restaurants, Activités) et recherche.
    8. **Mes voyages** (`app/(tabs)/trips.jsx`) avec onglets À venir/Passés et actions (Voir, Modifier, Partager, Supprimer).
    9. **Profil utilisateur** (`app/(tabs)/profile.jsx`) avec informations du compte et déconnexion sécurisée.
  - Gestion d'état modulaire avec Zustand (`authStore.js`, `chatStore.js`, `tripStore.js`).
  - Passerelle Socket.io (`services/socket.js`) gérant le handshake JWT, l'indicateur d'écriture et le streaming en direct.
  - Client Axios centralisé (`services/api.js`) avec intercepteur d'injection JWT et refresh automatique en cas d'expiration.
  - Stockage chiffré hybride (`utils/secureStore.js`) via `Expo SecureStore` sur mobile natif et fallback `AsyncStorage` pour le web.
- **Revue & Correction Manuelle :**
  - Respect scrupuleux de la palette de couleurs et tokens du design (Émeraude marocain `#0D5C4D`, Terracotta `#E07A5F`, Sable `#E9C46A`).
  - Ajout du middleware `cors` dans le backend Express pour autoriser les requêtes cross-origin du frontend.
  - Fallbacks gracieux et données de démonstration permettant à l'application de fonctionner de manière fluide même sans réseau ou sans base active.

---

## 🎯 Préparation aux Questions de Soutenance
- **Q : Pourquoi avoir séparé AccessToken et RefreshToken ?**  
  *R :* L'AccessToken a une durée de vie courte (1 jour) pour limiter l'impact en cas d'interception. Le RefreshToken (7 jours) permet de renouveler la session en arrière-plan sans forcer l'utilisateur à se reconnecter.
- **Q : Comment l'agent évite-t-il les hallucinations ?**  
  *R :* Grâce au RAG : avant de répondre, le service injecte les lieux réels et prix vérifiés de la base de données dans le prompt système (`rag.service.js`).
- **Q : Pourquoi exiger une confirmation humaine avant de créer le voyage ?**  
  *R :* Principe de *Human-in-the-Loop* : l'agent propose, mais l'utilisateur reste maître de la validation de ses données financières et d'itinéraire.
- **Q : Comment est géré le streaming de texte entre l'IA et le mobile ?**  
  *R :* L'agent diffuse les tokens via WebSockets (`socket.io` événement `agent_chunk`), ce qui permet au composant React Native d'afficher les mots au fur et à mesure sans attendre la complétion totale.

