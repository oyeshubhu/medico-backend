const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const Prescription = require('./prescription');
const Appointment = require('./appointment');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 15,
        minlength: 2
    },
    secondName: {
        type: String,
        trim: true,
        maxlength: 15,
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 15,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email");
            }
        }
    },
    phone: {
        type: Number,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        required: true,
    },
    bloodGroup: {
        type: String,
    },
    weight: {
        type: Number,
    },
    bmi: {
        type: Number,
    },
    rightEye: {
        type: Number,
        max: 6,
        validate(value) {
            if (value < 0) {
                throw new Error('Right Eye must be a postive number')
            }
        }
    },
    leftEye: {
        type: Number,
        default: 0,
        max: 6,
        validate(value) {
            if (value < 0) {
                throw new Error('Left Eye must be a postive number')
            }
        }
    },
    doctorName: {
        type: String,
        maxlength: 15,
        trim: true,
    },
    doctorEmail: {
        type: String,
        trim: true,
        lowercase: true,
    },
    doctorPhone: {
        type: Number,
        minlength: 10,
    },
    specialist: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        maxlength: 100,
        trim: true,
    },
    lastVisit: {
        type: Date,
    },
    nextVisit: {
        type: Date,
    },
    avatar: {
        type: Buffer,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('prescription', {
    ref: 'Prescription',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.virtual('appointment', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokens;
    delete userObj.__v;
    delete userObj.avatar;
    delete userObj._id;
    return userObj;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY);

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Prescription.deleteMany({ owner: user._id })
    await Appointment.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User;