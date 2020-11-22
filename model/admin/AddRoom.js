const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddRoom = Schema({
    noOfRooms: {type: Number, required: true},
});

mongoose.model('AddRoom', AddRoom);