const mongoose = require('mongoose');
const router = require('express').Router();

const dates = require('../../utils/dates')

const AddRoom = mongoose.model('Rooms');
const AddRoomDetails = mongoose.model('AddRoomDetails');
const AddRentalDetails = mongoose.model('AddRentalDetails');
const Admin = mongoose.model('Admin')
const BookingDates = mongoose.model('BookingDates')

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

// ADD ROOM 
router.post('/addRoom', (req, res) => {
    if (!req.body.noOfRooms) {
        return res.status(422).json({
            errors: {
                message: 'Please enter noOfRooms!'
            }
        })
    }
    var addRoom = new AddRoom();
    addRoom.noOfRooms = req.body.noOfRooms;
    console.log("------------");

    addRoom.save((err, inserted) => {
        if (err) {
            const errMsg = JSON.parse(JSON.stringify(err)).message;
            console.log(err);
            return res.status(422).json({
                errors: {
                    status: "Room not added!",
                    message: errMsg
                }
            });
        } else {
            return res.status(200).json({
                success: {
                    message: "Room added succefully"
                }
            });
        }
    });
})

// ADD ROOM DETAILS 
router.post('/addRoomDetails', (req, res) => {
    if (!req.body.roomName || !req.body.roomFare || !req.body.roomNo
        || !req.body.noOfBeds || !req.body.noOfAdults || !req.body.noOfChildren || !req.body.description || !req.body.image) {
        return res.status(422).json({
            errors: {
                message: 'Please enter all required fields!'
            }
        })
    }

    var details = new AddRoomDetails();
    details.roomName = req.body.roomName;
    details.roomFare = req.body.roomFare;
    details.roomNo = req.body.roomNo;
    details.noOfBeds = req.body.noOfBeds;
    details.noOfAdults = req.body.noOfAdults;
    details.noOfChildren = req.body.noOfChildren;
    details.description = req.body.description;
    details.image = req.body.image;

    // HERE WE NEED TO CHECK WHETHER ROOMS ARE AVAILABLE OR NOT
    AddRoomDetails.find({ noOfRooms: details.noOfBeds }, (err, AddRoomDetails) => {
        if (AddRoomDetails.length == 0 || AddRoomDetails.length > req.body.noOfBeds) {
            details.save((err, inserted) => {
                if (err) {
                    const errMsg = JSON.parse(JSON.stringify(err)).message;
                    console.log(errMsg);
                    return res.status(422).json({
                        errors: {
                            status: "Room details not added!",
                            message: errMsg
                        }
                    });
                } else {
                    return res.status(200).json({
                        success: {
                            message: "Room details added succefully"
                        }
                    });
                }
            });
        } else if (AddRoomDetails.length < req.body.noOfBeds && AddRoomDetails.length >= 1) {
            return res.status(422).json({
                errors: {
                    message: `Only ${AddRoomDetails.length} rooms available`
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

// ADD ROOM 
router.post('/openBooking', async (req, res) => {
    if (!req.body.fromDate) {
        return res.status(422).json({
            errors: {
                message: 'Please enter FromDate!'
            }
        })
    }
    if (!req.body.toDate) {
        return res.status(422).json({
            errors: {
                message: 'Please enter ToDate!'
            }
        })
    }

    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;

    var arrayData = await OpenBooking(fromDate, toDate)

    console.log("Array :", arrayData)
    BookingDates.insertMany(arrayData, (err, inserted) => {
        if (err) {
            return res.status(422).json({
                errors: {
                    status: "Booking cannot be opened",
                    message: errMsg
                }
            });
        } else {
            return res.status(200).json({
                success: {
                    message: "Booking Opened succefully!"
                }
            });
        }
    })
})

router.get('/getOpenedBookings', (req, res) => {
    BookingDates.find({}, (err, result) => {
        if (err) {
            return res.status(422).json({
                errors: {
                    status: "Booking cannot be fetched",
                    message: errMsg
                }
            });
        } else {
            return res.status(200).json({
                success: {
                    availableDates: result
                }
            });
        }
    })
})


function OpenBooking(fromDate, toDate) {
    var days = dates.getNoOfDays(fromDate, toDate)
    let [day, month, year] = fromDate.split('.');
    const now = new Date(year, month - 1, day);
    let loopDay = now;
    var arrayDate = []
    for (let i = 0; i < days; i++) {
        let newval = loopDay.setDate(loopDay.getDate() + 1);
        let r = {
            date: new Date(loopDay),
            noOfRooms: 10,
        }
        arrayDate.push(r)
    }
    return arrayDate
}


module.exports = router;