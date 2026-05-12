const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require('../middleware/auth');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const User = require('../models/user');

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

module.exports = router;
