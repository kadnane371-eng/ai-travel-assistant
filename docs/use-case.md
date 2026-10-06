# 📋 Diagramme et Spécification des Cas d'Utilisation

## 1. Acteurs du Système
- **Voyageur Visiteur** : Utilisateur non authentifié pouvant consulter les lieux publics.
- **Voyageur Authentifié** : Utilisateur disposant d'un compte, pouvant chatter avec l'IA et sauvegarder des voyages.
- **Agent IA Conversationnel** : Système autonome apportant des recommandations et déclenchant des fonctions métier (*Function Calling*).
- **Base Vectorielle / SGBD** : Sources de connaissances fiables (PostgreSQL & Pinecone).

---

## 2. Cas d'Utilisation Principaux

### 👤 Module Authentification
- **UC-01 : Créer un compte** (Nom, email valide, mot de passe chiffré bcrypt).
- **UC-02 : Se connecter** (Délivrance de l'AccessToken et RefreshToken).
- **UC-03 : Rafraîchir la session** (Échange du RefreshToken expiré contre un nouveau token valide).
- **UC-04 : Se déconnecter** (Révocation du RefreshToken).

### 📍 Module Découverte & Lieux
- **UC-05 : Consulter le catalogue des lieux** (Filtrage par ville, catégorie, budget).
- **UC-06 : Voir le détail d'un lieu** (Description, budget estimé en DH, coordonnées).

### 🤖 Module Assistant Conversationnel (IA & Temps Réel)
- **UC-07 : Dialoguer en temps réel via WebSockets** (Streaming token par token, indicateur *typing*).
- **UC-08 : Rechercher sémantiquement des lieux (RAG)** (Interrogation des données fiables pour éviter les hallucinations).
- **UC-09 : Demander une proposition de voyage** (Itinéraire structuré jour par jour avec budget).
- **UC-10 : Confirmer un voyage proposé** (*Human-in-the-loop* : validation obligatoire avant insertion en base).

### ✈️ Module Voyages
- **UC-11 : Consulter mes voyages planifiés** (Liste des séjours sauvegardés).
- **UC-12 : Afficher le détail d'un itinéraire** (Jour 1, Jour 2... avec créneaux matin, après-midi, soir).
- **UC-13 : Supprimer un voyage**.

---

## 3. Représentation Visuelle (Format Texte / PlantUML)

```text
       +-------------------------------------------------------+
       |             AI Travel Assistant System               |
       |                                                       |
       |   (S'inscrire / Se connecter) <--- Voyageur Visiteur  |
       |                                                       |
       |   (Consulter les lieux)       <--- Voyageur           |
       |                                                       |
       |   (Chatter avec l'Agent IA)   <--- Voyageur Authentifié
       |         |                                             |
       |         +-- <<include>> --> (Recherche RAG / BDD)     |
       |         |                                             |
       |         +-- <<extend>>  --> (Valider & Créer Voyage)  |
       |                                                       |
       |   (Consulter mes voyages)     <--- Voyageur Authentifié
       +-------------------------------------------------------+
```
