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

    Users.findOne({ name: req.body.name }, (err, user) => {
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


// RESERVATION 
router.post('/reservation', (req, res) => {
    if (!req.body.reservationType || !req.body.fromDate || !req.body.toDate
        || !req.body.noOfRooms || !req.body.noOfAdults || !req.body.noOfChildren) {
        return res.status(422).json({
            errors: {
                message: 'Please enter all required fields!'
            }
        })
    }

    var reservation = new Reservation();
    reservation.reservationType = req.body.reservationType;
    reservation.fromDate = req.body.fromDate;
    reservation.toDate = req.body.toDate;
    reservation.noOfRooms = req.body.noOfRooms;
    reservation.noOfAdults = req.body.noOfAdults;
    reservation.noOfChildren = req.body.noOfChildren;

    // HERE WE NEED TO CHECK WHETHER ROOMS ARE AVAILABLE OR NOT
    Reservation.find({ noOfRooms: reservation.noOfRooms }, (err, Reservation) => {
        if (Reservation.length == 0 || Reservation.length > req.body.noOfRooms) {
            reservation.save((err, inserted) => {
                if (err) {
                    const errMsg = JSON.parse(JSON.stringify(err)).message;
                    console.log(errMsg);
                    return res.status(422).json({
                        errors: {
                            status: "Reservation not completed!",
                            message: errMsg
                        }
                    });
                } else {
                    return res.status(200).json({
                        success: {
                            message: "Reservation succefully completed and process next step for payment"
                        }
                    });
                }
            });
        } else if (Reservation.length < req.body.noOfRooms && Reservation.length >= 1) {
            return res.status(422).json({
                errors: {
                    message: `Only ${Reservation.length} rooms available`
                }
            });
        } else {
            return res.status(422).json({
                errors: {
                    message: "Rooms not available"
                }
            });
        }
    })
});

// RENTALS AND HIKES
router.post('/rentalsHikes', (req, res) => {
    const { equipmentType, fromDate, toDate, noOfBikes, picnicLunch } = req.body;

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
    rentals.equipmentType = equipmentType;
    rentals.fromDate = fromDate;
    rentals.toDate = toDate;
    rentals.noOfBikes = noOfBikes;
    rentals.picnicLunch = picnicLunch;

    // HERE WE NEED TO CHECK WHETHER RENTAL BIKES ARE AVAILABLE OR NOT
    if (Rentals.length == 0 || Rentals.length > noOfBikes) {
        rentals.save((err, inserted) => {
            if (err) {
                const errMsg = JSON.parse(JSON.stringify(err)).message;
                console.log(errMsg);
                return res.status(422).json({
                    errors: {
                        status: "Rentals and Hikes not completed!",
                        message: errMsg
                    }
                });
            } else {
                return res.status(200).json({
                    success: {
                        message: "Rentals and Hikes succefully completed"
                    }
                });
            }
        });
    }
});

// MEAL RESERVATION
router.post('/mealReservation', (req, res) => {
    const { type, guestName, roomNo, reservationDate, noOfPeople, specialRequest } = req.body;
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
    mealReservation.type = type;
    mealReservation.guestName = guestName;
    mealReservation.roomNo = roomNo;
    mealReservation.reservationDate = reservationDate;
    mealReservation.noOfPeople = noOfPeople;
    mealReservation.specialRequest = specialRequest;

    // HERE WE NEED TO CHECK WHETHE ROOMS ARE AVAILABLE OR NOT
    if (MealReservation.length == 0 || MealReservation.length > roomNo) {
        mealReservation.save((err, inserted) => {
            if (err) {
                const errMsg = JSON.parse(JSON.stringify(err)).message;
                console.log(errMsg);
                return res.status(422).json({
                    errors: {
                        status: "Meal Reservation not completed!",
                        message: errMsg
                    }
                });
            } else {
                return res.status(200).json({
                    success: {
                        message: "Meal Reservation succefully completed"
                    }
                });
            }
        });
    }
});

// CHARGE TO ROOM
router.post('/chargeToRoom', (req, res) => {
    const { type, guestName, roomNo, serverName, tipToServer, noOfPeople, total } = req.body;
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
    chargeToRoom.type = type;
    chargeToRoom.guestName = guestName;
    chargeToRoom.roomNo = roomNo;
    chargeToRoom.serverName = serverName;
    chargeToRoom.tipToServer = tipToServer;
    chargeToRoom.noOfPeople = noOfPeople;
    chargeToRoom.total = total;

    if (ChargeToRoom.length == 0 || ChargeToRoom.length > roomNo) {
        chargeToRoom.save((err, inserted) => {
            if (err) {
                const errMsg = JSON.parse(JSON.stringify(err)).message;
                console.log(errMsg);
                return res.status(422).json({
                    errors: {
                        status: "not completed!",
                        message: errMsg
                    }
                });
            } else {
                return res.status(200).json({
                    success: {
                        message: "succefully completed"
                    }
                });
            }
        });
    }
});


// PAYEMENT
router.post('/payment', (req, res) => {
    const { cardNumber, cardName, expDate, cvv, amoumt } = req.body;
    if (!cardNumber || !cardName || !expDate || !cvv || !amoumt) {
        return res.status(422).json({
            errors: {
                message: 'Please enter all required fields!'
            }
        })
    }
    if (typeof cardNumber !== 'number' || typeof cvv !== 'number' || typeof amoumt !== 'number') {
        return res.status(422).json({
            errors: {
                message: 'Card Number, CVV and Amount should be number'
            }
        })
    }

    var payment = new Payment();
    payment.cardNumber = cardNumber;
    payment.cardName = cardName;
    payment.expDate = expDate;
    payment.cvv = cvv;
    payment.amoumt = amoumt;

    payment.save((err, inserted) => {
        if (err) {
            const errMsg = JSON.parse(JSON.stringify(err)).message;
            console.log(errMsg);
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



// Create two APIs for setting rooms and getting rooms
// router.post('/setNumberOfRooms', (req, res) => {
//     if (!req.body.number) {
//         return res.status(422).json({
//             errors: {
//                 status: 'INVALID',
//                 message: 'Invalid Number'
//             }
//         })
//     }
//     // var rooms = new Rooms();
//     // rooms.name = req.body.name;
//     // rooms.find({name: rooms.name}, (err, Rooms)=> {
//     //     if (Rooms.length == 0 ) {
//     //         rooms.save((err, inserted) => {
//     //             if (err) {
//     //                 logger.error(err);
//     //                 return res.status(500).json({
//     //                     errors: {
//     //                         message: "Internal Server Error"
//     //                     }
//     //                 });                    
//     //             } else {
//     //                 return res.status(200).json({
//     //                     success: {
//     //                         message: "Successfully Inserted" 
//     //                     }
//     //                 })
//     //             }
//     //         });            
//     //     } else {
//     //         return res.json({
//     //             message: 'User already available',
//     //         });
//     //     }
//     // })
// });

module.exports = router;