const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChargeToRoom = Schema({
    type: {type: String, required: true},
    guestName: {type: String, required: true},
    roomNo: {type: Number, required: true},
    serverName: {type: String, required: true},
    tipToServer: {type: Number, required: true},
    // reservationDate: {type: Date, required: true, default: Date.now},
    noOfPeople: {type: Number, required: true},
    total: {type: Number, required: true},
});

mongoose.model('ChargeToRoom', ChargeToRoom);