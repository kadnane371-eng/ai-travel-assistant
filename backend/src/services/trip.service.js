import { Trip, TripDay, TripItem, Place } from "../models/index.js";

/**
 * Créer un voyage complet avec ses jours et activités
 */
export const createTrip = async (userId, data) => {
  const { title, city, budgetTotalDh, daysCount, days = [] } = data;

  const trip = await Trip.create({
    userId,
    title,
    city,
    budgetTotalDh,
    daysCount: daysCount || (days.length > 0 ? days.length : 1),
    status: "confirmed",
  });

  // Création des jours et activités associées
  if (Array.isArray(days) && days.length > 0) {
    for (let i = 0; i < days.length; i++) {
      const dayData = days[i];
      const createdDay = await TripDay.create({
        tripId: trip.id,
        dayNumber: dayData.dayNumber || i + 1,
        title: dayData.title || `Jour ${i + 1}`,
      });

      if (Array.isArray(dayData.items)) {
        for (const item of dayData.items) {
          await TripItem.create({
            tripDayId: createdDay.id,
            placeId: item.placeId || null,
            timeSlot: item.timeSlot || "morning",
            title: item.title,
            description: item.description || "",
            costDh: item.costDh || 0,
          });
        }
      }
    }
  }

  // Retourner le voyage complet avec ses associations
  return getTripById(userId, trip.id);
};

/**
 * Récupérer tous les voyages d'un utilisateur
 */
export const getUserTrips = async (userId) => {
  return Trip.findAll({
    where: { userId },
    include: [
      {
        model: TripDay,
        as: "days",
        include: [
          {
            model: TripItem,
            as: "items",
            include: [{ model: Place, as: "place" }],
          },
        ],
      },
    ],
    order: [
      ["createdAt", "DESC"],
      [{ model: TripDay, as: "days" }, "dayNumber", "ASC"],
    ],
  });
};

/**
 * Récupérer un voyage spécifique par son ID
 */
export const getTripById = async (userId, tripId) => {
  return Trip.findOne({
    where: { id: tripId, userId },
    include: [
      {
        model: TripDay,
        as: "days",
        include: [
          {
            model: TripItem,
            as: "items",
            include: [{ model: Place, as: "place" }],
          },
        ],
      },
    ],
    order: [[{ model: TripDay, as: "days" }, "dayNumber", "ASC"]],
  });
};

/**
 * Supprimer un voyage
 */
export const deleteTrip = async (userId, tripId) => {
  const trip = await Trip.findOne({ where: { id: tripId, userId } });
  if (!trip) {
    const error = new Error("Voyage introuvable ou non autorisé.");
    error.status = 404;
    throw error;
  }

  await trip.destroy();
  return true;
};
