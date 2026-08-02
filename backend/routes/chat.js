import { Router } from "express";
import { v4 as uuid } from "uuid";
import { GoogleGenAI } from "@google/genai";
import db from "../db/database.js";

const router = Router();

function getAI() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
}

function buildSystemPrompt(user) {
  return `You are an experienced, encouraging career advisor chatbot. You give specific,
actionable career guidance rather than generic platitudes. Tailor advice to the person's
background below whenever it's relevant. Ask a clarifying question if their request is vague.
Keep responses focused and skimmable (short paragraphs or bullet points), not walls of text.

Person you're advising:
- Name: ${user?.name || "Unknown"}
- Current role: ${user?.current_role || "Not specified"}
- Experience level: ${user?.experience_level || "Not specified"}
- Target role / goal: ${user?.target_role || "Not specified"}
- Skills: ${user?.skills || "Not specified"}
- Interests: ${user?.interests || "Not specified"}

Cover things like: resume and interview prep, skill gaps for their target role, realistic
next steps, networking strategy, and how to talk about their experience to employers.
Never fabricate specific job openings, company data, or salary figures you aren't given —
speak in general, well-known ranges/trends instead and say when something needs live research.`;
}

// Create a new conversation
router.post("/conversations", (req, res) => {
  const { userId, title } = req.body;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  const id = uuid();
  db.prepare(`INSERT INTO conversations (id, user_id, title) VALUES (?, ?, ?)`).run(
    id,
    userId,
    title || "New conversation"
  );
  res.status(201).json(db.prepare("SELECT * FROM conversations WHERE id = ?").get(id));
});

// List a user's conversations
router.get("/conversations/user/:userId", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM conversations WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.params.userId);
  res.json(rows);
});

// Get all messages in a conversation
router.get("/conversations/:id/messages", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC")
    .all(req.params.id);
  res.json(rows);
});

// Send a message and get an AI reply
router.post("/conversations/:id/messages", async (req, res) => {
  const { content } = req.body;
  const conversationId = req.params.id;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: "content is required" });
  }

  const conversation = db.prepare("SELECT * FROM conversations WHERE id = ?").get(conversationId);
  if (!conversation) return res.status(404).json({ error: "Conversation not found" });

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(conversation.user_id);

  // Save user message
  const userMsgId = uuid();
  db.prepare(
    `INSERT INTO messages (id, conversation_id, role, content) VALUES (?, ?, 'user', ?)`
  ).run(userMsgId, conversationId, content);

  // Build history for the API call
  const history = db
    .prepare("SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY created_at ASC")
    .all(conversationId);

  try {
    const ai = getAI();
    const systemPrompt = buildSystemPrompt(user);

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: history.map((m) => `${m.role}: ${m.content}`).join("\n"),
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const replyText =
      typeof response.text === "function"
        ? response.text()
        : response.text;

    const assistantMsgId = uuid();
    db.prepare(
      `INSERT INTO messages (id, conversation_id, role, content) VALUES (?, ?, 'assistant', ?)`
    ).run(assistantMsgId, conversationId, replyText);

    res.json({
      userMessage: { id: userMsgId, role: "user", content },
      assistantMessage: { id: assistantMsgId, role: "assistant", content: replyText },
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({
      error: "Failed to get a response from the AI. Check your API key and try again.",
    });
  }
});

export default router;