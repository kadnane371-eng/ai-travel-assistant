/**
 * Validation pour la création d'un lieu
 */
export const validatePlace = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Le nom du lieu est obligatoire.");
  }

  if (!data.city || data.city.trim() === "") {
    errors.push("La ville est obligatoire.");
  }

  if (!data.category || data.category.trim() === "") {
    errors.push("La catégorie est obligatoire (ex: Monument, Restaurant).");
  }

  return errors;
};
