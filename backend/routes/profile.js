import { Router } from "express";
import { v4 as uuid } from "uuid";
import db from "../db/database.js";

const router = Router();

// Create a new user profile
router.post("/", (req, res) => {
  const { name, currentRole, experienceLevel, targetRole, skills, interests } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const id = uuid();
  db.prepare(
    `INSERT INTO users (id, name, current_role, experience_level, target_role, skills, interests)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, name, currentRole || "", experienceLevel || "", targetRole || "", skills || "", interests || "");

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  res.status(201).json(user);
});

// Get a profile by id
router.get("/:id", (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// Update a profile
router.put("/:id", (req, res) => {
  const { name, currentRole, experienceLevel, targetRole, skills, interests } = req.body;
  const existing = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "User not found" });

  db.prepare(
    `UPDATE users SET name = ?, current_role = ?, experience_level = ?, target_role = ?, skills = ?, interests = ?
     WHERE id = ?`
  ).run(
    name ?? existing.name,
    currentRole ?? existing.current_role,
    experienceLevel ?? existing.experience_level,
    targetRole ?? existing.target_role,
    skills ?? existing.skills,
    interests ?? existing.interests,
    req.params.id
  );

  res.json(db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id));
});

export default router;
