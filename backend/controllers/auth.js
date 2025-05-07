const User = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = (req, res, next) => {
  if (!validator.isEmail(req.body.email)) {
    return next(new HttpError(400, "Format d'email invalide."));
  }
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
      .catch((error) => {
        if (error.name === "ValidationError" || error.code === 11000) {
          return next(new HttpError(400, error.message, error.name));
        } else {
          return next(error);
        }
      });
  });
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return next(new HttpError(401, "Identifiants incorrects."));
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return next(new HttpError(401, "Identifiants incorrects."));
          }

          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
};
