const express = require('express');
require('./db/database');
const dotenv = require('dotenv').config();
const userRouter = require('./routes/user');
const prescriptionRouter = require('./routes/prescription');
const appointmentRouter = require('./routes/appointment');
const cors = require('cors');
const app = express();
app.use(cors())
const bodyParser = require('body-parser');

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();

})

app.use(bodyParser.json());

app.use(userRouter);
app.use(prescriptionRouter);
app.use(appointmentRouter);

module.exports = app;
