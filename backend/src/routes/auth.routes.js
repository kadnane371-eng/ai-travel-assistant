import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { validateRegister, validateLogin } from "../validators/auth.validator.js";

const router = Router();

// Routes publiques
router.post("/register", validate(validateRegister), authController.register);
router.post("/login", validate(validateLogin), authController.login);
router.post("/refresh", authController.refresh);

// Routes protégées
router.post("/logout", authMiddleware, authController.logout);
router.get("/me", authMiddleware, authController.getProfile);

export default router;
