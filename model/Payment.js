const mongoose = require('mongoose');
const { Schema } = mongoose;

const Payment = Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    cardNumber: {type: Number, required: true},
    cardName: {type: String, required: true},
    expDate: {type: String, required: true},
    cvv: {type: Number, required: true},
    amoumt: {type: Number, required: true},
});

mongoose.model('Payment', Payment);