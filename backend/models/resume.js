const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personalInfo: {
        fullName: String,
        designation: String,
        summary: String,
        profilePhoto: String,
        address: String,
        email: String,
        phone: String,
        linkedin: String,
        github: String,
        portfolio: String
    },
    experience: [{
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String
    }],
    education: [{
        school: String,
        degree: String,
        startDate: String,
        endDate: String,
        description: String
    }],
    skills: [String],
    projects: [{
        title: String,
        link: String,
        description: String
    }],
    languages: [String],
    template: {
        type: String,
        default: 'professional'
    },
    themeColor: {
        type: String,
        default: '#0076BC'
    },
    // Public share link
    isPublic: {
        type: Boolean,
        default: false
    },
    shareId: {
        type: String,
        default: null,
        unique: true,
        sparse: true   // allow multiple nulls
    },
    // ── Version history ───────────────────────────────────────────────────────
    // Each entry is a snapshot of the resume at a point in time. Power users
    // can compare, restore, or delete old versions. Capped to the most recent
    // `MAX_VERSIONS` snapshots (oldest are dropped FIFO).
    versions: [{
        label: { type: String, default: 'Snapshot' },
        personalInfo: Object,
        experience: Array,
        education: Array,
        skills: Array,
        projects: Array,
        languages: Array,
        template: String,
        themeColor: String,
        savedAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resume', ResumeSchema);
