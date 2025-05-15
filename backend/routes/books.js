const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const booksCtrl = require("../controllers/books");

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: Return a list of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "1"
 *                   title:
 *                     type: string
 *                     example: "Design Anthology"
 *                   author:
 *                     type: string
 *                     example: "James Doe"
 *                   imageUrl:
 *                     type: string
 *                     example: "http://localhost:4000/images/DesignAnthology1746623647265.webp"
 *                   year:
 *                     type: number
 *                     example: 2022
 *                   genre:
 *                     type: string
 *                     example: "Architecture"
 *                   ratings:
 *                     type: array
 *                     example: [{userId: "1", grade: 5}]
 *                   averageRating:
 *                     type: number
 *                     example: 5
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/", booksCtrl.getAllBooks);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Cover image of the book
 *               book:
 *                 type: string
 *                 description: JSON string with book data (userId, title, author, year, genre, ratings, averageRating)
 *                 example: '{"userId": "1","title":"Book Title","author":"Author Name","year":2023,"genre":"Fiction","ratings":[{"userId":"12345","grade":5}],"averageRating":5}'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Livre ajouté avec succès !"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed: year: Path `year` is required."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/", auth, multer, booksCtrl.addBook);

/**
 * @swagger
 * /books/bestrating:
 *   get:
 *     summary: Get the 3 best rated books
 *     responses:
 *       200:
 *         description: Return a list of the 3 best rated books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "1"
 *                   title:
 *                     type: string
 *                     example: "Design Anthology"
 *                   author:
 *                     type: string
 *                     example: "James Doe"
 *                   imageUrl:
 *                     type: string
 *                     example: "http://localhost:4000/images/DesignAnthology1746623647265.webp"
 *                   year:
 *                     type: number
 *                     example: 2022
 *                   genre:
 *                     type: string
 *                     example: "Architecture"
 *                   ratings:
 *                     type: array
 *                     example: [{userId: "1", grade: 5}]
 *                   averageRating:
 *                     type: number
 *                     example: 5
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/bestrating", booksCtrl.getBestRatingBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to get
 *     responses:
 *       200:
 *         description: Return a single book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "1"
 *                 title:
 *                   type: string
 *                   example: "Design Anthology"
 *                 author:
 *                   type: string
 *                   example: "James Doe"
 *                 imageUrl:
 *                   type: string
 *                   example: "http://localhost:4000/images/DesignAnthology1746623647265.webp"
 *                 year:
 *                   type: number
 *                   example: 2022
 *                 genre:
 *                   type: string
 *                   example: "Architecture"
 *                 ratings:
 *                   type: array
 *                   example: [{userId: "1", grade: 5}]
 *                 averageRating:
 *                   type: number
 *                   example: 5
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/:id", booksCtrl.getOneBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Cover image of the book
 *               book:
 *                 type: string
 *                 description: JSON string with book data (userId, title, author, year, genre, ratings, averageRating)
 *                 example: '{"userId": "1","title":"Book Title","author":"Author Name","year":2023,"genre":"Fiction","ratings":[{"userId":"12345","grade":5}],"averageRating":5}'
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "1"
 *               title:
 *                 type: string
 *                 example: "Design Anthology"
 *               author:
 *                 type: string
 *                 example: "James Doe"
 *               year:
 *                 type: number
 *                 example: 2022
 *               genre:
 *                 type: string
 *                 example: "Architecture"
 *     responses:
 *       200:
 *         description: Return book updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Livre modifié !"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed: year: Path `year` is required."
 *       403:
 *         description: Unauthorized request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized request"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Livre non trouvé."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.put("/:id", auth, multer, booksCtrl.updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to delete
 *     responses:
 *       200:
 *         description: Successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Livre supprimé !"
 *       403:
 *         description: Unauthorized request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized request"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Livre non trouvé."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.delete("/:id", auth, multer, booksCtrl.deleteBook);

/**
 * @swagger
 * /books/{id}/rating:
 *   post:
 *     summary: Rate a book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to rate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "1"
 *               grade:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Return rated book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "1"
 *                 title:
 *                   type: string
 *                   example: "Design Anthology"
 *                 author:
 *                   type: string
 *                   example: "James Doe"
 *                 imageUrl:
 *                   type: string
 *                   example: "http://localhost:4000/images/DesignAnthology1746623647265.webp"
 *                 year:
 *                   type: number
 *                   example: 2022
 *                 genre:
 *                   type: string
 *                   example: "Architecture"
 *                 ratings:
 *                   type: array
 *                   example: [{userId: "1", grade: 5}]
 *                 averageRating:
 *                   type: number
 *                   example: 5
 *       403:
 *         description: Unauthorized request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vous avez déjà noté ce livre."
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Livre non trouvé."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/:id/rating", auth, booksCtrl.rateBook);

module.exports = router;
