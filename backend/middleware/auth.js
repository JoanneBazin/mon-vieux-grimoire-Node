const jwt = require("jsonwebtoken");
const HttpError = require("../utils/HttpError");
require("dotenv").config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new HttpError(401, "Token d'authentification manquant"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new HttpError(401, "Token invalide"));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.auth = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return next(new HttpError(401, error.message, error.name));
  }
};
