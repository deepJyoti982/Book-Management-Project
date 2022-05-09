const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "title is required",
        enum: ['Mr','Mrs', 'Miss']
    },
    name: {
        type: String,
        required: "name is required",
    },
    phone: {
        type: String,
        required: "phone number is required",
        unique: true
    },
    email: {
        type: String,
        required: "email is required",
        unique: true
    },
    password: {
        type: String,
        required: "password is required",
        minlength: 8,
        maxlength: 15
    },
    address: {
        street: { type: String },
        city: { type: String },
        pincode: { type: String }
    }
}, { timestamps: true })

module.exports=mongoose.model('User',userSchema)