const mongoose = require('mongoose');
const router = require('express').Router();


const AddRoom = mongoose.model('AddRoom');
const AddRoomDetails = mongoose.model('AddRoomDetails');
const AddRentalDetails = mongoose.model('AddRentalDetails');

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


// ADD RENTAL DETAILS 
router.post('/addRoomDetails', (req, res) => {
    if (!req.body.type || !req.body.rentalFare || !req.body.noOfBikes
        || !req.body.description || !req.body.image) {
        return res.status(422).json({
            errors: {
                message: 'Please enter all required fields!'
            }
        })
    }

    var rentalDetails = new AddRentalDetails();
    rentalDetails.type = req.body.type;
    rentalDetails.rentalFare = req.body.rentalFare;
    rentalDetails.noOfBikes = req.body.noOfBikes;
    rentalDetails.description = req.body.description;
    rentalDetails.image = req.body.image;

    rentalDetails.save((err, inserted) => {
        if (err) {
            const errMsg = JSON.parse(JSON.stringify(err)).message;
            console.log(errMsg);
            return res.status(422).json({
                errors: {
                    status: "Rental details not added!",
                    message: errMsg
                }
            });
        } else {
            return res.status(200).json({
                success: {
                    message: "Rental details added succefully"
                }
            });
        }
    });
});


module.exports = router;