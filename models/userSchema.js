const mongoose = require('mongoose');

const deviceInfoSchema = new mongoose.Schema({
    browser: {
        type: String,
        required: true,
    },
    browserVersion: {
        type: String,
        required: true,
    },
    os: {
        type: String,
        required: true,
    },
    osVersion: {
        type: String,
        required: true,
    },
    deviceType: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    deviceId: {
        type: String,
        required: true,
    },
});

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    // bio: {
    //     type: String,
    //     default: [],
    // },
    role: {
        type: String,
        required: true,
    },
    firebaseUid: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    deviceInfo: {
        type: [deviceInfoSchema],
        default: [],
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
