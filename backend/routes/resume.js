  import { Router } from "express";
  import { v4 as uuid } from "uuid";
  import { GoogleGenAI } from "@google/genai";
  import db from "../db/database.js";
  import multer from "multer";
import pdfParse from "pdf-parse-new";
  import fs from "fs";


  const uploadDir = "uploads";
  

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Only PDF files are allowed."));
      }
    },
  });

  const router = Router();
  console.log("API Key exists:", !!process.env.GEMINI_API_KEY);
console.log("API Key starts with:", process.env.GEMINI_API_KEY?.substring(0, 8));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

  const RESUME_SYSTEM_PROMPT = `
  You are an expert ATS resume reviewer and career coach.

  Analyze the resume carefully and return your answer in EXACTLY this format.

  # Resume Score
  Score: <number>/100

  # Strengths
  - List 3-5 specific strengths.

  # Areas for Improvement
  - List 3-5 specific weaknesses.
  - Explain exactly how to improve each one.

  # Improved Bullet Points
  Rewrite at least 3 weak resume bullet points into stronger, achievement-focused versions.

  Example:

  Original:
  • Worked on Java project.

  Improved:
  • Developed a Java-based inventory management application using object-oriented programming principles, improving data processing efficiency by 30%.

  # Missing Skills
  List important skills that are missing for the target role.

  # ATS Optimization
  Explain how to improve the resume for Applicant Tracking Systems.

  # Final Verdict
  Write a short paragraph summarizing the resume and what the candidate should improve first.

  Be honest.
  Be specific.
  Reference the actual resume.
  Do NOT give generic advice.
  `;

  router.post("/", upload.single("resume"), async (req, res) => {
  const { userId, targetRole } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Please upload a PDF resume." });
  }

 

    try {
      const pdfBuffer = fs.readFileSync(req.file.path);
const pdfData = await pdfParse(pdfBuffer);

const resumeText = pdfData.text;

console.log("PDF parsed successfully");
console.log("Resume length:", resumeText.length);

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

  // Extract score like "Score: 82/100"
  const match = feedback.match(/Score:\s*(\d+)/i);

  const score = match ? parseInt(match[1], 10) : null;

  const id = uuid();

  db.prepare(
    `INSERT INTO resume_reviews (id, user_id, resume_text, feedback)
    VALUES (?, ?, ?, ?)`
  ).run(id, userId, resumeText, feedback);

  res.json({
    id,
    score,
    feedback,
  }); 

  if (req.file) {
  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error("Failed to delete uploaded file:", err);
    }
  });
}
 } catch (err) {
  console.error("========== GEMINI ERROR ==========");
  console.error(err);

  res.status(500).json({
    error: err.message || String(err),
  });
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
