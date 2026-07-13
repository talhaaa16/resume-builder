const mongoose = require('mongoose');

const InterviewPrepSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobRole: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    questions: {
        type: Array,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('InterviewPrep', InterviewPrepSchema);
