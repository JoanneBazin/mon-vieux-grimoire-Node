const Book = require("../models/Book");

exports.addBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject.userId;

  const newBook = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  newBook
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre ajouté avec succès !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
