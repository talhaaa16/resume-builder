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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resume', ResumeSchema);
