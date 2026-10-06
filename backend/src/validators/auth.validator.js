/**
 * Validation pour l'inscription
 */
export const validateRegister = (data) => {
  const errors = [];

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push("Le nom complet est obligatoire (min 2 caractères).");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Une adresse email valide est obligatoire.");
  }

  if (!data.password || data.password.length < 6) {
    errors.push("Le mot de passe doit contenir au moins 6 caractères.");
  }

  return errors;
};

/**
 * Validation pour la connexion
 */
export const validateLogin = (data) => {
  const errors = [];

  if (!data.email) {
    errors.push("L'email est obligatoire.");
  }

  if (!data.password) {
    errors.push("Le mot de passe est obligatoire.");
  }

  return errors;
};
