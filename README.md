# Developer Assistant Platform

A multi-agent development assistant accessible via mobile messaging (Telegram/WhatsApp) and an accompanying Next.js web application. This platform provides intelligent, asynchronous tools to accelerate developer learning, coding practice, and open-source contributions.

## 🌟 Core Agents

1. **The DSA Coach (Socratic Mentor)**
   Analyzes your LeetCode problem or code snippet via messaging. Instead of giving you the direct solution, it provides Socratic, step-by-step hints to help you reach the optimal time/space complexity yourself.

2. **The YouTube & Article Ingestor (Active Recall)**
   Send a YouTube link or technical article to the bot. It fetches the transcript/content, extracts key architectural patterns, writes structured markdown notes with flashcards, and automatically pushes them to your Obsidian vault repository.

3. **The Open-Source Scout**
   Periodically searches GitHub for "good first issues" matching your current tech stack (e.g., TypeScript, Go, React) and sends you summaries along with a high-level suggested approach.

4. **The SQL/Data Engineering Sandbox**
   Write SQL queries directly on your mobile device. The agent runs them against a sandboxed PostgreSQL instance, returns the `EXPLAIN ANALYZE` query plan, and explains any performance bottlenecks.

## 🏗 Architecture & Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (with Prisma ORM)
- **Integrations:** Telegram/WhatsApp APIs, GitHub API, LLM API (Gemini/OpenAI)

### Project Structure

```text
lucy/
├── frontend/
│   ├── src/app/          # Next.js App Router
│   ├── src/features/     # UI Feature Components (e.g., SettingsForm)
│   └── package.json
├── backend/
│   ├── src/server.ts     # Server entry point
│   ├── src/app.ts        # Express app setup
│   ├── src/routes/       # API route definitions
│   ├── src/controllers/  # Request validation and handling
│   ├── src/services/     # Core business logic
│   ├── prisma/           # Database schema and migrations
│   └── package.json
└── docs/                 # PRD, TDD, and Implementation plans
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance running locally or via Docker
- A Telegram Bot Token
- A GitHub Personal Access Token (for Obsidian sync and OS Scout)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (`.env`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/lucy"
   PORT=5000
   ```
4. Run Prisma migrations:
   ```bash
   npx prisma db push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the Web Dashboard.

## 🛡️ Security Notes
- The SQL Sandbox connects to PostgreSQL using a severely restricted, read-only user role to prevent destructive operations (`DROP`, `DELETE`) by users or the LLM.
- Webhook endpoints enforce strict authentication to ensure only authorized sender IDs can interact with the agents.

## 📄 Documentation
For detailed architecture decisions and feature specs, refer to:
- [PRD (Product Requirements Document)](./docs/prd.md)
- [TDD (Technical Design Document)](./docs/tdd.md)
- [Implementation Plan](./docs/plan.md)
