const { json } = require('body-parser');
const mongoose = require('mongoose');
const router = require('express').Router();

const Users = mongoose.model('User')
const Reservation = mongoose.model('Reservation');
const Rentals = mongoose.model('Rentals');
const MealReservation = mongoose.model('MealReservation');
const ChargeToRoom = mongoose.model('ChargeToRoom');
const Payment = mongoose.model('Payment');
const Rooms = mongoose.model('Rooms');

// RESERVATION 
router.post('/roomReservation', (req, res) => {
    if (!req.body.userId || !req.body.reservationType || !req.body.roomId || !req.body.fromDate || !req.body.toDate
        || !req.body.noOfRooms || !req.body.noOfAdults) {
        return res.status(422).json({
            errors: {
                message: 'Please enter all required fields!'
            }
        })
    }
    var reservation = new Reservation();
    reservation.userId = req.body.userId;
    reservation.reservationType = req.body.reservationType;
    reservation.fromDate = new Date(req.body.fromDate);
    reservation.toDate = new Date(req.body.toDate);
    reservation.noOfRooms = req.body.noOfRooms;
    reservation.noOfAdults = req.body.noOfAdults;
    reservation.noOfChildren = req.body.noOfChildren;

    Users.findOne({ _id: req.body.userId }, (err, user) => {
        if (!user) {
            return res.json({
                message: 'user not registered!',
            });
        } else {
            Rooms.aggregate([
                {
                    $graphLookup: {
                        from: "reservations",
                        startWith: "$_id",
                        connectFromField: "_id",
                        connectToField: "roomId",
                        as: "reserved",
                        restrictSearchWithMatch: { $and: [{ fromDate: { $lte: reservation.fromDate }, toDate: { $gt: reservation.toDate } }] }
                    }
                }, {
                    $project: {
                        _id: 1,
                        roomNo: 1,
                        roomFare: 1,
                        reserved: { $size: '$reserved' }
                    }
                },
                {
                    $match: {
                        reserved: 0
                    }
                }
            ], (err, result) => {
                if (result.length >= reservation.noOfRooms) {
                    for (var key in result) {
                        reservation.roomId = result[key]._id
                        reservation.roomNo = result[key].roomNo
                        reservation.totalFare = result[key].roomFare
                    }
                    for (var i = 0; i < reservation.noOfRooms; i++) {
                        reservation.save((err, data) => {
                            if (err) {
                                return res.status(422).json({
                                    errors: {
                                        status: "Booking failed!",
                                        message: err.errmsg
                                    }
                                });
                            } else {
                                return res.json({
                                    Success: {
                                        "message": 'Reservation completed!',
                                        "data": data,
                                    }
                                });
                            }
                        })
                    }
                } else {
                    return res.status(422).json({
                        errors: {
                            status: false,
                            messae: result.length + " Rooms available."
                        }
                    });
                }


            })
        }
    })
});

// Get reservations
router.post('/getUserRoomReservations', (req, res) => {

    var user_id = req.body.userId;
    Reservation.find({ "userId": user_id }, (err, reservations) => {
        if (reservations) {
            return res.json({
                "Reservations": reservations
            });
        } else {
            return res.status(422).json({
                errors: {
                    message: 'Failed to get details',
                },
            });;
        }
    })
});

// RENTALS AND HIKES
router.post('/rentalsHikes', (req, res) => {
    const { equipmentType, fromDate, toDate, noOfBikes, picnicLunch, userId } = req.body;

    if (!equipmentType || !fromDate || !toDate || !noOfBikes) {
        return res.status(422).json({
            errors: {
                message: 'Please enter all required fields!'
            }
        })
    }
    if (typeof noOfBikes !== 'number') {
        return res.status(422).json({
            errors: {
                message: 'No Of Bikes should be number'
            }
        })
    }

    var rentals = new Rentals();
    rentals.userId = userId;
    rentals.equipmentType = equipmentType;
    rentals.fromDate = fromDate;
    rentals.toDate = toDate;
    rentals.noOfBikes = noOfBikes;
    rentals.picnicLunch = picnicLunch;

    // HERE WE NEED TO CHECK WHETHER RENTAL BIKES ARE AVAILABLE OR NOT
    // if (Rentals.length == 0 || Rentals.length > noOfBikes) {
    rentals.save((err, inserted) => {
        if (err) {
            const errMsg = JSON.parse(JSON.stringify(err)).message;
            return res.status(422).json({
                errors: {
                    status: "Rentals and Hikes not completed!",
                    message: errMsg
                }
            });
        } else {
            return res.status(200).json({
                success: {
                    message: "Rentals and Hikes succefully completed",
                    data: inserted
                }
            });
        }
    });
    // }
});

// Get reservations
router.post('/getrentalsHikes', (req, res) => {

    var user_id = req.body.userId;
    Rentals.find({ "userId": user_id }, (err, reservations) => {
        if (reservations) {
            return res.json({
                "Reservations": reservations
            });
        } else {
            return res.status(422).json({
                errors: {
                    message: 'Failed to get details',
                },
            });;
        }
    })
});

