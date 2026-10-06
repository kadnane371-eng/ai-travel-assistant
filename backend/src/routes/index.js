import { Router } from "express";
import authRoutes from "./auth.routes.js";
import placeRoutes from "./place.routes.js";
import tripRoutes from "./trip.routes.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { Conversation, Message } from "../models/index.js";

const router = Router();

// 1. Authentification
router.use("/auth", authRoutes);

// 2. Lieux touristiques
router.use("/places", placeRoutes);

// 3. Voyages et itinéraires
router.use("/trips", tripRoutes);

// 4. Historique des conversations de chat (protégé)
router.get("/conversations", authMiddleware, async (req, res, next) => {
  try {
    const conversations = await Conversation.findAll({
      where: { userId: req.user.id },
      include: [{ model: Message, as: "messages" }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
