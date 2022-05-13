const validation = require('../utility/validation')
const booksModel = require('../modules/BooksModel')
const jwt = require('jsonwebtoken')

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
        let decode;
        jwt.verify(token, 'functionUp-Uranium', (err, dec) => {
             if (err) {return res.status(401).send({
            status: false,
            message: err.message
        })} else {
           decode = dec
        req.decodeToken = decode 
        next()
        }
        
        })
        //dont use this
        // let currentTime = Math.floor(Date.now() / 1000)
        // if (currentTime > decode.exp) return res.status(401).send({
        //     status: false,
        //     message: 'Your token has expired'
        // }) //if token exp time expired

        //console.log(req.decodeToken)

        
    } catch (e) {
        res.status(500).send({
            status: false,
            message: e.message
        })
    }
}

//user authrization

const userAuthrization = (req, res, next) => {
    try {
        //userId from body
        let userId = req.body.userId
        //userId from decoded token
        let tokenUserId = req.decodeToken.userId
        //checking wheather same or not
        if (userId !== tokenUserId) return res.status(401).send({
            status: false,
            message: "User not Authorised to create a new Book"
        })
        next();
    }
    catch (e) {
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