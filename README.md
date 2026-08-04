# Compass — AI Career Advisor

Compass is a full-stack AI-powered career advisor built with **React**, **Node.js**, **Express**, **SQLite**, and **Google Gemini**. It helps students and job seekers receive personalized career guidance, resume analysis, and profile-based coaching through an intelligent conversational interface.

---

# 🚀 Live Demo

- **Frontend:** https://career-ai-chatbot-chi.vercel.app/
- **Backend API:** https://career-ai-chatbot.onrender.com/

---

# ✨ Features

## 🤖 AI Career Advisor

- Personalized AI career coaching
- Profile-aware responses
- Persistent conversations
- Career planning guidance
- Interview preparation
- Skill gap analysis
- Career roadmap suggestions

---

## 👤 User Profiles

Create a personalized profile including:

- Name
- Current role
- Experience level
- Target role
- Skills
- Interests

The AI uses this information to provide tailored career advice.

---

## 📄 Resume Review

- AI-powered resume analysis
- Resume score (0–100)
- ATS optimization suggestions
- Resume strengths
- Areas for improvement
- Improved resume bullet points
- Missing skills recommendations

> 🚧 PDF resume upload is currently being finalized.

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Markdown
- Remark GFM

## Backend

- Node.js
- Express.js
- SQLite (better-sqlite3)
- Multer
- PDF Parser
- Google Gemini 2.5 Flash API

---

# 📁 Project Structure

```text
career-ai-chatbot/
│
├── backend/
│   ├── db/
│   │   └── database.js
│   │
│   ├── routes/
│   │   ├── chat.js
│   │   ├── profile.js
│   │   └── resume.js
│   │
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx
│   │   │   ├── CompassMark.jsx
│   │   │   ├── ProfileForm.jsx
│   │   │   ├── ResumeReview.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/Abel-1-6/career-ai-chatbot.git
```



```bash
cd career-ai-chatbot
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:


Start the backend:

```bash
npm start
```

Backend runs on:

```
http://localhost:3001
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---



# 🎯 Future Improvements

- Finish PDF resume upload
- AI-generated cover letters
- AI mock interview simulator
- Personalized learning roadmap
- Job application tracker
- LinkedIn profile review
- Authentication (login/signup)
- PostgreSQL support
- Email notifications

---

# 💡 Skills Demonstrated

- Full-Stack Development
- REST API Design
- React Development
- Node.js & Express
- SQLite Database Design
- AI API Integration
- File Upload Handling
- Prompt Engineering
- Responsive UI Design
- State Management
- CRUD Operations

---

# 👨‍💻 Author

**Abel Takele**

Bachelor of Science in Computer Science  
York University

GitHub: https://github.com/Abel-1-6

LinkedIn: www.linkedin.com/in/abel-takele

---

