# Product Requirements Document: Developer Assistant Platform

**Version:** 1.0-draft
**Date:** 2026-05-25
**Author:** AI-Assisted
**Status:** Draft — Pending Verification

## 1. Problem Statement
Developers frequently context-switch between coding, learning algorithms, watching tutorials, and finding open-source issues. Passive consumption of tutorials leads to poor retention, while practicing DSA and SQL lacks immediate, socratic feedback in convenient form factors like mobile messaging.

## 2. Target Users
- **Junior to Mid-Level Engineers:** Looking to improve DSA/SQL skills, contribute to open-source, and learn system design actively.
- **Data Engineers:** Needing a quick sandbox to test and optimize SQL queries on the go.

## 3. Proposed Solution
A multi-agent Developer Assistant platform accessible via mobile messaging (Telegram/WhatsApp) and an accompanying web application. The platform provides Socratic DSA coaching, active-recall study notes from videos synced to Obsidian via GitHub, proactive open-source issue scouting, and an on-the-go SQL execution sandbox with a prepopulated dataset.

## 4. Key Features (MVP)
- **DSA Coach (Socratic Mentor):** Analyzes LeetCode problems/code and gives step-by-step hints without providing the solution.
- **Content Ingestor (Active Recall):** Extracts YouTube/article content, generates markdown notes and flashcards, and pushes them to a GitHub repo synced with the user's Obsidian vault.
- **Open-Source Scout:** Periodically scans GitHub for "good first issues" matching the user's Node.js/TS/React skills and suggests approaches.
- **SQL Sandbox:** Executes SQL queries against a prepopulated sandboxed PostgreSQL database and explains the `EXPLAIN ANALYZE` performance bottlenecks.
- **Accompanying Webapp:** A centralized dashboard built with Node.js/TS to manage settings, view the prepopulated SQL schema, and configure integrations.

## 5. Success Metrics
- 5+ open source PRs submitted via the Scout suggestions within 3 months.
- High retention (e.g., Daily Active Use) for DSA/SQL practice queries.
- Consistent translation of watched technical videos into active recall notes in Obsidian.

## 6. Out of Scope (V1)
- Full integrated IDE or code execution for non-SQL languages.
- Complex user authentication for multiple disparate users (initially scoped as a personal or single-tenant tool).
- Video generation or complex audio processing beyond transcript extraction.

## 7. Acceptance Criteria
- **DSA Coach:** Given a LeetCode problem, when the user asks for help, then the bot responds with a hint about time/space complexity without giving the code.
- **Content Ingestor:** Given a YouTube link, when the bot processes it, then a markdown file with flashcards is successfully committed to the target GitHub repository.
- **OS Scout:** Given a target repository, when the cron runs, then the user receives a message summarizing a suitable issue with a suggested approach.
- **SQL Sandbox:** Given a SQL query, when executed, then the bot returns query results from the prepopulated DB along with performance analysis.

## 8. Open Questions
- None at this time.