// MEAL RESERVATION
router.post('/mealReservation', (req, res) => {
    const { type, guestName, roomNo, reservationDate, noOfPeople, specialRequest, userId } = req.body;
    if (!type || !guestName || !roomNo || !reservationDate || !noOfPeople) {
        return res.status(422).json({
            errors: {
                message: 'Please enter all required fields!'
            }
        })
    }
    if (typeof noOfPeople !== 'number' || typeof roomNo !== 'number') {
        return res.status(422).json({
            errors: {
                message: 'Room Number and No of people should be number'
            }
        })
    }

    var mealReservation = new MealReservation();
    mealReservation.userId = userId;
    mealReservation.type = type;
    mealReservation.guestName = guestName;
    mealReservation.roomNo = roomNo;
    mealReservation.reservationDate = reservationDate;
    mealReservation.noOfPeople = noOfPeople;
    mealReservation.specialRequest = specialRequest;

    // HERE WE NEED TO CHECK WHETHE ROOMS ARE AVAILABLE OR NOT
    // if (MealReservation.length == 0 || MealReservation.length > roomNo) {
    mealReservation.save((err, inserted) => {
        if (err) {
            const errMsg = JSON.parse(JSON.stringify(err)).message;
            return res.status(422).json({
                errors: {
                    status: "Meal Reservation not completed!",
                    message: errMsg
                }
            });
        } else {
            return res.status(200).json({
                success: {
                    message: "Meal Reservation succefully completed",
                    data: inserted
                }
            });
        }
    });
    // }
});

// Get reservations
router.post('/getUserMealReservation', (req, res) => {

    var user_id = req.body.userId;
    MealReservation.find({ "userId": user_id }, (err, reservations) => {
        if (reservations) {
            return res.json({
                "Reservations": reservations
            });
        } else {
            return res.status(422).json({
                errors: {
                    message: 'Failed to get details',
                },
            });;
        }
    })
});

// CHARGE TO ROOM
router.post('/chargeToRoom', (req, res) => {
    const { type, guestName, roomNo, serverName, tipToServer, noOfPeople, total, userId } = req.body;
    if (!type || !guestName || !roomNo || !serverName || !noOfPeople || !total) {
        return res.status(422).json({
            errors: {
                message: 'Please enter all required fields!'
            }
        })
    }
    if (typeof noOfPeople !== 'number' || typeof roomNo !== 'number' || typeof total !== 'number') {
        return res.status(422).json({
            errors: {
                message: 'Total, Room Number, and No of people should be number'
            }
        })
    }

    var chargeToRoom = new ChargeToRoom();
    chargeToRoom.userId = userId;
    chargeToRoom.type = type;
    chargeToRoom.guestName = guestName;
    chargeToRoom.roomNo = roomNo;
    chargeToRoom.serverName = serverName;
    chargeToRoom.tipToServer = tipToServer;
    chargeToRoom.noOfPeople = noOfPeople;
    chargeToRoom.total = total;

    // if (ChargeToRoom.length == 0 || ChargeToRoom.length > roomNo) {
    chargeToRoom.save((err, inserted) => {
        if (err) {
            const errMsg = JSON.parse(JSON.stringify(err)).message;
            return res.status(422).json({
                errors: {
                    status: "not completed!",
                    message: errMsg
                }
            });
        } else {
            return res.status(200).json({
                success: {
                    message: "succefully completed",
                    data: inserted
                }
            });
        }
    });
    // }
});

// Get reservations
router.post('/getUserchargeToRoom', (req, res) => {

    var user_id = req.body.userId;
    ChargeToRoom.find({ "userId": user_id }, (err, reservations) => {
        if (reservations) {
            return res.json({
                "Reservations": reservations
            });
        } else {
            return res.status(422).json({
                errors: {
                    message: 'Failed to get details',
                },
            });;
        }
    })
});


// PAYEMENT
router.post('/payment', (req, res) => {
    const { cardNumber, cardName, expDate, cvv, amount, userId } = req.body;
    if (!cardNumber || !cardName || !expDate || !cvv || !amount) {
        return res.status(422).json({
            errors: {
                message: 'Please enter all required fields!'
            }
        })
    }

    var payment = new Payment();
    payment.userId = userId;
    payment.cardNumber = cardNumber;
    payment.cardName = cardName;
    payment.expDate = expDate;
    payment.cvv = cvv;
    payment.amount = amount;

    payment.save((err, inserted) => {
        if (err) {
            const errMsg = JSON.parse(JSON.stringify(err)).message;
            return res.status(422).json({
                errors: {
                    status: "Payment is not completed!",
                    message: errMsg
                }
            });
        } else {
            return res.status(200).json({
                success: {
                    message: "Payment is succefully completed"
                }
            });
        }
    });

});

router.post('/getUserPayment', (req, res) => {

    var user_id = req.body.userId;
    Payment.find({ "userId": user_id }, (err, reservations) => {
        if (reservations) {
            return res.json({
                "Reservations": reservations
            });
        } else {
            return res.status(422).json({
                errors: {
                    message: 'Failed to get details',
                },
            });;
        }
    })
});




module.exports = router;