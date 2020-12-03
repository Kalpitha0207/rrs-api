const mongoose = require('mongoose');
const { Schema } = mongoose;
const rooms = require('./admin/Rooms')

const Reservation = Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    roomNo: { type: [String], required: true },
    reservationType: { type: String, required: true },
    fromDate: { type: Date, required: true, default: Date.now },
    toDate: { type: Date, required: true },
    totalFare: { type: Number, required: false },
    noOfRooms: { type: Number, required: true },
    noOfAdults: { type: Number, required: true },
    noOfChildren: { type: Number, required: true },
});

mongoose.model('Reservation', Reservation);