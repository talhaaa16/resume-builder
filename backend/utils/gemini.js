const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const primaryModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Accepts anything `generateContent` accepts: a prompt string, an array of
// parts, or a full request ({ contents, systemInstruction, tools, ... }).
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

module.exports = { generateWithFallback };
