const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config();
const app = express();

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/rrs", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("mongodb connected successfully");
    })
    .catch(err => {
        console.log(err);
    })

mongoose.set('debug', false)

require('./model/User');
require('./model/Reservation');
require('./model/Rentals');
require('./model/MealReservation');
require('./model/ChargeToRoom');
require('./model/Payment');
require('./model/admin/AddRoom');
require('./model/admin/AddRoomDetails');
require('./model/admin/AddRentalDetails');

app.use(require('./routes'));


var started = new Date();

app.get('/', (req, res) => {
    res.send({
        started: "Started at :" + started,
        uptime: (Date.now() - Number(started)) / 1000,
    });
})

app.listen('5000', () => console.log(`Server is running on port ${5000}`))