const mongoose = require('mongoose')
const { Schema } = mongoose;

const Customer = new Schema({
    name: String,
    emailId: String,
    contactNumber: String,
    address: String,
    paymentType: String,
    fromData: { type: Date },
    toData: { type: Date },
    status: String,
    IDProof: String,
    updateStatus: String,

})

mongoose.model('Customer', Customer)