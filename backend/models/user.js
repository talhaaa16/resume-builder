const mongoose = require('mongoose')

const Userschema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
    },
    user_email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile_pic: {
        type: String,
        default: ''
    },
    aiUsageCount: {
        type: Number,
        default: 0
    },

    atsUsageCount: {
        type: Number,
        default: 0
    },
    atsLastResetDate: {
        type: String,
        default: ''
    },
    interviewPrepCount: {
        type: Number,
        default: 0
    },
    interviewPrepLastResetDate: {
        type: String,
        default: ''
    },
    jobMatchCount: {
        type: Number,
        default: 0
    },
    jobMatchLastResetDate: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('User', Userschema)
