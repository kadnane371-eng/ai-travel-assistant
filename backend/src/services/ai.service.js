import OpenAI from "openai";
import { getContextForQuery } from "./rag.service.js";
import { Place } from "../models/index.js";
import * as tripService from "./trip.service.js";

// Configuration DeepSeek (via le client compatible OpenAI)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

let deepseek = null;

if (DEEPSEEK_API_KEY) {
  deepseek = new OpenAI({
    apiKey: DEEPSEEK_API_KEY,
    baseURL: DEEPSEEK_BASE_URL,
  });
}

// ==========================================
// SYSTEM PROMPT & PÉRIMÈTRE DE L'AGENT
// ==========================================
export const SYSTEM_PROMPT = `Tu es l'assistant intelligent de voyage officiel d'AI Travel Assistant pour le Maroc 🇲🇦 propulsé par DeepSeek.
Ton rôle est d'accompagner les voyageurs dans la planification de leurs séjours (Marrakech, Fès, Tanger, Chefchaouen, Essaouira, Rabat, etc.).

RÈGLES ET PÉRIMÈTRE MÉTIER :
1. Ce que tu fais :
   - Proposer des itinéraires détaillés jour par jour (matin, après-midi, soir).
   - Donner des estimations budgétaires réalistes en Dirhams marocains (DH).
   - Recommander des lieux culturels, restaurants locaux et activités vérifiées.
   - Parler en Français, Darija ou Anglais selon la langue de l'utilisateur.

2. Ce que tu refuses formellement :
   - Effectuer des transactions financières, des réservations de vols réels ou paiements bancaires.
   - Donner des conseils médicaux, juridiques ou hors du contexte du voyage.

3. Confirmation obligatoire :
   - Avant d'enregistrer un voyage dans le compte de l'utilisateur, demande-lui toujours de valider la proposition.

4. Utilisation des outils :
   - Utilise l'outil "searchPlaces" pour trouver des lieux vérifiés dans la base de données.
   - Utilise l'outil "createTrip" quand l'utilisateur confirme vouloir sauvegarder son itinéraire.`;

// Définition des outils (Function Calling)
export const AI_TOOLS = [
  {
    type: "function",
    function: {
      name: "searchPlaces",
      description: "Rechercher des lieux et attractions touristiques fiables en base de données.",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "Nom de la ville (ex: Marrakech, Fès, Tanger)" },
          category: { type: "string", description: "Catégorie (ex: Monument, Restaurant, Souk)" },
        },
        required: ["city"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "createTrip",
      description: "Créer et enregistrer officiellement le voyage dans le compte de l'utilisateur après sa confirmation.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Titre du voyage (ex: 3 Jours Magiques à Marrakech)" },
          city: { type: "string", description: "Ville principale" },
          budgetTotalDh: { type: "number", description: "Budget total estimé en Dirhams (DH)" },
          daysCount: { type: "number", description: "Nombre de jours" },
        },
        required: ["title", "city", "budgetTotalDh", "daysCount"],
      },
    },
  },
];

/**
 * Exécution d'un appel d'outil (Function Calling)
 */
export const executeFunctionCall = async (toolName, args, userId) => {
  if (toolName === "searchPlaces") {
    const places = await Place.findAll({
      where: { city: args.city },
      limit: 5,
    });
    return JSON.stringify(places);
  }

  if (toolName === "createTrip") {
    const trip = await tripService.createTrip(userId, {
      title: args.title,
      city: args.city,
      budgetTotalDh: args.budgetTotalDh,
      daysCount: args.daysCount,
      days: [
        {
          dayNumber: 1,
          title: `Jour 1 : Arrivée et visite de ${args.city}`,
          items: [
            { timeSlot: "morning", title: "Visite de la Médina", costDh: 50 },
            { timeSlot: "afternoon", title: "Déjeuner restaurant local", costDh: 120 },
            { timeSlot: "evening", title: "Balade au coucher du soleil", costDh: 0 },
          ],
        },
      ],
    });
    return JSON.stringify({ message: "Voyage créé avec succès !", trip });
  }

  return JSON.stringify({ error: "Outil inconnu" });
};

/**
 * Traiter un message avec streaming via DeepSeek
 * @param {string} userMessage - Message envoyé par l'utilisateur
 * @param {number} userId - ID de l'utilisateur connecté
 * @param {Function} onChunk - Callback pour streamer les tokens vers le client
 */
export const processChatMessageStream = async (userMessage, userId, onChunk) => {
  // 1. Enrichissement RAG (contexte documentaire)
  const ragContext = await getContextForQuery(userMessage);

  if (deepseek) {
    try {
      const responseStream = await deepseek.chat.completions.create({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: "system", content: `${SYSTEM_PROMPT}\n\nContexte documentaire fiable :\n${ragContext}` },
          { role: "user", content: userMessage },
        ],
        stream: true,
      });

      let fullResponse = "";
      for await (const chunk of responseStream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) {
          fullResponse += text;
          onChunk(text);
        }
      }
      return fullResponse;
    } catch (err) {
      console.warn("Erreur API DeepSeek, bascule vers le moteur local:", err.message);
    }
  }

  // Moteur local de simulation intelligente (si DeepSeek indisponible ou clé non configurée)
  const simulatedAnswer = `Salam ! Je suis votre assistant DeepSeek pour votre voyage au Maroc :\n\n` +
    `📍 **Recommandation basée sur nos données :**\n${ragContext}\n\n` +
    `💡 **Conseil budget :** Prévoyez environ 300 à 500 DH/jour pour les repas et visites.\n` +
    `Souhaitez-vous que je crée et sauvegarde cet itinéraire dans votre compte ?`;

  const words = simulatedAnswer.split(" ");
  for (const word of words) {
    await new Promise((resolve) => setTimeout(resolve, 40));
    onChunk(word + " ");
  }

  return simulatedAnswer;
};
