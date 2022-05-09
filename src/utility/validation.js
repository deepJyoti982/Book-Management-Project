const ObjectId = require("mongoose").Types.ObjectId

let isValidRequestBody = function (body) {
    if (Object.keys(body).length === 0) return false;
    return true;
}

let isEmpty = function (value) {
    if (typeof value === 'undefined' || value === null) return true;
    if (typeof value === 'string' && value.trim().length === 0) return true;
    return false;
}

let isValidPhone = function (number) {
    let phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
}

let isValidEmail = function (email) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
}

let isValidPassword = function (password) {
    let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return passwordRegex.test(password)
}

module.exports = { isValidRequestBody, isEmpty, isValidEmail, isValidPhone, isValidPassword }