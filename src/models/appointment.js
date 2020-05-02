const mongoose = require('mongoose');
const validator = require('validator');
const appointmentSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        trim: true,
    },
    doctorEmail: {
        type: String,
        lowercase: true,
        trim: true,
    },
    doctorPhone: {
        type: Number,
    },
    hostpitalClinicName: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    ailment: {
        type: String,
        trim: true
    },

    lastVisit: {
        type: Date,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    file: {
        type: Buffer,
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;