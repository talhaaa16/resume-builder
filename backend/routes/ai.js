const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require('../middleware/auth');
const User = require('../models/user');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

        const result = await model.generateContent(prompt);
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

        const result = await model.generateContent([
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

module.exports = router;
