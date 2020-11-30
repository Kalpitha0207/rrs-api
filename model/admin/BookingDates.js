const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingDates = Schema({
    date: { type: Date, required: true },
    noOfRooms: { type: Number, required: true },
});

mongoose.model('BookingDates', BookingDates);