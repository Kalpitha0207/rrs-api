const mongoose = require('mongoose');
const router = require('express').Router();

var Room = mongoose.model('Room');

router.post('/getAvailableRooms', (req, res) => {
    var type = req.body.type;
    var beds = req.body.beds;
    var guests = req.body.guests;
    var from = req.body.from;
    var to = req.body.to;

    Room.find({
        type: type,
        beds: beds,
        max_occupancy: { $gt: guests },
        reserver: {
            $not: {
                $elemMatch: { from: { $lt: to.substring(0, 10) }, to: { $lt: from.substring(0, 10) } }
            }
        }
    }, (err, rooms) => {
        if (err) {
            res.send(err)
        } else {
            res.json(rooms)
        }
    })
})