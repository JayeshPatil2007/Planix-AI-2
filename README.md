<div align="center">

# 🚀 Planix AI
### The AI-Powered Learning Operating System

An intelligent learning agent that generates structured skill roadmaps, teaches concepts interactively, understands uploaded documents and images, and guides users through personalized learning journeys.

Built using **Google Gemini AI**.

</div>

---

# 🌟 Overview

**Planix AI** is an AI-powered learning operating system that helps users transform learning goals into structured execution plans.

Instead of searching through scattered tutorials and courses, users can define:

• what they want to learn  
• how many days they have  
• how many hours per day they can dedicate  

Planix AI then generates a **complete learning roadmap**, teaches each concept interactively, analyzes uploaded study materials, and tracks progress.

---

# 🎯 Problem

Modern learners face three major problems:

• Information overload  
• No structured learning path  
• Lack of progress tracking  

Even with AI tools available, most solutions only answer questions rather than **designing a full learning system**.

---

# 🧠 Solution

Planix AI acts as a **learning architect** rather than a simple chatbot.

It provides:

• AI-generated learning roadmaps  
• Interactive tutoring  
• Document and image analysis  
• Voice interaction  
• Structured notes generation  
• Progress tracking

This transforms learning from random exploration into **structured skill development**.

---

# 🚀 Core Features

## AI Roadmap Generator
Users enter:

• learning goal  
• number of days  
• hours per day  

Gemini generates a structured roadmap with phases and learning objectives.

---

## AI Teaching Mode
Users can ask the AI to explain any roadmap phase.

Responses include:

• concept explanation  
• examples  
• practice tasks  

---

## Notes Mode
Automatically generates structured notes including:

• definitions  
• key concepts  
• examples  
• summaries

---

## Multimodal Learning Agent
Planix AI can analyze:

• uploaded images  
• uploaded PDF documents  

The AI integrates this information into tutoring responses.

---

## Voice Interaction
Users can speak directly to the AI using a microphone input.

Voice is converted into text and processed by the AI assistant.

---

## Progress Tracking
Each roadmap objective includes a checkbox.

Progress bars update automatically based on completed tasks.

---

# 🛠 Tech Stack

Frontend

• Next.js 15 (App Router)  
• React  
• TypeScript  
• Tailwind CSS  
• Framer Motion  

Backend

• Next.js API Routes  

AI Model

• Google Gemini API  

Database

• Prisma ORM  
• SQLite (development)

---

# 🏗 Architecture

```
User
 ↓
Next.js Frontend
 ↓
API Routes
 ↓
Gemini AI API
 ↓
Database (Prisma)
```

Gemini powers the reasoning engine responsible for roadmap generation, tutoring, notes generation, and multimodal document understanding.

---

# 📂 Project Structure

```
Planix-AI/
│
├── app/
│   ├── api/
│   │   ├── roadmap/
│   │   ├── chat/
│   │   └── notes/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── views/
│   │   ├── SplashIntro.tsx
│   │   ├── Onboarding.tsx
│   │   └── Workspace.tsx
│   │
│   ├── workspace/
│   │   ├── Navbar.tsx
│   │   ├── Roadmap.tsx
│   │   └── HistoryDrawer.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       └── Input.tsx
│
├── lib/
│   ├── gemini.ts
│   ├── prisma.ts
│   └── utils.ts
│
├── prisma/
│   └── schema.prisma
│
├── hooks/
│   └── use-mobile.ts
│
├── README.md
├── package.json
└── tsconfig.json
```

---

# ⚙️ Installation

### Prerequisites

Node.js 18+

---

### Clone Repository

```
git clone https://github.com/YOUR_USERNAME/planix-ai.git
cd planix-ai
```

---

### Install Dependencies

```
npm install
```

---

### Environment Variables

Create `.env.local`

```
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL="file:./dev.db"
```

---

### Run Development Server

```
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

# 🤖 How It Works

1. User enters a learning goal
2. Gemini generates a structured roadmap
3. The roadmap is displayed as phases and objectives
4. Users interact with the AI tutor for deeper explanations
5. Documents and images can be uploaded for AI analysis
6. Progress is tracked across roadmap milestones

---

# 🏆 Hackathon Highlights

Planix AI demonstrates:

• AI roadmap generation  
• multimodal reasoning  
• conversational tutoring  
• voice interaction  
• progress tracking  

This transforms AI from a simple chatbot into a **true learning agent**.

---

# 📈 Future Improvements

• real-time collaboration  
• adaptive roadmap adjustments  
• community roadmap sharing  
• mobile application

---

# 📜 License

MIT License

---

<div align="center">

Built by **Jayesh Patil**

AI Builder | Hackathon Developer

</div>
