const mongoose = require('mongoose');
const router = require('express').Router();
const Rooms = mongoose.model('Rooms');
const Admin = mongoose.model('Admin')

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

    var admin = new Admin();
    admin.name = req.body.name;
    admin.email = req.body.email;
    admin.password = admin.setPassword(req.body.password)
    Admin.find({ name: admin.name }, (err, admn) => {
        if (admn.length == 0) {
            admin.save((err, inserted) => {
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
                            message: 'Admin inserted!'
                        }
                    });
                }
            })
        } else {
            return res.json({
                message: 'Admin already available',
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

    Admin.findOne({ name: req.body.email }, (err, admin) => {
        if (admin && admin.validatePassword(req.body.password)) {
            return res.json({
                message: 'Admin signed in successfully!',
                token: admin.generateJWT(),
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


// ADD NEW ROOM 
router.post('/addRoom', (req, res) => {
    if (!req.body.roomNo || !req.body.roomType || !req.body.roomFare
        || !req.body.noOfBeds || !req.body.noOfAdults || !req.body.noOfChildren || !req.body.description) {
        return res.status(422).json({
            errors: {
                message: 'Please enter all required fields!'
            }
        })
    }

    var details = new Rooms();
    details.roomNo = req.body.roomNo;
    details.roomType = req.body.roomType;
    details.roomFare = req.body.roomFare;
    details.noOfBeds = req.body.noOfBeds;
    details.noOfAdults = req.body.noOfAdults;
    details.noOfChildren = req.body.noOfChildren;
    details.description = req.body.description;

    details.save((err, inserted) => {
        if (err) {
            return res.status(422).json({
                errors: {
                    status: "Failed",
                    message: err.errmsg
                }
            });
        } else {
            return res.status(200).json({
                success: {
                    message: "Room added successfully!",
                    data: inserted,
                }
            });
        }
    });
})

router.get('/getAvaibleRooms', (req, res) => {
    Rooms.find({ "booked": false }, (err, rooms) => {
        if (err) {
            return res.status(422).json({
                errors: {
                    status: "Failed",
                    message: err.errmsg
                }
            })
        } else {
            return res.status(200).json({
                success: {
                    data: rooms,
                }
            });
        }
    })
})

module.exports = router;