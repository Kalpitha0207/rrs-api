const mongoose = require('mongoose');
const { Schema } = mongoose;

const Rooms = Schema({
    noOfRooms: { type: Number, required: true },
});

mongoose.model('Rooms', Rooms);