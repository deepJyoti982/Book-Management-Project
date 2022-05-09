const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title must be required',
        unique: true
    },
    excerpt: {
        type: string,
        required: 'Excerpt must be required'
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: 'UserId must be required'
    },
    ISBN: {
        type: String,
        required: 'ISBN must be required',
        unique: true
    },
    category: {
        type: String,
        required: 'Category must be required',
    },
    subcategory: {
        type: [String],
        required: 'Subcategory must be required',
    },
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: String,
        required:'ReleasedAt must be required'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Book', bookSchema)