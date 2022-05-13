const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        required: "bookId required",
        refs: 'Book'
    },
    reviewedBy: {
        type: String,
        trim:true,
        required: "reviewed by is required",
        default: "Guest",
        value: "Number",
    },
    reviewedAt: {
        type: Date,
        required: "reviewedAt",
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: "rating is required"
    },
    review: {
        type:String,
        trim:true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

})
module.exports=mongoose.model('Review',reviewSchema)