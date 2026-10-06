/**
 * Validation pour la création d'un voyage
 */
export const validateTrip = (data) => {
  const errors = [];

  if (!data.title || data.title.trim() === "") {
    errors.push("Le titre du voyage est obligatoire.");
  }

  if (!data.city || data.city.trim() === "") {
    errors.push("La ville de destination est obligatoire.");
  }

  if (data.budgetTotalDh === undefined || data.budgetTotalDh < 0) {
    errors.push("Le budget total en Dirhams (DH) doit être un nombre positif.");
  }

  return errors;
};
