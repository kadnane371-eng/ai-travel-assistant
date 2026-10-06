import { Router } from "express";
import * as placeController from "../controllers/place.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { validatePlace } from "../validators/place.validator.js";

const router = Router();

router.get("/", placeController.getAllPlaces);
router.get("/:id", placeController.getPlaceById);
router.post("/", validate(validatePlace), placeController.createPlace);

export default router;
