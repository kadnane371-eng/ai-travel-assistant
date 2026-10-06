import { Pinecone } from "@pinecone-database/pinecone";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX || "travel-places";
const EMBEDDING_MODEL = process.env.PINECONE_EMBEDDING_MODEL || "llama-text-embed-v2";

let pc = null;
let pineconeIndex = null;

if (PINECONE_API_KEY) {
  try {
    pc = new Pinecone({ apiKey: PINECONE_API_KEY });
    pineconeIndex = pc.index(PINECONE_INDEX_NAME);
    console.log(`🌲 Pinecone connecté avec le modèle d'embedding : ${EMBEDDING_MODEL} (1024 dimensions)`);
  } catch (error) {
    console.warn("⚠️ Initialisation Pinecone échouée :", error.message);
  }
}

/**
 * Générer un embedding 1024-dimensions avec Pinecone Inference API (llama-text-embed-v2 NVIDIA)
 * @param {string} text - Texte à vectoriser
 * @param {"query" | "passage"} inputType - Type d'entrée
 * @returns {Promise<Array<number> | null>} Vecteur de 1024 dimensions
 */
export const generateEmbedding = async (text, inputType = "query") => {
  if (!pc || !text) return null;

  try {
    const response = await pc.inference.embed({
      model: EMBEDDING_MODEL,
      inputs: [text],
      parameters: {
        inputType,
        truncate: "END",
      },
    });

    if (response?.data && response.data.length > 0) {
      return response.data[0].values;
    }
    return null;
  } catch (error) {
    console.error("❌ Erreur génération embedding Pinecone (llama-text-embed-v2) :", error.message);
    return null;
  }
};

/**
 * Recherche sémantique vectorielle de lieux
 * @param {string} queryText - Requête de l'utilisateur en langage naturel
 * @param {number} topK - Nombre de résultats les plus proches
 */
export const querySemanticPlaces = async (queryText, topK = 5) => {
  if (!pineconeIndex || !pc) return null;

  try {
    // 1. Vectorisation de la question avec llama-text-embed-v2 (1024 dimensions)
    const queryVector = await generateEmbedding(queryText, "query");
    if (!queryVector) return null;

    // 2. Recherche par similarité cosinus dans l'index Pinecone
    const queryResponse = await pineconeIndex.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
    });

    return queryResponse.matches || [];
  } catch (error) {
    console.error("❌ Erreur requête vectorielle Pinecone :", error.message);
    return null;
  }
};

/**
 * Indexer un lieu dans Pinecone avec son embedding 1024-dim
 * @param {Object} place - Objet lieu de la base PostgreSQL
 */
export const upsertPlaceEmbedding = async (place) => {
  if (!pineconeIndex || !pc) return null;

  try {
    const textContent = `${place.name} à ${place.city} (${place.category}) : ${place.description}. Budget : ${place.estimatedPriceDh} DH.`;
    const vector = await generateEmbedding(textContent, "passage");

    if (!vector) return null;

    await pineconeIndex.upsert({
      records: [
        {
          id: `place_${place.id}`,
          values: vector,
          metadata: {
            id: place.id,
            name: place.name,
            city: place.city,
            category: place.category,
            estimatedPriceDh: Number(place.estimatedPriceDh),
            budgetLevel: place.budgetLevel,
            description: place.description,
          },
        },
      ],
    });

    return true;
  } catch (error) {
    console.error(`❌ Erreur indexation du lieu ${place.id} dans Pinecone :`, error.message);
    return false;
  }
};

export { pc, pineconeIndex };
