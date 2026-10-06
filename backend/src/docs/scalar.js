import { apiReference } from "@scalar/express-api-reference";
import openApiSpec from "./openapi.js";

/**
 * Configure et monte la documentation interactive Scalar UI
 * ainsi que les endpoints JSON du schéma OpenAPI.
 *
 * @param {import('express').Express} app - Instance Express
 */
export const setupScalarDocs = (app) => {
  // Endpoint direct pour récupérer le schéma brut OpenAPI JSON
  const serveOpenApiJson = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json(openApiSpec);
  };

  app.get("/openapi.json", serveOpenApiJson);
  app.get("/docs/openapi.json", serveOpenApiJson);

  // Configuration du middleware Scalar UI
  const scalarMiddleware = apiReference({
    pageTitle: "AI Travel Assistant API Reference 🇲🇦",
    theme: "purple",
    darkMode: true,
    layout: "modern",
    spec: {
      content: openApiSpec,
    },
  });

  // Accès à la documentation Scalar UI via /docs et /reference
  app.use("/reference", scalarMiddleware);
  app.use("/docs", scalarMiddleware);

  console.log("📚 Scalar UI monté sur /docs et /reference");
  console.log("📄 Schéma OpenAPI JSON disponible sur /openapi.json");
};

export default setupScalarDocs;
