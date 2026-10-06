/**
 * Middleware simple de validation des requêtes
 * @param {Function} validatorFn - Fonction qui retourne une liste d'erreurs
 */
export const validate = (validatorFn) => {
  return (req, res, next) => {
    const errors = validatorFn(req.body);
    if (errors && errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Erreur de validation des données",
        errors,
      });
    }
    next();
  };
};

export default validate;
