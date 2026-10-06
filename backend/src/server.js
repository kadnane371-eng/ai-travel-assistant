import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import { sequelize } from "./models/index.js";
import authSocketMiddleware from "./sockets/auth.socket.js";
import registerChatSocket from "./sockets/chat.socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// 1. Création du serveur HTTP
const server = http.createServer(app);

// 2. Configuration de Socket.io (WebSockets)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware d'authentification Socket.io
io.use(authSocketMiddleware);

// Enregistrement des événements Socket.io
registerChatSocket(io);

// 3. Connexion à PostgreSQL et démarrage du serveur
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Base de données PostgreSQL connectée avec succès !");

    // Synchronisation des tables
    await sequelize.sync();
    console.log("✅ Modèles et tables synchronisés.");

    server.listen(PORT, () => {
      console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
      console.log(`📚 Documentation Scalar UI disponible sur http://localhost:${PORT}/docs`);
      console.log(`⚡ WebSockets Socket.io prêts sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erreur de démarrage de la base de données :", error.message);
    process.exit(1);
  }
};

startServer();