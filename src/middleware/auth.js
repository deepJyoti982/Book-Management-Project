const validation = require('../utility/validation')
const booksModel = require('../modules/BooksModel')
const jwt = require('jsonwebtoken')
const authenticate = (req, res, next) => {
    try {
        // get header key
        const token = req.headers['x-auth-key'] || req.headers['X-AUTH-KEY']
        if (validation.isEmpty(token)) return res.status(400).send({
            status: false,
            message: 'token is required!'
        }) //if token is empty

        // decode token data
        const decode = jwt.verify(token, 'functionUp-Uranium')
        let currentTime = Math.floor(Date.now() / 1000)
        if (currentTime > decode.exp) return res.status(401).send({
            status: false,
            message: 'Your token has expired'
        }) //if token exp time expired

        req.decodeToken = decode
        //console.log(req.decodeToken)

        next()
    } catch (e) {
        res.status(500).send({
            status: false,
            message: e.message
        })
    }
}


const bookAuthorization = async (req, res, next) => {
    try {
        // get book from params
        const bookId = req.params.bookId

        // check book exist or not
        let validBookId = await booksModel.findById(bookId).catch(err => null)
        //console.log(validBookId)
        if (!validBookId) return res.status(404).send({
            status: false,
            message: "Book ID invalid no such book found"
        })

        // get userId from decoded token
        const userId = req.decodeToken.userId
        //console.log(userId)

        // check authorised user
        if (validBookId.userId.toString() !== userId) return res.status(403).send({
            status: false,
            message: 'Unauthorised user!'
        }) //if Unauthorised user

        next()
    } catch (e) {
        res.status(500).send({
            status: false,
            message: e.message
        })
    }
}







module.exports = {
    authenticate,
    bookAuthorization
}