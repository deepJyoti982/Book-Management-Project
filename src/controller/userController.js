const UserModel = require("../modules/UserModel");



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

module.exports = { registerUser };