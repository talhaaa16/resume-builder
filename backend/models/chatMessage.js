const mongoose = require('mongoose');

const ChatJobSchema = new mongoose.Schema({
    id: String,
    title: String,
    company: String,
    location: String,
    salary: String,
    contract: String,
    description: String,
    applyUrl: String,
    created: String
}, { _id: false });

const ChatMessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatConversation',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ['user', 'model'],
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    // Jobs returned by the chatbot's job search, rendered as cards in the UI
    jobs: {
        type: [ChatJobSchema],
        default: undefined
    },
    jobSearch: {
        query: String,
        location: String,
        jobType: String
    },
    feedback: {
        type: String,
        enum: ['up', 'down', null],
        default: null
    }
}, { timestamps: true });

ChatMessageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
