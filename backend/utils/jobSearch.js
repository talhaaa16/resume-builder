const axios = require('axios');

const JOB_TYPE_PARAMS = {
    full_time: { full_time: 1 },
    part_time: { part_time: 1 },
    contract: { contract: 1 },
    permanent: { permanent: 1 }
};

const isConfigured = () => Boolean(
    (process.env.ADZUNA_APP_ID || process.env.REACT_APP_ADZUNA_ID) &&
    (process.env.ADZUNA_APP_KEY || process.env.REACT_APP_ADZUNA_KEY)
);

const formatSalary = (min, max) => {
    if (!min) return null;
    const lo = Math.round(min).toLocaleString('en-IN');
    const hi = Math.round(max || min).toLocaleString('en-IN');
    return lo === hi ? `₹${lo}` : `₹${lo} – ₹${hi}`;
};

// Searches live Indian job listings on Adzuna and returns a compact list.
async function searchJobs({ query, location = '', jobType, postedWithinDays, limit = 5 }) {
    const params = {
        app_id: process.env.ADZUNA_APP_ID || process.env.REACT_APP_ADZUNA_ID,
        app_key: process.env.ADZUNA_APP_KEY || process.env.REACT_APP_ADZUNA_KEY,
        results_per_page: Math.min(Math.max(limit, 1), 10),
        what: query,
        sort_by: 'relevance',
        ...(location ? { where: location } : {}),
        ...(postedWithinDays ? { max_days_old: postedWithinDays } : {}),
        ...(JOB_TYPE_PARAMS[jobType] || {})
    };

    const res = await axios.get('https://api.adzuna.com/v1/api/jobs/in/search/1', { params, timeout: 10000 });

    return (res.data?.results || []).map(job => ({
        id: String(job.id),
        title: (job.title || '').replace(/<[^>]+>/g, ''),
        company: job.company?.display_name || 'Not disclosed',
        location: job.location?.display_name || 'Not specified',
        salary: formatSalary(job.salary_min, job.salary_max),
        contract: job.contract_time || job.contract_type || null,
        description: job.description ? job.description.replace(/<[^>]+>/g, '').slice(0, 160) + '…' : '',
        applyUrl: job.redirect_url,
        created: job.created || null
    }));
}

module.exports = { searchJobs, isConfigured };
