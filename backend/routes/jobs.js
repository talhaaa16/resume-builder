const express = require('express');
const router = express.Router();
const { searchJobs, isConfigured, generateDemoJobs } = require('../utils/jobSearch');

// GET /api/jobs/search or GET /api/jobs
// Accepts: what / q, where / loc, limit, job_type, max_days_old
const handleJobSearch = async (req, res) => {
    try {
        const query = req.query.what || req.query.q || req.query.query || '';
        const location = req.query.where || req.query.loc || req.query.location || '';
        const jobType = req.query.job_type || req.query.contract;
        const postedWithinDays = req.query.max_days_old ? parseInt(req.query.max_days_old, 10) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 12;

        const configured = isConfigured();
        let jobs = [];
        let isDemo = false;

        if (configured) {
            try {
                jobs = await searchJobs({ query, location, jobType, postedWithinDays, limit });
            } catch (apiErr) {
                console.error('Adzuna API search failed, falling back to demo results:', apiErr.message);
                jobs = generateDemoJobs({ query, location, limit });
                isDemo = true;
            }
        } else {
            jobs = generateDemoJobs({ query, location, limit });
            isDemo = true;
        }

        return res.json({
            sts: 0,
            configured,
            isDemo,
            total: jobs.length,
            jobs
        });
    } catch (err) {
        console.error('Job search handler error:', err);
        return res.status(500).json({ sts: 1, msg: 'Failed to search jobs', error: err.message });
    }
};

router.get('/search', handleJobSearch);
router.get('/', handleJobSearch);

// GET /api/jobs/status
router.get('/status', (req, res) => {
    res.json({
        sts: 0,
        configured: isConfigured()
    });
});

module.exports = router;
