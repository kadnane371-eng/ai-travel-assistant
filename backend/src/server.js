import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { sequelize } from "./models/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// 1. Création du serveur HTTP
const server = http.createServer(app);

// 2. Connexion à PostgreSQL et démarrage du serveur
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Base de données PostgreSQL connectée avec succès !");

    // Synchronisation des tables
    await sequelize.sync();
    console.log("✅ Modèles et tables synchronisés.");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Serveur en écoute sur http://localhost:${PORT} (0.0.0.0:${PORT})`);
      console.log(`📚 Documentation Scalar UI disponible sur http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    console.error("❌ Erreur de démarrage de la base de données :", error.message);
    process.exit(1);
  }
};

startServer();