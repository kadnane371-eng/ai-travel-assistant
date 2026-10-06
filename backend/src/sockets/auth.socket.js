import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "travel_assistant_super_jwt_secret_key_2026";

/**
 * Middleware d'authentification pour le handshake Socket.io
 */
export const authSocketMiddleware = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Token d'authentification manquant dans le handshake."));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "fullName", "email"],
    });

    if (!user) {
      return next(new Error("Utilisateur introuvable."));
    }

    // Attacher l'utilisateur au socket
    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Authentification Socket.io échouée : " + error.message));
  }
};

export default authSocketMiddleware;
