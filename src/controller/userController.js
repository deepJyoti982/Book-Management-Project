const UserModel = require("../modules/UserModel");
const { isValidRequestBody, isEmpty, isValidPhone, isValidEmail, isValidPassword } = require("../utility/validation")
const jwt = require('jsonwebtoken');



const registerUser = async (req, res) => {
    try {
        const data = req.body;
        
        if (!isValidRequestBody(data)) return res.status(404).send({ status: false, message: "Data not found" })

        let { title, name, phone, email, password, address } = data

        if (isEmpty(title)) return res.status(400).send({ status: false, message: "Title is required" })

        if (isEmpty(name)) return res.status(400).send({ status: false, message: "User name is required" })

        if (isEmpty(phone)) return res.status(400).send({ status: false, message: "Phone Number is required" })
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: `${phone} is not a valid phone number` })
        const isUniquePhone = await UserModel.findOne({ phone: phone }).catch( e => null )
        if (isUniquePhone) return res.status(400).send({ status: false, message: `This phone number ${phone} is already exist` })

        if (isEmpty(email)) return res.status(400).send({ status: false, message: "Email is required" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: `${email} is not a valid email` })
        const isUniqueEmail = await UserModel.findOne({ email: email }).catch( e => null )
        if (isUniqueEmail) return res.status(400).send({ status: false, message: `This email ${email} is already registered` })

        if (isEmpty(password)) return res.status(400).send({ status: false, message: "Password is required" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: ` Password ${password} length must be between 8 and 15 and must contain mix of unique character @#$%&* and a-z, A-Z` })

        let userData = { title, name, phone, email, password, address }
        let user = await UserModel.create(userData)

        

        return res.status(201).send({ status: true, message: "User register sucessfully", data: user })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const loginUser = async function(req,res) {
    try {
        const loginData = req.body;

        if (!isValidRequestBody(loginData)) return res.status(404).send({ status: false, message: "Login data not found" })
        
        const {email,password} = loginData
        
        if (isEmpty(email)) return res.status(400).send({ status: false, message: "Email is required" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: `${email} is not a valid email` })

        if (isEmpty(password)) return res.status(400).send({ status: false, message: "Password is required" })
        
        const user = await UserModel.findOne({email: email, password: password})
        if(!user) {
            return res.status( 400 ).send({ status: false, message: "Email or Password is not correct" })
        }

        let token = jwt.sign(
            {
                userId: user._id.toString(),
                batch: "Uranium",
                organisation: "FunctionUp",
                exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
            },
            "functionUp-Uranium"
        )
        res.setHeader("x-api-key",token)
        res.send({status: true, data: token})
    }
    catch( error ){
        res.status( 500 ).send({status: false, message: error.message})
    }
}
module.exports = { 
    registerUser,
    loginUser 
};