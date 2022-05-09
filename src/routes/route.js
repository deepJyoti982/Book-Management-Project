const express = require('express');
let router = express.Router();



router.post("/", (req, res) => {
    res.send('ok')
})







module.exports = router;