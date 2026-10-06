import * as tripService from "../services/trip.service.js";

/**
 * Récupérer tous les voyages de l'utilisateur connecté
 */
export const getMyTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getUserTrips(req.user.id);
    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un voyage par son ID
 */
export const getTripDetails = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.user.id, req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Voyage introuvable",
      });
    }

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouveau voyage
 */
export const createNewTrip = async (req, res, next) => {
  try {
    const newTrip = await tripService.createTrip(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Voyage créé avec succès !",
      data: newTrip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un voyage
 */
export const removeTrip = async (req, res, next) => {
  try {
    await tripService.deleteTrip(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      message: "Voyage supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};
