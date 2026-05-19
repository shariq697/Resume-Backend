import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("🚀 Server starting...");
console.log("GROQ KEY EXISTS:", !!process.env.GROQ_API_KEY);

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Home Route
app.get("/", (req, res) => {
  res.send("AI Resume Analyzer API running");
});

// Analyze Resume Route
app.post("/analyze", async (req, res) => {
  try {
    const { resume } = req.body;

    // Empty Resume Check
    if (!resume || resume.trim() === "") {
      return res.json({
        score: 0,
        strengths: [],
        weaknesses: [],
        summary: "No resume provided",
      });
    }

    // AI Request
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content: `
You are a professional ATS Resume Analyzer and technical recruiter.

Return ONLY valid JSON.

Format EXACTLY:

{
  "score": number,
  "strengths": ["string"],
  "weaknesses": ["string"],
  "summary": "string"
}

RULES:
- score must be realistic from 0-100
- strengths must contain 5-8 items
- weaknesses must contain 3-5 items
- weaknesses must NEVER be empty
- do NOT give fake weaknesses that contradict the resume
- weaknesses should focus on:
  - missing experience
  - lack of specialization
  - leadership gaps
  - project depth
  - measurable impact
- summary should be professional and concise
- act like a real recruiter
- no markdown
- no explanations
- ONLY JSON output
          `,
        },

        {
          role: "user",
          content: resume,
        },
      ],
    });

    // Raw AI Text
    const text = response.choices[0].message.content;

    console.log("RAW AI OUTPUT:");
    console.log(text);

    let parsed;

    // Safe JSON Parsing
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      const match = text?.match(/\{[\s\S]*\}/);

      if (!match) {
        console.log("FAILED RAW OUTPUT:");
        console.log(text);

        return res.json({
          score: 0,
          strengths: ["Parsing failed"],
          weaknesses: ["AI response invalid"],
          summary: "Could not analyze resume",
        });
      }

      parsed = JSON.parse(match[0]);
    }

    // Fallback Validation
    if (!parsed.score && parsed.score !== 0) {
      parsed.score = 75;
    }

    if (!Array.isArray(parsed.strengths)) {
      parsed.strengths = [];
    }

    if (!Array.isArray(parsed.weaknesses)) {
      parsed.weaknesses = [];
    }

    if (!parsed.summary) {
      parsed.summary = "Resume analyzed successfully";
    }

    console.log("FINAL PARSED OUTPUT:");
    console.log(parsed);

    return res.json(parsed);

  } catch (error) {
    console.error("ERROR:");
    console.error(error);

    return res.json({
      score: 0,
      strengths: ["Backend error"],
      weaknesses: ["Check API key or Groq model"],
      summary: "AI failed to analyze resume",
    });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
