const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const booksRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB !"))
  .catch(() => console.log("Connection to MongoDB failed !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/books", booksRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
