# Compass — AI Career Advisor

A full-stack chatbot that gives personalized career guidance: a persistent chat advisor,
resume feedback, and profile-aware coaching, powered by Claude.

## Features

- **Personalized advisor chat** — every reply is grounded in the user's stated role, target
  role, skill set, and experience level, not a generic script
- **Persistent conversations** — chat history is stored per user in SQLite and can be revisited
- **Resume review** — paste resume text and target role, get structured feedback (strengths,
  specific fixes with rewritten bullet examples, ATS notes, verdict)
- **Profile system** — lightweight onboarding that captures the context the AI needs

## Tech stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React 18, Vite, Tailwind CSS |
| Backend   | Node.js, Express |
| Database  | SQLite (better-sqlite3) |
| AI        | Anthropic Claude API (`@anthropic-ai/sdk`) |

## Architecture

```
career-ai-chatbot/
├── backend/
│   ├── server.js            # Express app entry point
│   ├── db/database.js       # SQLite schema + connection
│   └── routes/
│       ├── profile.js       # User profile CRUD
│       ├── chat.js          # Conversations + AI-powered messaging
│       └── resume.js        # AI-powered resume feedback
└── frontend/
    └── src/
        ├── App.jsx
        └── components/
            ├── ProfileForm.jsx
            ├── Sidebar.jsx
            ├── Chat.jsx
            ├── ResumeReview.jsx
            └── CompassMark.jsx
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set ANTHROPIC_API_KEY=sk-ant-...
npm start
```

Runs on `http://localhost:3001`. The SQLite database file is created automatically on first run.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api` requests to the backend.

Get an API key at https://console.anthropic.com/ if you don't have one.

## Using this project on a resume

Suggested resume bullet points (adjust to match what you actually built/changed):

- Built a full-stack AI career-advisory chatbot (React, Node/Express, SQLite, Claude API)
  delivering profile-aware guidance and persistent multi-turn conversations
- Designed a REST API with 3 resource domains (profiles, conversations, resume reviews) and a
  normalized SQLite schema for chat history
- Implemented an AI-powered resume review feature returning structured, line-level feedback
  rather than generic suggestions

### Making it stand out further (optional next steps)

- Deploy backend (Render/Railway) + frontend (Vercel) and link a live demo
- Add auth (so it's multi-user for real, not just per-browser via localStorage)
- Add automated tests for the API routes
- Swap SQLite for Postgres if you want a "production-grade" story in interviews

## Notes

- The frontend currently identifies "the user" via a browser-local ID (no login) — fine for a
  portfolio demo, call this out as a known simplification if asked in an interview.
- Never commit your `.env` file or API key.
