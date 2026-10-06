import * as authService from "../services/auth.service.js";

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const result = await authService.registerUser({ fullName, email, password });

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Connexion d'un utilisateur existant
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: "Connexion réussie !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Renouveler l'accessToken à partir du refreshToken
 */
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Token rafraîchi avec succès !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Déconnexion
 */
export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user.id);

    res.status(200).json({
      success: true,
      message: "Déconnexion réussie.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Profil de l'utilisateur connecté
 */
export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
