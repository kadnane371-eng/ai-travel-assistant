import { Op } from "sequelize";
import { Place } from "../models/index.js";

/**
 * Récupérer tous les lieux avec filtres et recherche
 */
export const getAllPlaces = async (req, res, next) => {
  try {
    const { city, category, budgetLevel, search } = req.query;
    const where = {};

    if (city) {
      where.city = { [Op.iLike]: `%${city}%` };
    }

    if (category) {
      where.category = { [Op.iLike]: `%${category}%` };
    }

    if (budgetLevel) {
      where.budgetLevel = budgetLevel;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const places = await Place.findAll({
      where,
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un lieu par son ID
 */
export const getPlaceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const place = await Place.findByPk(id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Lieu introuvable",
      });
    }

    res.status(200).json({
      success: true,
      data: place,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ajouter un nouveau lieu
 */
export const createPlace = async (req, res, next) => {
  try {
    const newPlace = await Place.create(req.body);

    res.status(201).json({
      success: true,
      message: "Lieu ajouté avec succès",
      data: newPlace,
    });
  } catch (error) {
    next(error);
  }
};
