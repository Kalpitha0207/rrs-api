const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddRentalDetails = Schema({
    type: { type: String, required: true },
    rentalFare: { type: Number, required: true },
    noOfBikes: { type: Number, required: true },
    description: { type: Number, required: true },
    image: { type: Buffer, required: true }
});

mongoose.model('AddRentalDetails', AddRentalDetails);