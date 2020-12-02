const mongoose = require('mongoose');
const router = require('express').Router();
// var auth = require('../../routes/auth');
// var dates = require('../../utils/dates')

const Users = mongoose.model('User')
const Reservation = mongoose.model('Reservation');
const Rentals = mongoose.model('Rentals');
const MealReservation = mongoose.model('MealReservation');
const ChargeToRoom = mongoose.model('ChargeToRoom');
const Payment = mongoose.model('Payment');
const BookingDates = mongoose.model('BookingDates');
const Rooms = mongoose.model('Rooms');


// // GET NO OF ROOMS 
// router.post('/getRooms', (req, res) => {
//     const { fromDate, toDate } = req.body;
//     if (fromDate || toDate) {
//         return res.status(422).json({
//             errors: {
//                 message: 'Please enter all required fields!'
//             }
//         })
//     }
//     BookingDates.find({}, (err, result) => {
//         if (err) {
//             return res.status(422).json({
//                 errors: {
//                     status: "Booking cannot be fetched",
//                     message: errMsg
//                 }
//             });
//         } else {
//             // var days = dates.getNoOfDays(fromDate, toDate)
//             // let [day, month, year] = fromDate.split('.');
//             // let [day1, month1, year1] = toDate.split('.');
//             // const convertDate = (y,m,d)=> {
//             //     let concertedDate = (new Date(y, m - 1, d))*1000*60*60*24;
//             //     return concertedDate;
//             // }
//             // const convertResDate = (date)=> {
//             //     let dd = new Date(date)*1000*60*60*24
//             //     return dd;
//             // }
//             // const to = convertDate(year, month, day);
//             // const from = convertDate(year1, month1, day1);
//             // let loopDay = now;
//             // let resDate = convertResDate(result);
//             // var arrayDate = [];
//             // for (let i = 0; i < days; i++) {
//             //     if (to <= resDate) {
//             //         let newval = loopDay.setDate(loopDay.getDate() + 1);
//             //         let r = {
//             //             date: new Date(loopDay),
//             //             noOfRooms: 10,
//             //         }
//             //         arrayDate.push(r)                    
//             //     }
//             // }
//             return res.status(200).json({
//                 success: {
//                     availableDates: result
//                 }
//             });
//         }
//     })
// });


// RESERVATION 
router.post('/reservation', (req, res) => {
    if (!req.body.userId || !req.body.reservationType || !req.body.roomId || !req.body.fromDate || !req.body.toDate
        || !req.body.noOfRooms || !req.body.noOfAdults ) {
        return res.status(422).json({
            errors: {
                message: 'Please enter all required fields!'
            }
        })
    }

    var reservation = new Reservation();
    reservation.userId = req.body.userId
    reservation.reservationType = req.body.reservationType;
    reservation.roomId = req.body.roomId
    reservation.fromDate = req.body.fromDate;
    reservation.toDate = req.body.toDate;
    reservation.noOfRooms = req.body.noOfRooms;
    reservation.noOfAdults = req.body.noOfAdults;
    reservation.noOfChildren = req.body.noOfChildren;


    Users.findOne({ _id: req.body.userId }, (err, user) => {
        if (!user) {
            return res.json({
                message: 'user not registered!',
            });
        } else {
            Rooms.find({ "_id": reservation.roomId }, (err, room) => {
                if (err) {
                    return res.status(422).json({
                        errors: {
                            status: "failed",
                            message: err.errMsg
                        }
                    });
                } else {
                    if (room[0].booked == true) {
                        return res.status(422).json({
                            message: 'Room not available',
                        });
                    } else {
                        reservation.save((err, data) => {
                            if (err) {
                                return res.status(422).json({
                                    errors: {
                                        status: "Booking cannot be fetched",
                                        message: errMsg
                                    }
                                });
                            } else {
                                Rooms.updateOne({ "_id": reservation.roomId }, { booked: true }).then((value) => console.log(value))
                                return res.json({
                                    Success: {
                                        "message": 'Reservation completed!',
                                        "data": data,
                                    }
                                });
                            }
                        })
                    }
                }
            })
        }
    })

});

// Get reservations
router.get('/getAllReservation', (req, res) => {

    Reservation.find({}, (err, reservations) => {
        if (reservations) {
            return res.json({
                "Reservations": reservations
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
                        message: "Meal Reservation succefully completed",
                        data: inserted
                    }
                });
            }
        });
    // }
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
                        message: "succefully completed",
                        data: inserted
                    }
                });
            }
        });
    // }
});


// PAYEMENT
router.post('/payment', (req, res) => {
    const { cardNumber, cardName, expDate, cvv, amoumt, userId } = req.body;
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
    payment.userId = userId;
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




module.exports = router;