# Developer Assistant Platform

A multi-agent development assistant with accompanying Next.js web application. This platform provides intelligent, asynchronous tools to accelerate developer learning.

## Core Agent

> **The YouTube & Article Ingestor (Active Recall)**
   Send a YouTube link or technical article to the bot. It fetches the transcript/content, extracts key architectural patterns, writes structured markdown notes with flashcards, and automatically pushes them to your Obsidian vault repository.


## 🏗 Architecture & Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (with Prisma ORM)
- **Integrations:** GitHub API, S3 API, LLM API (Gemini)

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

## Getting Started

### Prerequisites
- Node.js (v18+)
- A GitHub Personal Access Token or S3 credentials for storage

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


## 📄 Documentation
For detailed architecture decisions and feature specs, refer to:
- [PRD (Product Requirements Document)](./docs/prd.md)
- [TDD (Technical Design Document)](./docs/tdd.md)
- [Implementation Plan](./docs/plan.md)

### User Flows

| Flow | Description | Link |
|------|-------------|------|
| Registration | Details the Email/Password and Google OAuth registration process | [registration.md](./docs/userflows/registration.md) |
| Login | Details the Email/Password and Google OAuth login process | [login.md](./docs/userflows/login.md) |

