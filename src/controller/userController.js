const UserModel = require("../modules/UserModel");
const jsonwebtoken = require('jsonwebtoken');
const { functions } = require("lodash");



const registerUser = async (req, res) => {
    try {
        const data = req.body;
        
        let { title, name, phone, email, password } = data

        let userData = { title, name, phone, email, password }
        let user = await collegeModel.create(userData)

        return res.status(201).send({ status: true, msg:"User register sucessfully", data: user })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


const loginUser = async function(req,res) {
    try {
        const loginData = req.body;
        //validation needed
        const {email,password} = loginData
        //validation needed
        const user = await UserModel.findOne({email: email, password: password})
        if(!user) {
            return res.status( 400 ).send({ status: false, msg: "username or the password is not correct" })
        }

        let token = jwt.sign(
            {
                userId: user._id.toString(),
                batch: "Uranium",
                organisation: "FunctionUp",
            },
            "functionUp-Uranium"
        )
        res.setHeader("x-api-key",token)
        res.send({status: true, data: token})
    }
    catch( error ){
        res.status( 500 ).send(error.message)
    }
}
module.exports = { 
    registerUser,
    loginUser 
};