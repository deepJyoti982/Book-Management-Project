const express = require('express');
let router = express.Router();
const user = require('../controller/userController')


router.post("/", (req, res) => {
    res.send('ok')
})

router.post("/register", user.registerUser)


module.exports = router;