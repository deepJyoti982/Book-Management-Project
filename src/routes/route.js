const express = require('express');
let router = express.Router();
const user = require('../controller/userController')
const book = require('../controller/bookController')
const {authenticate, bookAuthorization} = require('../middleware/auth')

router.post("/", (req, res) => {
    res.send('ok')
})

// User
router.post("/register", user.registerUser)
router.post("/login", user.loginUser)

// Books
router.post("/books",authenticate, book.createBook )
router.put("/books/:bookId",authenticate,bookAuthorization,book.bookUpdate)
router.delete("/books/:bookId",authenticate,bookAuthorization,book.delBookById)


module.exports = router;