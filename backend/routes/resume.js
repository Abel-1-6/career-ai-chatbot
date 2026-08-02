import { Router } from "express";
import { v4 as uuid } from "uuid";
import { GoogleGenAI } from "@google/genai";
import db from "../db/database.js";

const router = Router();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const RESUME_SYSTEM_PROMPT = `You are a career advisor specializing in resume review.
Given a resume's raw text and (optionally) a target role, provide direct, specific feedback:
- 3-5 concrete strengths
- 3-5 concrete issues, each with exactly how to fix it (weak bullet -> stronger rewritten bullet)
- Formatting / ATS-readability notes if relevant
- Overall verdict in one short paragraph

Be honest and specific. Do not give generic praise. Reference their actual wording where possible.
Format the response in clear markdown sections.`;

router.post("/", async (req, res) => {
  const { userId, resumeText, targetRole } = req.body;

  if (!userId || !resumeText || !resumeText.trim()) {
    return res.status(400).json({ error: "userId and resumeText are required" });
  }

  try {
    const response = await ai.models.generateContent({
 model: "gemini-flash-latest",
  contents: `
${RESUME_SYSTEM_PROMPT}

Target role:
${targetRole || "Not specified"}

Resume:
${resumeText}
`,
});

const feedback =
  typeof response.text === "function"
    ? response.text()
    : response.text;

    const id = uuid();
    db.prepare(
      `INSERT INTO resume_reviews (id, user_id, resume_text, feedback) VALUES (?, ?, ?, ?)`
    ).run(id, userId, resumeText, feedback);

    res.json({ id, feedback });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Failed to review resume. Check your API key and try again." });
  }
});

// Get past reviews for a user
router.get("/user/:userId", (req, res) => {
  const rows = db
    .prepare(
      "SELECT id, feedback, created_at FROM resume_reviews WHERE user_id = ? ORDER BY created_at DESC"
    )
    .all(req.params.userId);
  res.json(rows);
});

export default router;
