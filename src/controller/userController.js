const UserModel = require("../modules/UserModel");
const { isValidRequestBody, isEmpty, isValidPhone, isValidEmail } = require("../utility/validation")


const registerUser = async (req, res) => {
    try {
        const data = req.body;
        
        if (!isValidRequestBody(data)) return res.status(404).send({ status: false, msg: "Data not found" })

        let { title, name, phone, email, password, address } = data

        if (isEmpty(title)) return res.status(400).send({ status: false, msg: "Title is required" })

        if (isEmpty(name)) return res.status(400).send({ status: false, msg: "User name is required" })

        if (isEmpty(phone)) return res.status(400).send({ status: false, msg: "Phone Number is required" })
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, msg: `${phone} is not a valid phone number` })
        const isUniquePhone = await UserModel.findOne({ phone: phone }).catch( e => null )
        if (isUniquePhone) return res.status(400).send({ status: false, message: `This phone number ${phone} is already exist` })

        if (isEmpty(email)) return res.status(400).send({ status: false, msg: "Email is required" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: `${email} is not a valid email` })
        const isUniqueEmail = await UserModel.findOne({ email: email }).catch( e => null )
        if (isUniqueEmail) return res.status(400).send({ status: false, message: `This email ${email} is already registered` })

        if (isEmpty(password)) return res.status(400).send({ status: false, msg: "Password is required" })

        let userData = { title, name, phone, email, password, address }
        let user = await UserModel.create(userData)

        return res.status(201).send({ status: true, msg: "User register sucessfully", data: user })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err })
    }
}

module.exports = { registerUser };