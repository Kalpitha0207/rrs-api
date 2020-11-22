const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddRoomDetails = Schema({
    roomName: {type: String, required: true},
    roomFare: {type: Number, required: true},
    roomNo: {type: Number, required: true},
    noOfBeds: {type: Number, required: true},
    noofAdults: {type: Number, required: true},
    noOfChildren: {type: Number, required: true},
    description: {type: String, required: true},
    image: {type: Buffer, required: true}
});

mongoose.model('AddRoomDetails', AddRoomDetails);