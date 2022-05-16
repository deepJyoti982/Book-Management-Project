const reviewsModel = require('../modules/ReviewModel')
const booksModel = require('../modules/BooksModel')
const validation = require('../utility/validation')
const { isValidObjectId } = require("../utility/validation")


//=====================================================[CREATE REVIEW API]============================================================
const create = async (req, res) => {
    try {
        // get book id
        const bookId = req.params.bookId
        //check valid Book ID
        if (!isValidObjectId(bookId)) return res.status(400).send({
            status: false,
            message: "BookId invalid"
        })
        // get review data from body
        const revData = req.body
        if (!validation.isValidRequestBody(revData)) return res.status(400).send({
            status: false,
            message: 'body is required for create review!'
        })

        // Destructure
        let {
            reviewedBy,
            rating,
            review
        } = revData

        // VALIDATION
        if (validation.isEmpty(reviewedBy)) {
            reviewedBy = "Guest"
        }

        if (validation.isEmpty(rating)) return res.status(400).send({
            status: false,
            message: 'Rating is required!'
        })
        // Rating must be in 1 to 5
        if (typeof rating !== 'number') return res.status(400).send({ Status: false, message: "rating must be number only" })
        if (rating < 1 || rating > 5) return res.status(400).send({
            status: false,
            message: 'Rating must be in 1 to 5!'
        })

        if (Object.keys(revData).indexOf("review") !== -1) {
            if (validation.isEmpty(review)) return res.status(400).send({
                status: false, message: "Declared review is empty, You need to add some value"
            })
        }

        // check book from db ---
        const isBook = await booksModel.findById(bookId).catch(_ => null)
        // check if exist or not
        if (!isBook) return res.status(404).send({
            status: false,
            message: 'Book not found!'
        })

        // check if book is deleted
        if (isBook.isDeleted) return res.status(404).send({
            status: false,
            message: "Book already deleted, can't add review!"
        })

        let tempObj = {
            reviewedBy,
            rating,
            review,
            bookId,
            reviewedAt: new Date()
        }
        // save doc in db
        const reviewData = await reviewsModel.create(tempObj)

        // if new review created successfully
        if (reviewData) {
            // increment 1 and save book
            let inc = isBook.reviews + 1;
            isBook.reviews = inc
            await isBook.save();//The save() method is asynchronous, so it returns a promise that you can await on.
        }

        res.status(201).send({
            status: true,
            data: await bookWithReviewList(bookId)
        })

    } catch (e) {
        res.status(500).send({
            status: false,
            message: e.message
        })
    }
}



//=====================================================[UPDATE REVIEW API]============================================================

const update = async (req, res) => {
    try {

        // get book id
        const bookId = req.params.bookId
        if (!isValidObjectId(bookId)) return res.status(400).send({
            status: false,
            message: "BookId invalid"
        })
        // get review id id
        const reviewId = req.params.reviewId
        if (!isValidObjectId(reviewId)) return res.status(400).send({
            status: false,
            message: "ReviewId invalid"
        })
        // get revirw data from body for updata
        const dataForUpdate = req.body
        // dataForUpdate is valid or not
        if (!validation.isValidRequestBody(dataForUpdate)) return res.status(400).send({
            status: false,
            message: "Data for updation is required!"
        })

        // check book from db ---
        const isBook = await booksModel.findById(bookId).catch(_ => null)
        // check if exist or not
        if (!isBook) return res.status(404).send({
            status: false,
            message: 'Book not found!'
        })

        // check if book is deleted
        if (isBook.isDeleted) return res.status(404).send({
            status: false,
            message: "Book already deleted, can't create a review!"
        })


        // check Review from db ---
        const isReview = await reviewsModel.findById(reviewId).catch(_ => null)
        // check if exist or not
        if (!isReview) return res.status(404).send({
            status: false,
            message: 'Review not found!'
        })

        // check if ReviewId OR bookId are not related to each other
        if (isReview.bookId.toString() !== bookId) return res.status(404).send({
            status: false,
            message: "ReviewId does not belong to particular book !"
        })

        // check if Review is deleted
        if (isReview.isDeleted) return res.status(404).send({
            status: false,
            message: "Review already deleted!"
        })

        // destructure body data
        let {
            review,
            rating,
            reviewedBy
        } = dataForUpdate

        // validate review's review, rating, name
        if (!validation.isEmpty(review)) {
            isReview.review = review
        }

        // review validation
        if (typeof rating !== 'number') return res.status(400).send({ Status: false, message: "rating must be number only" })
        if (!validation.isEmpty(rating)) {
            // Rating must be in 1 to 5
            if (rating < 1 || rating > 5) return res.status(400).send({
                status: false,
                message: 'Rating must be in 1 to 5!'
            })
            // overwrite rating if ok case
            isReview.rating = rating
        }

        if (!validation.isEmpty(reviewedBy)) {
            isReview.reviewedBy = reviewedBy
        }

        // update review Data by using .save()
        await isReview.save()
        res.status(200).send({
            status: true,
            data: await bookWithReviewList(bookId)
        })

    } catch (e) {
        res.status(500).send({
            status: false,
            message: e.message
        })
    }
}





