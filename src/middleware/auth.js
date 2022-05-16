const validation = require('../utility/validation')
const booksModel = require('../modules/BooksModel')
const UserModel = require('../modules/UserModel')
const jwt = require('jsonwebtoken')
const { isValidObjectId } = require("../utility/validation")

//authentication

const authenticate = (req, res, next) => {
    try {
        // get header key
        const token = req.headers['x-auth-key'] || req.headers['X-AUTH-KEY'] || req.headers['x-api-key']
        if (validation.isEmpty(token)) return res.status(400).send({
            status: false,
            message: 'token is required!'
        }) //if token is empty

        // decode token data
        jwt.verify(token, 'functionUp-Uranium', (err, decode) => {
            if (err) {
                return res.status(401).send({
                    status: false,
                    message: err.message
                })
            } else {
                req.decodeToken = decode
                next()
            }
        })
    } catch (e) {
        res.status(500).send({
            status: false,
            message: e.message
        })
    }
}

//user authrization

const userAuthrization = async (req, res, next) => {
    try {
        //userId from body
        let userId = req.body.userId
        //userId from decoded token
        let tokenUserId = req.decodeToken.userId
        //checking if userId coming from body or not.
        if (!userId) return res.status(400).send({
            status: false,
            message: "Please mention a proper User Id"
        })
        //checking if userId is present in DB
        const isIdExist = await UserModel.findOne({
            _id: userId
        }).catch(e => null);
        if (!isIdExist) return res.status(404).send({
            status: false,
            message: "User Id does not exist"
        })

        //checking valid token userid 
        if (userId !== tokenUserId) return res.status(401).send({
            status: false,
            message: "User not Authorised to create a new Book"
        })
        next();
    } catch (e) {
        res.status(500).send({
            status: false,
            message: e.message
        })
    }
}

//book authrization

const bookAuthorization = async (req, res, next) => {
    try {
        // get book from params
        const bookId = req.params.bookId
        //checking valid BOOKID
        if (!isValidObjectId(bookId)) return res.status(400).send({
            status: false,
            message: "BookId invalid"
        })

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
    userAuthrization,
    bookAuthorization
}