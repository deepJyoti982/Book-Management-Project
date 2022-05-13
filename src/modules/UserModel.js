const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: "title is required",
        enum: ['Mr', 'Mrs', 'Miss']
    },
    name: {
        type: String,
        trim: true,
        required: "name is required",
    },
    phone: {
        type: String,
        trim: true,
        required: "phone number is required",
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: "email is required",
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: "password is required",
        minlength: 8,
        maxlength: 15
    },
    address: {
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        pincode: {
            type: String,
            trim: true,
        }
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)