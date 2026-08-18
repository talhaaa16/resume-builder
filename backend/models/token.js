const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    expiresAt: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    issuedAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
tokenSchema.index({ issuedAt: 1 })

module.exports = mongoose.model('Token', tokenSchema)