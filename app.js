const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config();
const app = express();

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

mongoose.connect("mongodb://127.0.0.1:27017/rrs", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // console.log("mongodb connected successfully");
    })
    .catch(err => {
        console.log(err);
    })

mongoose.set('debug', false)

require('./model/User');
require('./model/admin/Admin')
require('./model/Reservation');
require('./model/Rentals');
require('./model/MealReservation');
require('./model/ChargeToRoom');
require('./model/Payment');
require('./model/admin/Rooms');
require('./model/admin/AddRentalDetails');
require('./model/admin/BookingDates')

app.use(require('./routes'));


var started = new Date();

app.get('/', (req, res) => {
    res.send({
        started: "Started at :" + started,
        age: (Date.now() - Number(started)) / 1000,
    });
})

app.listen('5000', () => console.log(`Server listening to on port ${5000}`))