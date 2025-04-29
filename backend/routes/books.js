const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const booksCtrl = require("../controllers/books");

router.get("/", booksCtrl.getAllBooks);
router.post("/", auth, multer, booksCtrl.addBook);

module.exports = router;
