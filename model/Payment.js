const mongoose = require('mongoose');
const { Schema } = mongoose;

const Payment = Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    paymentType: { type: String, required: true },
    cardNumber: { type: String, required: true },
    cardName: { type: String, required: true },
    expDate: { type: String, required: true },
    cvv: { type: String, required: true },
    amount: { type: Number, required: true },
});

mongoose.model('Payment', Payment);