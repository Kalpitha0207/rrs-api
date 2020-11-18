const mongoose = require('mongoose');
const router = require('express').Router();

router.post('/signup', (req, res) => {
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;

    if (!email) {
        res.send(JSON.stringify({ "Message": "Name Required!" }))
    }
    if (!name) {
        res.send(JSON.stringify({ "Message": "Name Required!" }))
    }
    if (!password) {
        res.send(JSON.stringify({ "Message": "Name Required!" }))
    }
    res.send(JSON.stringify({
        "Message": "Saved"
    }))

})

module.exports = router;