const resizeImage = require("../middleware/sharp");
const Book = require("../models/Book");
const fs = require("fs");

exports.addBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject.userId;

  resizeImage(req.file)
    .then((filename) => {
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
      if (error.name === "ValidationError") {
        res.status(400).json({ error });
      } else {
        res.status(500).json({ error });
      }
    });
};

exports.rateBook = (req, res, next) => {
  const userId = req.auth.userId;
  const grade = req.body.rating;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé." });
      }

      if (book.ratings.find((rating) => rating.userId === userId)) {
        return res.status(403).json({ error: "Vous avez déjà noté ce livre." });
      }
      book.ratings.push({ userId, grade });

      const totalRatings = book.ratings.reduce(
        (acc, curr) => acc + curr.grade,
        0
      );
      book.averageRating = totalRatings / book.ratings.length;

      book
        .save()
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.updateBook = (req, res, next) => {
  let foundBook;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé." });
      }

      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ error: "Unauthorized request" });
      }

      foundBook = book;

      if (req.file) {
        return resizeImage(req.file).then((newFile) => {
          const oldFile = foundBook.imageUrl.split("/images/")[1];
          fs.unlink(`images/${oldFile}`, (err) => {
            if (err)
              console.log("Echec de la suppression de l'ancienne image: ", err);
          });

          return {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${newFile}`,
          };
        });
      } else {
        return { ...req.body };
      }
    })
    .then((bookObject) => {
      delete bookObject.userId;
      return Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      );
    })
    .then(() => res.status(200).json({ message: "Livre modifié !" }))
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé." });
      }

      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ error: "Unauthorized request" });
      }

      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Livre supprimé !" }))
          .catch((error) => res.status(401).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé." });
      }
      res.status(200).json(book);
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getBestRatingBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
