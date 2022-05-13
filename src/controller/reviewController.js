const reviewsModel = require('../modules/ReviewModel')
const booksModel = require('../modules/BooksModel')
const validation = require('../utility/validation')


// POST /books/:bookId/review
const create = async (req, res) => {
    try {
        // get book id
        const bookId = req.params.bookId
        // get review data from body
        const revData = req.body
        if (!validation.isValidRequestBody(revData)) return res.status(400).send({
            status: false,
            message: 'body is required for create review!'
        })

        // De structure
        const {
            reviewedBy,
            rating,
            review
        } = revData

        // basic validation
        // if (validation.isEmpty(reviewedBy)) return res.status(400).send({
        //     status: false,
        //     message: 'ReviewedBy is required!'
        // })

        if (validation.isEmpty(rating)) return res.status(400).send({
            status: false,
            message: 'Rating is required!'
        })

        // Rating must be in 1 to 5
        if (rating < 1 || rating > 5) return res.status(400).send({
            status: false,
            message: 'Rating must be in 1 to 5!'
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
            await isBook.save();
        }

        const result = {
            _id: reviewData._id,
            bookId: reviewData.bookId,
            reviewedBy: reviewData.reviewedBy,
            reviewedAt: reviewData.reviewedAt,
            rating: reviewData.rating,
            review: reviewData.review
        }

        res.status(200).send({
            status: true,
            data: await bookWithReviewLisrt(bookId)
        })

    } catch (e) {
        res.status(500).send({
            status: false,
            message: e.message
        })
    }
}




// PUT /books/:bookId/review/:reviewId | Update the review - review, rating, reviewer's name
const update = async (req, res) => {
    try {

        // get book id
        const bookId = req.params.bookId
        // get review id id
        const reviewId = req.params.reviewId
        // get revirw data from body for updata
        const dataForUpdate = req.body
        // dataForUpdate is valid or not
        if (!validation.isValidRequestBody(dataForUpdate)) return res.status(400).send({
            status: false,
            message: "Body is required!"
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
            message: "Book already deleted, can't add review!"
        })


        // check Review from db ---
        const isReview = await reviewsModel.findById(reviewId).catch(_ => null)
        // check if exist or not
        if (!isReview) return res.status(404).send({
            status: false,
            message: 'Review not found!'
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
            data:  await bookWithReviewLisrt(bookId)
        })

    } catch (e) {
        console.log(e)
        res.status(500).send({
            status: false,
            message: e.message
        })
    }
}





// DELETE /books/:bookId/review/:reviewId
const deleted = async (req, res) => {
    try {
        // get book id
        const bookId = req.params.bookId
        // get review id id
        const reviewId = req.params.reviewId

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


        // check Review from db ---
        const isReview = await reviewsModel.findById(reviewId).catch(_ => null)
        // check if exist or not
        if (!isReview) return res.status(404).send({
            status: false,
            message: 'Review not found!'
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
const bookWithReviewLisrt = async (bookId) => {
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
        bookId, isDeleted : false
    }).select({ __v : 0, isDeleted : 0}).catch(_ => [])
    output.reviewsData = reviewArr
    return output
}



module.exports = {
    create,
    deleted,
    update
}