const mongoose = require('mongoose');
const validator = require('validator');
const prescriptionSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 15,
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
    tests: {
        type: String,
        trim: true,
    },
    precautions: {
        type: String,
        trim: true,
    },
    medicine: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
    },
    nextVisit: {
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

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;