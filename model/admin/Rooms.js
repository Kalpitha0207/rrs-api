const mongoose = require('mongoose');
const { Schema } = mongoose;

const Rooms = Schema({
    roomNo: { type: Number, required: true },
    roomType: { type: String, required: true },
    roomFare: { type: Number, required: true },
    noOfBeds: { type: Number, required: true },
    noOfAdults: { type: Number, required: true },
    noOfChildren: { type: Number, required: true },
    description: { type: String, required: true },
    booked: { type: Boolean, default: false }
});

mongoose.model('Rooms', Rooms);