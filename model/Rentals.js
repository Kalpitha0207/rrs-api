const mongoose = require('mongoose');
const { Schema } = mongoose;

const Rentals = Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    equipmentType: {type: String, required: true},
    fromDate: {type: Date, required: true, default: Date.now},
    toDate: {type: Date, required: true},
    noOfBikes: {type: Number, required: true},
    picnicLunch: String,
});

mongoose.model('Rentals', Rentals);