import express from "express";
import morgan from "morgan";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/error.middleware.js";
import { setupScalarDocs } from "./docs/scalar.js";

const app = express();

// Middlewares globaux
app.use(express.json());
app.use(morgan("dev"));

// Route de bienvenue / healthcheck
app.get("/", (req, res) => {
  res.json({
    name: "AI Travel Assistant API 🇲🇦",
    status: "online",
    version: "1.0.0",
    docs: "/docs",
    reference: "/reference",
    openapi: "/openapi.json",
  });
});

// Documentation interactive Scalar UI
setupScalarDocs(app);

// Montage de toutes les routes de l'API
app.use("/api", routes);

// Gestionnaire global d'erreurs
app.use(errorHandler);

export default app;