//=====================================================[DELETE REVIEW API]============================================================

const deleted = async (req, res) => {
    try {
        // get book id
        const bookId = req.params.bookId
        if (!isValidObjectId(bookId)) return res.status(400).send({
            status: false,
            message: "BookId invalid"
        })
        // get review id id
        const reviewId = req.params.reviewId
        if (!isValidObjectId(reviewId)) return res.status(400).send({
            status: false,
            message: "ReviewId invalid"
        })

        // check book from db ---
        const isBook = await booksModel.findById(bookId).catch(_ => null)
        // check if exist or not
        if (!isBook) return res.status(404).send({
            status: false,
            message: 'Book not found!'
        })

        // check if book is deleted
        if (isBook.isDeleted) return res.status(404).send({
            status: false,
            message: "Book already deleted !"
        })


        // check Review from db ---
        const isReview = await reviewsModel.findById(reviewId).catch(_ => null)
        // check if exist or not
        if (!isReview) return res.status(404).send({
            status: false,
            message: 'Review not found!'
        })

        // check if ReviewId OR bookId are not related to each other
        if (isReview.bookId.toString() !== bookId) return res.status(404).send({
            status: false,
            message: "ReviewId does not belong to particular book !"
        })

        // check if Review is deleted
        if (isReview.isDeleted) return res.status(404).send({
            status: false,
            message: "Review already deleted!"
        })

        // apply delete review
        isReview.isDeleted = true
        await isReview.save()

        // decress 1 from book's reviews
        let dec = isBook.reviews - 1;
        isBook.reviews = dec
        await isBook.save();



        res.status(200).send({
            status: true,
            data: "Review deleted successfully and book doc updated!"
        })



    } catch (e) {
        res.status(500).send({
            status: false,
            message: e.message
        })
    }
}



// ⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕
// book doc with review arr 👉 use if required
const bookWithReviewList = async (bookId) => {
    const bookDoc = await booksModel.findById(bookId).catch(_ => null)
    let output = {
        _id: bookDoc._id,
        title: bookDoc.title,
        excerpt: bookDoc.excerpt,
        userId: bookDoc.userId,
        category: bookDoc.category,
        subcategory: bookDoc.subcategory,
        deleted: bookDoc.deleted,
        reviews: bookDoc.reviews,
        deletedAt: bookDoc.deletedAt,
        releasedAt: bookDoc.releasedAt,
        createdAt: bookDoc.createdAt,
        updatedAt: bookDoc.updatedAt
    }

    // get arr of reviews
    const reviewArr = await reviewsModel.find({
        bookId,
        isDeleted: false
    }).select({
        __v: 0,
        isDeleted: 0
    }).catch(_ => [])
    output.reviewsData = reviewArr
    return output
}



module.exports = {
    create,
    deleted,
    update
}