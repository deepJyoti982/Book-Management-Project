const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        trim:true,
        required: 'Title must be required',
        unique: true
    },
    excerpt: {
        type: String,
        trim:true,
        required: 'Excerpt must be required'
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: 'UserId must be required'
    },
    ISBN: {
        type: String,
        trim:true,
        required: 'ISBN must be required',
        unique: true
    },
    category: {
        type: String,
        trim:true,
        required: 'Category must be required',
    },
    subcategory: {
        type: [String],
        trim:true,
        required: 'Subcategory must be required',
    },
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: String,
        trim:true,
        required:'ReleasedAt must be required'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Book', bookSchema)