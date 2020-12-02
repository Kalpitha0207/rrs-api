const mongoose = require('mongoose');
const { Schema } = mongoose;

const Reservation = Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    roomId: { type: Schema.Types.ObjectId, required: true },
    reservationType: { type: String, required: true },
    fromDate: { type: Date, required: true, default: Date.now },
    toDate: { type: Date, required: true },
    noOfRooms: { type: Number, required: true },
    noOfAdults: { type: Number, required: true },
    noOfChildren: { type: Number },
});

mongoose.model('Reservation', Reservation);