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

const DEMO_COMPANIES = [
    'Tata Consultancy Services (TCS)',
    'Infosys',
    'Wipro Technologies',
    'Tech Mahindra',
    'HCLTech',
    'Cognizant Technology Solutions',
    'Accenture Solutions',
    'Reliance Jio Platforms',
    'L&T Technology Services',
    'Persistent Systems',
    'Zomato Engineering',
    'Paytm Technologies'
];

const DEMO_LOCATIONS = [
    'Ahmedabad, Gujarat',
    'Bengaluru, Karnataka',
    'Pune, Maharashtra',
    'Hyderabad, Telangana',
    'Noida / Delhi NCR',
    'Mumbai, Maharashtra',
    'Gurugram, Haryana',
    'Chennai, Tamil Nadu'
];

const DEMO_SALARIES = [
    '₹6,50,000 – ₹12,00,000',
    '₹8,00,000 – ₹15,00,000',
    '₹5,00,000 – ₹9,50,000',
    '₹10,00,000 – ₹18,00,000',
    '₹7,20,000 – ₹13,00,000',
    '₹4,20,000 – ₹7,80,000',
    '₹12,00,000 – ₹22,00,000',
    '₹9,00,000 – ₹16,50,000'
];

// Generates realistic, query-matched Indian job postings when Adzuna API is not configured or fails
function generateDemoJobs({ query = '', location = '', limit = 12 }) {
    const cleanQ = (query || '').trim();
    const cleanLoc = (location || '').trim();

    const titleTemplates = cleanQ
        ? [
            `Senior ${cleanQ}`,
            `${cleanQ}`,
            `Lead ${cleanQ}`,
            `Full Stack ${cleanQ}`,
            `Associate ${cleanQ}`,
            `${cleanQ} (Cloud & Distributed Systems)`,
            `Junior ${cleanQ}`,
            `${cleanQ} - Engineering Team`,
            `Staff ${cleanQ}`,
            `${cleanQ} (Hybrid / Remote)`
        ]
        : [
            'Software Development Engineer',
            'Full Stack Web Developer',
            'Frontend React Developer',
            'Python Backend Engineer',
            'Data Analyst & Reporting Specialist',
            'Business Development Executive',
            'Human Resources (HR) Specialist',
            'DevOps & Cloud Engineer',
            'Product Operations Specialist',
            'QA Automation Engineer'
        ];

    const results = [];
    const count = Math.min(Math.max(limit || 12, 1), 24);

    for (let i = 0; i < count; i++) {
        const title = titleTemplates[i % titleTemplates.length];
        const company = DEMO_COMPANIES[i % DEMO_COMPANIES.length];
        const jobLoc = cleanLoc
            ? `${cleanLoc}${cleanLoc.toLowerCase().includes('gujarat') || cleanLoc.toLowerCase().includes('india') ? '' : ', India'}`
            : DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
        const salary = DEMO_SALARIES[i % DEMO_SALARIES.length];
        const contract = (i % 5 === 0) ? 'contract' : 'full_time';
        const roleTerm = cleanQ || title;

        const fullDescription = `We are looking for a dedicated and skilled ${title} to join our technology and product team at ${company} in ${jobLoc}.

Key Responsibilities:
• Build, optimize, and maintain high-quality features and backend/frontend architectures.
• Collaborate closely with cross-functional team members including software architects, designers, and product owners.
• Design modular, scalable code adhering to security, testability, and performance standards.
• Debug complex technical issues, optimize system latency, and streamline deployment pipelines.

Requirements & Qualifications:
• Practical experience working with ${roleTerm} or relevant modern software development stacks.
• Strong foundation in algorithms, databases, REST APIs, Git workflows, and system architecture.
• Excellent analytical, debugging, and problem-solving abilities.
• Strong written and verbal communication skills with a collaborative mindset.
• Bachelor’s or Master’s degree in Computer Science, IT, or equivalent practical hands-on experience.`;

        const shortDescription = `Join ${company} as a ${title} in ${jobLoc}. Work with modern technologies, develop scalable features, and collaborate with high-impact teams…`;

        const applyUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(roleTerm)}&location=${encodeURIComponent(cleanLoc || 'India')}`;

        results.push({
            id: `demo-${i + 1}-${i * 137}`,
            title,
            company,
            location: jobLoc,
            salary,
            contract,
            description: shortDescription,
            fullDescription,
            applyUrl,
            category: 'IT / Software Development',
            created: new Date(Date.now() - i * 86400000).toISOString()
        });
    }

    return results;
}

// Searches live Indian job listings on Adzuna and returns a list.
async function searchJobs({ query, location = '', jobType, postedWithinDays, limit = 12 }) {
    const appId = process.env.ADZUNA_APP_ID || process.env.REACT_APP_ADZUNA_ID;
    const appKey = process.env.ADZUNA_APP_KEY || process.env.REACT_APP_ADZUNA_KEY;

    if (!appId || !appKey) {
        return generateDemoJobs({ query, location, limit });
    }

    const params = {
        app_id: appId,
        app_key: appKey,
        results_per_page: Math.min(Math.max(limit, 1), 50),
        what: query,
        sort_by: 'relevance',
        ...(location ? { where: location } : {}),
        ...(postedWithinDays ? { max_days_old: postedWithinDays } : {}),
        ...(JOB_TYPE_PARAMS[jobType] || {})
    };

    const res = await axios.get('https://api.adzuna.com/v1/api/jobs/in/search/1', { params, timeout: 10000 });

    return (res.data?.results || []).map(job => {
        const fullDescription = job.description ? job.description.replace(/<[^>]+>/g, '').trim() : '';
        return {
            id: String(job.id),
            title: (job.title || '').replace(/<[^>]+>/g, ''),
            company: job.company?.display_name || 'Not disclosed',
            location: job.location?.display_name || 'Not specified',
            salary: formatSalary(job.salary_min, job.salary_max),
            contract: job.contract_time || job.contract_type || null,
            description: fullDescription ? fullDescription.slice(0, 160) + '…' : '',
            fullDescription,
            applyUrl: job.redirect_url,
            category: job.category?.label || '',
            created: job.created || null
        };
    });
}

module.exports = { searchJobs, isConfigured, generateDemoJobs };
