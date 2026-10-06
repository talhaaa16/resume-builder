const mongoose = require('mongoose');

// One chatbot conversation (thread). Messages live in the ChatMessage
// collection so a long conversation never hits the 16MB document limit.
const ChatConversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        default: 'New chat'
    },
    messageCount: {
        type: Number,
        default: 0
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

ChatConversationSchema.index({ userId: 1, lastMessageAt: -1 });

module.exports = mongoose.model('ChatConversation', ChatConversationSchema);
