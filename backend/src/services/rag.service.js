import { Op } from "sequelize";
import { Place } from "../models/index.js";
import { querySemanticPlaces } from "./pinecone.service.js";

/**
 * Service RAG (Retrieval-Augmented Generation)
 * Combine la recherche vectorielle sémantique Pinecone (llama-text-embed-v2 1024-dim)
 * et la base relationnelle PostgreSQL
 */
export const getContextForQuery = async (queryText, city = null) => {
  // 1. Tentative de recherche sémantique vectorielle via Pinecone
  try {
    const vectorMatches = await querySemanticPlaces(queryText, 5);

    if (vectorMatches && vectorMatches.length > 0) {
      console.log(`🎯 ${vectorMatches.length} spots pertinents trouvés via Pinecone (llama-text-embed-v2)`);
      const chunks = vectorMatches.map((m) => {
        const meta = m.metadata;
        return `- ${meta.name} (${meta.city}) [${meta.category}] : ${meta.description}. Budget estimé : ${meta.estimatedPriceDh} DH (${meta.budgetLevel}).`;
      });
      return chunks.join("\n");
    }
  } catch (err) {
    console.warn("⚠️ Recherche vectorielle ignorée, repli sur SQL :", err.message);
  }

  // 2. Repli (Fallback) sur la base relationnelle PostgreSQL
  const where = {};
  if (city) {
    where.city = { [Op.iLike]: `%${city}%` };
  }

  const places = await Place.findAll({
    where,
    limit: 6,
    attributes: ["id", "name", "city", "category", "description", "budgetLevel", "estimatedPriceDh"],
  });

  if (!places || places.length === 0) {
    return "Aucune information spécifique trouvée en base pour cette demande.";
  }

  const contextChunks = places.map((p) => {
    return `- ${p.name} (${p.city}) [${p.category}] : ${p.description}. Budget estimé : ${p.estimatedPriceDh} DH (${p.budgetLevel}).`;
  });

  return contextChunks.join("\n");
};
