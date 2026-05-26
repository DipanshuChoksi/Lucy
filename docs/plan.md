# Implementation Plan: Developer Assistant Platform

## Phase 1: Foundation
- [ ] Task 1.1: Initialize project structure for frontend (Next.js) and backend (Express/TS).
- [ ] Task 1.2: Set up Prisma and PostgreSQL connection in the backend.
- [ ] Task 1.3: Define Prisma schema for `USER` and run initial database migrations.
- [ ] Task 1.4: Scaffold basic frontend layout and Next.js routing.
- [ ] Task 1.5: Set up basic `GET /api/settings` and `PATCH /api/settings` in the backend.

## Phase 2: Core Sandbox & Agent Framework
- [ ] Task 2.1: Configure Telegram Webhook endpoint in Express.
- [x] Task 2.2: Implement LLM gateway (Gemini/OpenAI wrapper) for system prompts.
- [ ] Task 2.3: Set up isolated, read-only PostgreSQL role for the SQL Sandbox.
- [ ] Task 2.4: Implement SQL Sandbox execution logic (parsing `EXPLAIN ANALYZE`).
- [x] Task 2.5: Implement DSA Coach Socratic prompt logic and context management.

## Phase 3: Integration (Content & OS Scout)
- [x] Task 3.1: Implement YouTube transcript fetching and text extraction.
- [x] Task 3.2: Implement prompt logic for summarizing and creating flashcards.
- [x] Task 3.3: Integrate GitHub API to push markdown files to the Obsidian repository.
- [ ] Task 3.4: Set up CRON job for the Open-Source Scout.
- [ ] Task 3.5: Integrate GitHub Issues API to search "good first issues" by tech stack.

## Phase 4: Polish
- [x] Task 4.1: Add web UI for managing GitHub token, Obsidian repository, and tech stack.
- [ ] Task 4.2: Implement robust error handling for LLM timeouts or GitHub API limits.
- [ ] Task 4.3: Refine system prompts for all 4 agents based on initial testing.
- [ ] Task 4.4: Add Telegram sender ID validation (Authentication).

## Phase 5: Launch
- [ ] Task 5.1: Write environment setup and deployment README.
- [ ] Task 5.2: Deploy frontend to Vercel.
- [ ] Task 5.3: Deploy backend and PostgreSQL to Render/Railway.
- [ ] Task 5.4: Connect Telegram bot production webhook to the deployed backend.
