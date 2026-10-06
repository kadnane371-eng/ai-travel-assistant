/**
 * Middleware global de gestion des erreurs
 */
export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Erreur attrapée par errorHandler:", err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Erreur interne du serveur";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default errorHandler;
