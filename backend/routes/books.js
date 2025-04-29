const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const booksCtrl = require("../controllers/books");

router.get("/", auth, booksCtrl.getAllBooks);
router.post("/", auth, multer, booksCtrl.addBook);
router.get("/bestrating", auth, booksCtrl.getBestRatingBooks);
router.get("/:id", auth, booksCtrl.getOneBook);
router.put("/:id", auth, multer, booksCtrl.updateBook);
router.delete("/:id", auth, multer, booksCtrl.deleteBook);

module.exports = router;
