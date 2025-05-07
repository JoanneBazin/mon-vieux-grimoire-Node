require("dotenv").config();

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }

  return res.status(statusCode).json({
    error: err.message || "Une erreur interne est survenue.",
  });
};
