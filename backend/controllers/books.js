const resizeImage = require("../utils/sharp");
const Book = require("../models/Book");
const HttpError = require("../utils/HttpError");
const sanitizeData = require("../utils/sanitizeData");
const deleteImage = require("../utils/deleteImage");

exports.addBook = (req, res, next) => {
  const parsedBookObject = JSON.parse(req.body.book);
  let savedFilename;

  const bookObject = sanitizeData(parsedBookObject);
  delete bookObject.userId;

  if (!req.file) {
    return next(new HttpError(400, "Image manquante."));
  }

  resizeImage(req.file)
    .then((filename) => {
      savedFilename = filename;
      const newBook = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${filename}`,
      });
      return newBook.save();
    })

    .then(() => {
      res.status(201).json({ message: "Livre ajouté avec succès !" });
    })
    .catch((error) => {
      if (savedFilename) {
        deleteImage(savedFilename);
      }
      if (error.name === "ValidationError") {
        return next(new HttpError(400, error.message, error.name));
      } else {
        return next(error);
      }
    });
};

exports.rateBook = (req, res, next) => {
  const userId = req.auth.userId;
  const grade = req.body.rating;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return next(new HttpError(404, "Livre non trouvé."));
      }

      if (book.ratings.find((rating) => rating.userId === userId)) {
        return next(new HttpError(403, "Vous avez déjà noté ce livre."));
      }
      book.ratings.push({ userId, grade });

      const totalRatings = book.ratings.reduce(
        (acc, curr) => acc + curr.grade,
        0
      );
      const average = totalRatings / book.ratings.length;
      book.averageRating = Number(average.toFixed(1));

      book
        .save()
        .then((book) => res.status(200).json(book))
        .catch((error) => next(new HttpError(400, error.message, error.name)));
    })
    .catch((error) => next(error));
};

exports.updateBook = (req, res, next) => {
  let foundBook;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return next(new HttpError(404, "Livre non trouvé."));
      }

      if (book.userId !== req.auth.userId) {
        return next(new HttpError(403, "Unauthorized request"));
      }

      foundBook = book;

      if (req.file) {
        return resizeImage(req.file).then((newFile) => {
          const oldFile = foundBook.imageUrl.split("/images/")[1];
          deleteImage(oldFile);

          const newBookObject = sanitizeData(JSON.parse(req.body.book));
          newBookObject.imageUrl = `${req.protocol}://${req.get(
            "host"
          )}/images/${newFile}`;

          return newBookObject;
        });
      } else {
        return sanitizeData(req.body);
      }
    })
    .then((bookObject) => {
      delete bookObject.userId;
      return Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id },
        { runValidators: true }
      );
    })
    .then(() => res.status(200).json({ message: "Livre modifié !" }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new HttpError(400, error.message, error.name));
      } else {
        return next(error);
      }
    });
};

exports.deleteBook = (req, res, next) => {
  let filename;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return next(new HttpError(404, "Livre non trouvé."));
      }

      if (book.userId !== req.auth.userId) {
        return next(new HttpError(403, "Unauthorized request"));
      }

      filename = book.imageUrl.split("/images/")[1];

      return Book.deleteOne({ _id: req.params.id });
    })
    .then(() => {
      deleteImage(filename);
      res.status(200).json({ message: "Livre supprimé !" });
    })
    .catch((error) => next(error));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return next(new HttpError(404, "Livre non trouvé."));
      }
      res.status(200).json(book);
    })
    .catch((error) => next(error));
};

exports.getBestRatingBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => next(error));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => next(error));
};
