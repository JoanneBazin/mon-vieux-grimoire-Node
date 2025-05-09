const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1455,
    max: new Date().getFullYear(),
  },
  genre: {
    type: String,
    required: true,
  },
  ratings: [
    {
      userId: {
        type: String,
        required: true,
      },
      grade: {
        type: Number,
        required: true,
        min: [1, "La note doit être comprise entre 1 et 5"],
        max: [5, "La note doit être comprise entre 1 et 5"],
      },
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Book", bookSchema);
