const mongoose = require('mongoose');
const router = require('express').Router();
var auth = require('../../routes/auth');

const Users = mongoose.model('User')
const Reservation = mongoose.model('Reservation');
const Rentals = mongoose.model('Rentals');
const MealReservation = mongoose.model('MealReservation');
const ChargeToRoom = mongoose.model('ChargeToRoom');
const Payment = mongoose.model('Payment');

router.post('/signup', (req, res) => {

    if (!req.body.email) {
        return res.status(422).json({
            errors: {
                message: 'Email required!',
            },
        });
    }
    if (!req.body.name) {
        return res.status(422).json({
            errors: {
                message: 'Name required!',
            },
        });
    }
    if (!req.body.password) {
        return res.status(422).json({
            errors: {
                message: 'Password required!',
            },
        });
    }

    var user = new Users();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = user.setPassword(req.body.password)
    Users.find({ name: user.name }, (err, User) => {
        if (User.length == 0) {
            user.save((err, inserted) => {
                if (err) {
                    logger.error(err);
                    return res.status(500).json({
                        errors: {
                            message: 'Internal Server Error'
                        }
                    });
                } else {
                    return res.json({
                        Success: {
                            message: 'User inserted!'
                        }
                    });
                }
            })
        } else {
            return res.json({
                message: 'User already available',
            });
        }
    })
})

router.post('/signin', (req, res) => {

    if (!req.body.email) {
        return res.status(422).json({
            errors: {
                message: 'Email required!',
            },
        });
    }

    if (!req.body.password) {
        return res.status(422).json({
            errors: {
                message: 'Password required!',
            },
        });
    }

    Users.findOne({ name: req.body.email }, (err, user) => {
        if (user && user.validatePassword(req.body.password)) {
            return res.json({
                message: 'user signed in successfully!',
                token: user.generateJWT(),
            });
        } else {
            return res.status(422).json({
                errors: {
                    message: 'username or password wrong',
                },
            });;
        }
    })
});

module.exports = router;