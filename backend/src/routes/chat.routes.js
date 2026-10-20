import { Router } from "express";
import * as chatController from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// Toutes les routes de chat nécessitent d'être connecté
router.use(authMiddleware);

router.post("/message", chatController.sendMessage);
router.post("/confirm-trip", chatController.confirmTrip);

export default router;
