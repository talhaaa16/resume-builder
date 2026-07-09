const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require('../middleware/auth');
const User = require('../models/user');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const primaryModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateWithFallback(contents) {
    try {
        return await primaryModel.generateContent(contents);
    } catch (err) {
        if (err.status === 503 || (err.message && err.message.includes("503"))) {
            console.warn("gemini-2.5-flash overloaded, retrying with gemini-1.5-flash...");
            return await fallbackModel.generateContent(contents);
        }
        throw err;
    }
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are supported.'), false);
        }
    }
});

router.post('/improve', auth, async (req, res) => {
    try {
        const { text, field } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ sts: 1, msg: "User not found" });

        if (user.aiUsageCount >= 3) {
            return res.status(403).json({
                sts: 1,
                msg: "✨ AI Magic Limit Reached! You have used your 3 free generations. Please come back later or upgrade for unlimited access."
            });
        }

        if (!text || text.trim().length < 3) {
            return res.status(400).json({ sts: 1, msg: "Text is too short to improve." });
        }

        const prompt = `
            You are a professional resume writer and career coach. 
            Improve the following ${field || 'content'} for a professional resume.
            
            Guidelines:
            - Use strong action verbs (e.g., Developed, Orchestrated, Optimized).
            - Focus on achievements and impact.
            - Keep it concise (max 2-3 sentences for summary, or 1-2 bullet-point style sentences for experience).
            - Use professional, high-level vocabulary.
            - DO NOT use placeholders like [Company Name].
            - Return ONLY the improved text, no explanations or conversational text.
            
            Input Text: "${text}"
        `;

        const result = await generateWithFallback(prompt);
        const improvedText = result.response.text().trim();

        user.aiUsageCount += 1;
        await user.save();

        res.json({ sts: 0, improvedText });
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ sts: 1, msg: "AI Generation failed." });
    }
});

router.post('/analyze-resume', auth, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ sts: 1, msg: "Please upload a PDF resume file." });
        }

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ sts: 1, msg: "User not found." });

        const todayStr = new Date().toISOString().slice(0, 10);
        const DAILY_LIMIT = 2;

        if (user.atsLastResetDate !== todayStr) {
            user.atsUsageCount = 0;
            user.atsLastResetDate = todayStr;
        }

        if (user.atsUsageCount >= DAILY_LIMIT) {
            return res.status(429).json({
                sts: 1,
                limitReached: true,
                msg: `Daily limit reached! You can analyze ${DAILY_LIMIT} resumes per day. Come back tomorrow for more free analyses.`
            });
        }

        const jobDescription = req.body.jobDescription || '';

        const pdfBase64 = req.file.buffer.toString('base64');


        const prompt = `You are an expert professional resume coach, HR specialist, and ATS analyst with 15+ years of experience reviewing thousands of resumes.

Thoroughly analyze the attached resume PDF${jobDescription ? ' against the provided job description' : ''} and return a STRICT JSON response. Do NOT include markdown, code fences, or any text outside the JSON.

${jobDescription ? `JOB DESCRIPTION:\n"""\n${jobDescription.slice(0, 2000)}\n"""\n` : ''}
Return this EXACT JSON structure (all fields required):
{
  "overallScore": <integer 0-100>,
  "atsScore": <integer 0-100>,
  "contentScore": <integer 0-100>,
  "formattingScore": <integer 0-100>,
  "verdict": "<one of: Excellent | Good | Fair | Needs Work>",
  "summary": "<3-4 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>", "<improvement 4>"],
  "sectionAnalysis": {
    "contactInfo": { "score": <0-100>, "feedback": "<feedback>" },
    "summary": { "score": <0-100>, "feedback": "<feedback>" },
    "skills": { "score": <0-100>, "feedback": "<feedback>" },
    "experience": { "score": <0-100>, "feedback": "<feedback>" },
    "education": { "score": <0-100>, "feedback": "<feedback>" }
  },
  "matchedKeywords": ${jobDescription ? '["keyword1", "keyword2"]' : '[]'},
  "missingKeywords": ${jobDescription ? '["keyword1", "keyword2"]' : '[]'},
  "topSuggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>", "<suggestion 4>", "<suggestion 5>"]
}
`;

        const result = await generateWithFallback([
            {
                inlineData: {
                    mimeType: "application/pdf",
                    data: pdfBase64,
                }
            },
            { text: prompt }
        ]);
        let raw = result.response.text().trim();
        raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (parseErr) {
            console.error("JSON parse error:", raw.slice(0, 500));
            return res.status(500).json({ sts: 1, msg: "AI returned an unexpected response. Please try again." });
        }

        user.atsUsageCount += 1;
        await user.save();

        const usesLeft = Math.max(0, 2 - user.atsUsageCount);
        res.json({ sts: 0, data: parsed, fileName: req.file.originalname, usesLeft });
    } catch (error) {
        if (error.message === 'Only PDF files are supported.') {
            return res.status(400).json({ sts: 1, msg: error.message });
        }
        console.error("Resume Analysis Error:", error);
        res.status(500).json({ sts: 1, msg: "Resume analysis failed. Please try again." });
    }
});

