const express = require('express');
const router = express.Router();
const Resume = require('../models/resume');
const auth = require('../middleware/auth');

// Create or Update Resume
router.post('/save', auth, async (req, res) => {
    try {
        const { personalInfo, experience, education, skills, projects, languages, template, resumeId } = req.body;
        const userId = req.user.userId;

        let resume;
        if (resumeId) {
            resume = await Resume.findOneAndUpdate(
                { _id: resumeId, userId },
                { personalInfo, experience, education, skills, projects, languages, template },
                { new: true }
            );
        } else {
            resume = new Resume({
                userId,
                personalInfo,
                experience,
                education,
                skills,
                projects,
                languages,
                template
            });
            await resume.save();
        }

        res.json({ sts: 0, msg: "Resume saved successfully", resume });
    } catch (error) {
        console.error("Resume Save Error:", error);
        res.status(500).json({ sts: 1, msg: "Failed to save resume" });
    }
});

// Get all resumes for a user
router.get('/my-resumes', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
        res.json({ sts: 0, resumes });
    } catch (error) {
        console.error("Fetch Resumes Error:", error);
        res.status(500).json({ sts: 1, msg: "Failed to fetch resumes" });
    }
});

// ── Get public resume by shareId (no auth) — MUST be before /:id ─────────
router.get('/public/:shareId', async (req, res) => {
    try {
        const resume = await Resume.findOne({ shareId: req.params.shareId, isPublic: true })
            .select('-userId');
        if (!resume) return res.status(404).json({ sts: 1, msg: "Resume not found or sharing is disabled" });
        res.json({ sts: 0, resume });
    } catch (error) {
        res.status(500).json({ sts: 1, msg: "Error fetching resume" });
    }
});

// ── Toggle public share link — MUST be before /:id ────────────────────────
router.post('/share/:id', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!resume) return res.status(404).json({ sts: 1, msg: "Resume not found" });

        if (resume.isPublic && resume.shareId) {
            resume.isPublic = false;
            resume.shareId = null;
            await resume.save();
            return res.json({ sts: 0, shared: false, msg: "Sharing disabled" });
        }

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let shareId = '';
        for (let i = 0; i < 10; i++) shareId += chars.charAt(Math.floor(Math.random() * chars.length));

        resume.isPublic = true;
        resume.shareId = shareId;
        await resume.save();

        res.json({ sts: 0, shared: true, shareId, msg: "Sharing enabled" });
    } catch (error) {
        console.error("Share error:", error);
        res.status(500).json({ sts: 1, msg: "Error toggling share" });
    }
});

// Get specific resume (wildcard — keep LAST among GETs)
router.get('/:id', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!resume) return res.status(404).json({ sts: 1, msg: "Resume not found" });
        res.json({ sts: 0, resume });
    } catch (error) {
        res.status(500).json({ sts: 1, msg: "Error fetching resume" });
    }
});

// Delete resume
router.delete('/:id', auth, async (req, res) => {
    try {
        await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        res.json({ sts: 0, msg: "Resume deleted" });
    } catch (error) {
        res.status(500).json({ sts: 1, msg: "Error deleting resume" });
    }
});

module.exports = router;
