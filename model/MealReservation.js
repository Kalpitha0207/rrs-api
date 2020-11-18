const mongoose = require('mongoose');
const { Schema } = mongoose;

const MealReservation = Schema({
    type: {type: String, required: true},
    guestName: {type: String, required: true},
    roomNo: {type: Number, required: true},
    reservationDate: {type: Date, required: true, default: Date.now},
    noOfPeople: {type: Number, required: true},
    specialRequest: String,
});

mongoose.model('MealReservation', MealReservation);