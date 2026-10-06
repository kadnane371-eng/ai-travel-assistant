import { Router } from "express";
import * as tripController from "../controllers/trip.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { validateTrip } from "../validators/trip.validator.js";

const router = Router();

// Toutes les routes trips sont protégées par authMiddleware
router.use(authMiddleware);

router.get("/", tripController.getMyTrips);
router.get("/:id", tripController.getTripDetails);
router.post("/", validate(validateTrip), tripController.createNewTrip);
router.delete("/:id", tripController.removeTrip);

export default router;
