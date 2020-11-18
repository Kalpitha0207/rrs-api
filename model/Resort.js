const mongoose = require('mongoose')
const { Schema } = mongoose;

const Resort = new Schema({
    name: String,
    image: String,
    description: String,
    address: String,
    price: Number,
    contactNumber: String,
});

mongoose.model('Resort', Resort)