const express = require('express');
const router = express.Router();
const Resume = require('../models/resume');
const auth = require('../middleware/auth');

const MAX_VERSIONS = 20;

// Fields that make up a resume's editable content.
const VERSIONED_FIELDS = [
    'personalInfo', 'experience', 'education',
    'skills', 'projects', 'languages',
    'template', 'themeColor'
];

function snapshot(resume, label) {
    const snap = { savedAt: new Date() };
    if (label) snap.label = label;
    VERSIONED_FIELDS.forEach(f => { snap[f] = resume[f]; });
    return snap;
}

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

// ── List version snapshots for a resume ───────────────────────────────────
router.get('/:id/versions', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId })
            .select('versions');
        if (!resume) return res.status(404).json({ sts: 1, msg: "Resume not found" });

        const versions = (resume.versions || [])
            .map((v, i) => ({
                index: i,
                label: v.label || `Version ${i + 1}`,
                savedAt: v.savedAt
            }))
            .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

        res.json({ sts: 0, versions, maxVersions: MAX_VERSIONS });
    } catch (error) {
        console.error("List versions error:", error);
        res.status(500).json({ sts: 1, msg: "Failed to list versions" });
    }
});

// ── Save the current resume state as a new version ─────────────────────────
router.post('/:id/versions', auth, async (req, res) => {
    try {
        const label = (req.body && typeof req.body.label === 'string')
            ? req.body.label.trim().slice(0, 60)
            : null;

        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!resume) return res.status(404).json({ sts: 1, msg: "Resume not found" });

        resume.versions.push(snapshot(resume, label));

        // Keep only the most recent MAX_VERSIONS snapshots.
        if (resume.versions.length > MAX_VERSIONS) {
            resume.versions = resume.versions.slice(-MAX_VERSIONS);
        }

        await resume.save();
        const created = resume.versions[resume.versions.length - 1];
        res.json({
            sts: 0,
            msg: "Version saved",
            version: {
                index: resume.versions.length - 1,
                label: created.label,
                savedAt: created.savedAt
            }
        });
    } catch (error) {
        console.error("Save version error:", error);
        res.status(500).json({ sts: 1, msg: "Failed to save version" });
    }
});

// ── Restore a snapshot back onto the live resume ───────────────────────────
router.post('/:id/versions/:index/restore', auth, async (req, res) => {
    try {
        const idx = Number(req.params.index);
        if (!Number.isInteger(idx) || idx < 0) {
            return res.status(400).json({ sts: 1, msg: "Invalid version index" });
        }

        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!resume) return res.status(404).json({ sts: 1, msg: "Resume not found" });
        if (!resume.versions || !resume.versions[idx]) {
            return res.status(404).json({ sts: 1, msg: "Version not found" });
        }

        const snap = resume.versions[idx];
        VERSIONED_FIELDS.forEach(f => {
            if (snap[f] !== undefined) resume[f] = snap[f];
        });

        await resume.save();
        res.json({ sts: 0, msg: "Version restored", resume });
    } catch (error) {
        console.error("Restore version error:", error);
        res.status(500).json({ sts: 1, msg: "Failed to restore version" });
    }
});

// ── Delete a single snapshot ──────────────────────────────────────────────
router.delete('/:id/versions/:index', auth, async (req, res) => {
    try {
        const idx = Number(req.params.index);
        if (!Number.isInteger(idx) || idx < 0) {
            return res.status(400).json({ sts: 1, msg: "Invalid version index" });
        }

        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!resume) return res.status(404).json({ sts: 1, msg: "Resume not found" });
        if (!resume.versions || !resume.versions[idx]) {
            return res.status(404).json({ sts: 1, msg: "Version not found" });
        }

        resume.versions.splice(idx, 1);
        await resume.save();
        res.json({ sts: 0, msg: "Version deleted" });
    } catch (error) {
        console.error("Delete version error:", error);
        res.status(500).json({ sts: 1, msg: "Failed to delete version" });
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
