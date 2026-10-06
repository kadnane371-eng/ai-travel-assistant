import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "travel_assistant_super_jwt_secret_key_2026";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "travel_assistant_super_refresh_secret_key_2026";

/**
 * Générer les tokens d'accès et de rafraîchissement
 */
export const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, fullName: user.fullName };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

/**
 * Service Inscription
 */
export const registerUser = async ({ fullName, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error("Cet email est déjà associé à un compte.");
    error.status = 400;
    throw error;
  }

  // Hashage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const { accessToken, refreshToken } = generateTokens(user);

  // Sauvegarde du refreshToken en base
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Service Connexion
 */
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error("Identifiants invalides (email ou mot de passe incorrect).");
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Identifiants invalides (email ou mot de passe incorrect).");
    error.status = 401;
    throw error;
  }

  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Service Rafraîchissement de token
 */
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Refresh token requis.");
    error.status = 400;
    throw error;
  }

  const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  const user = await User.findByPk(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("Refresh token invalide ou révoqué.");
    error.status = 401;
    throw error;
  }

  const newAccessToken = jwt.sign(
    { id: user.id, email: user.email, fullName: user.fullName },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { accessToken: newAccessToken };
};

/**
 * Service Déconnexion
 */
export const logoutUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  return true;
};
