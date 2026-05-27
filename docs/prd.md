# Product Requirements Document: Developer Assistant Platform

**Version:** 1.0-draft
**Date:** 2026-05-25
**Author:** AI-Assisted
**Status:** Draft — Pending Verification

## 1. Problem Statement
Developers frequently context-switch between coding, learning algorithms, watching tutorials. Passive consumption of tutorials leads to poor retention.

## 2. Target Users
- **Junior to Mid-Level Engineers:** Learn from Youtube actively.

## 3. Proposed Solution
A multi-agent Developer Assistant platform with accompanying web application. The platform provides active-recall study notes from videos synced to Obsidian via GitHub.

## 4. Key Features (MVP)
- **Content Ingestor (Active Recall):** Extracts YouTube/article content, generates markdown notes and flashcards, and pushes them to a GitHub repo synced with the user's Obsidian vault.
- **Accompanying Webapp:** A centralized dashboard built with Node.js/TS to manage settings, and configure integrations.

## 5. Success Metrics
- Consistent translation of watched technical videos into active recall notes in Obsidian.

## 6. Out of Scope (V1)
- Complex user authentication for multiple disparate users (initially scoped as a personal or single-tenant tool).

## 7. Acceptance Criteria
- **Content Ingestor:** Given a YouTube link, when the bot processes it, then a markdown file with flashcards is successfully committed to the target GitHub repository.

## 8. Open Questions
- None at this time.
