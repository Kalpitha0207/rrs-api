const mongoose = require('mongoose');
const { Schema } = mongoose;

const Payment = Schema({
    cardNumber: {type: Number, required: true},
    cardName: {type: String, required: true},
    expDate: {type: Date, required: true},
    cvv: {type: Number, required: true},
    amoumt: {type: Number, required: true},
});

mongoose.model('Payment', Payment);