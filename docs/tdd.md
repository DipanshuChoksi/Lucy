# Technical Design Document: Developer Assistant Platform

**Version:** 1.0-draft
**Date:** 2026-05-25
**PRD Reference:** docs/prd.md
**Status:** Draft — Pending Verification

## 1. Architecture Overview
The system consists of a Next.js frontend web app and an Express.js backend API built in TypeScript. The backend handles incoming webhooks from messaging platforms (Telegram/WhatsApp), interacts with the LLM APIs to process queries, and runs background crons. A PostgreSQL database stores user configurations, chat history, and acts as the sandboxed environment for SQL queries.

## 2. Tech Stack
| Layer    | Recommendation              | Rationale |
| -------- | --------------------------- | --------- |
| Frontend | Next.js (React)             | Excellent for an accompanying web app dashboard, works seamlessly with TS. |
| Backend  | Node.js / Express           | Fast, reliable, and native TS support to handle webhook routing for the agents. |
| Database | PostgreSQL                  | Strong relation support, sandboxed instances for the SQL learning tool. |
| ORM      | Prisma                      | Provides end-to-end type safety for the DB interactions in Node.js/TS. |
| Hosting  | Vercel (Web) + Render/Railway | Vercel for the web app, and Render/Railway for easily spinning up the background worker/webhook backend and the Postgres instance. |

## 3. Data Model
```mermaid
erDiagram
    USER {
        int id PK
        string github_token
        string obsidian_repo
        string tech_stack
    }
    SQL_SCHEMA {
        int id PK
        string table_name
        string schema_def
    }
```
*Note: A more detailed database design will be done during Phase 1 Implementation. The SQL Sandbox will use a separate schema or connection role with read-only permissions to prevent destructive operations.*

## 4. API Design
**Core Endpoints (Backend):**
- `POST /webhook/telegram` - Receives messages from Telegram. Routes to the appropriate agent logic.
- `GET /api/settings` - Fetches user settings for the web app.
- `PATCH /api/settings` - Updates user configurations (GitHub token, etc.).

## 5. Authentication & Authorization
Given it's initially scoped as a personal tool:
- **Web App:** Simple password or a single admin user authentication (e.g., using NextAuth or a static access token).
- **Bot Interactions:** Validates the sender ID from Telegram/WhatsApp against an allowed user list.

## 6. Third-Party Integrations
- **Telegram/WhatsApp API:** For messaging interfaces.
- **LLM API (Gemini/OpenAI):** For Socratic mentoring, summarization, and SQL analysis.
- **GitHub API:** To fetch "good first issues" and commit generated markdown files to the Obsidian repository.
- **YouTube Transcript API:** To extract subtitles from videos.

## 7. Non-Functional Requirements
- **Security:** The SQL Sandbox must run against an isolated connection with strictly limited permissions to prevent arbitrary data destruction or system access.
- **Performance:** Webhook responses should return quickly. Long-running tasks (like fetching transcripts and hitting LLMs) must be deferred or processed asynchronously to prevent webhook timeouts.

## 8. Technical Risks
- **SQL Sandbox Isolation:** Giving an LLM or user direct SQL access is risky. **Mitigation:** Use a dedicated restricted PostgreSQL user with read-only access to a specific schema for the sandbox.
- **Rate Limits on GitHub/YouTube APIs:** **Mitigation:** Implement caching for repository queries, and fallback parsers if YouTube transcripts fail.