router.post('/interview-prep', auth, async (req, res) => {
    try {
        const { jobRole, experienceLevel } = req.body;

        if (!jobRole || jobRole.trim().length < 2) {
            return res.status(400).json({ sts: 1, msg: "Please provide a job role." });
        }

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ sts: 1, msg: "User not found." });

        const DAILY_LIMIT = 2;
        const todayStr = new Date().toISOString().slice(0, 10);

        // Reset count if it's a new day
        if (user.interviewPrepLastResetDate !== todayStr) {
            user.interviewPrepCount = 0;
            user.interviewPrepLastResetDate = todayStr;
        }

        if (user.interviewPrepCount >= DAILY_LIMIT) {
            return res.status(429).json({
                sts: 1,
                limitReached: true,
                msg: `Daily limit reached! You can generate interview prep ${DAILY_LIMIT} times per day (including regenerate). Come back tomorrow for more.`,
                usesLeft: 0
            });
        }

        const level = experienceLevel || "fresher";

        const prompt = `You are an expert career coach and interviewer with 15+ years of experience.

Generate exactly 10 common interview questions for a "${jobRole.trim()}" role (experience level: ${level}).

Return ONLY a strict JSON array — no markdown, no code fences, no extra text.

Each item must follow this structure:
{
  "id": <number 1-10>,
  "category": "<one of: Behavioral | Technical | Situational | HR | Role-Specific>",
  "question": "<interview question>",
  "answer": "<model answer in 3-5 sentences, practical and concise>",
  "tip": "<1-sentence interviewer tip>"
}

Make the questions realistic, commonly asked in Indian IT/corporate interviews for this role.
Return only the JSON array, starting with [ and ending with ].`;

        const result = await generateWithFallback(prompt);
        let raw = result.response.text().trim();
        raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

        let questions;
        try {
            questions = JSON.parse(raw);
            if (!Array.isArray(questions)) throw new Error("Not an array");
        } catch (parseErr) {
            console.error("Interview prep JSON parse error:", raw.slice(0, 500));
            return res.status(500).json({ sts: 1, msg: "AI returned an unexpected response. Please try again." });
        }

        user.interviewPrepCount += 1;
        await user.save();

        const usesLeft = Math.max(0, DAILY_LIMIT - user.interviewPrepCount);
        res.json({ sts: 0, jobRole: jobRole.trim(), experienceLevel: level, questions, usesLeft });
    } catch (error) {
        console.error("Interview Prep Error:", error);
        res.status(500).json({ sts: 1, msg: "Failed to generate interview questions. Please try again." });
    }
});

module.exports = router;
