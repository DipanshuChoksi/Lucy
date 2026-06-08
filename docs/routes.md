# Route Processing Documentation

This document describes how each route in the `server` application processes incoming requests, including the required parameters and request bodies.

## 1. Auth Routes (`/auth`)

These routes handle user authentication, registration, and session management.

*   **`GET /csrf-token`**:
    *   **Controller**: `getCsrfToken`
    *   **Parameters/Body**: None.
    *   **Process**: Generates and returns a double-submit CSRF token to be used by the client for subsequent state-changing requests.
*   **`POST /register`**:
    *   **Controller**: `register`
    *   **Parameters/Body**: 
        *   Request Body (JSON): `{ "email": "user@example.com", "password": "password123" }`
    *   **Process**: Accepts user credentials, validates them, hashes the password, and creates a new user account in the database.
*   **`POST /login`**:
    *   **Controller**: `login`
    *   **Parameters/Body**: 
        *   Request Body (JSON): `{ "email": "user@example.com", "password": "password123" }`
    *   **Process**: Authenticates a user against the database credentials, generates a secure session (or JWT), and sets HttpOnly cookies.
*   **`GET /google`**:
    *   **Middleware**: Passport.js Google Strategy
    *   **Parameters/Body**: None.
    *   **Process**: Initiates the OAuth2 flow by redirecting the user to Google for consent, requesting `profile` and `email` scopes.
*   **`GET /google/callback`**:
    *   **Controller**: `googleCallback` (after Passport middleware)
    *   **Parameters/Body**: 
        *   Query Parameters: Standard OAuth2 `code` and `state` returned by Google.
    *   **Process**: Handles the redirect from Google. If successful, processes the Google profile, creates/updates the user account, issues a session, and redirects to the dashboard. If failed, redirects to `/login`.
*   **`POST /logout`**:
    *   **Controller**: `logout`
    *   **Parameters/Body**: None.
    *   **Process**: Invalidates the current user session and clears authentication cookies.
*   **`GET /me`**:
    *   **Controller**: `me` (protected by `authenticateToken`)
    *   **Parameters/Body**: None (reads authentication state from cookie/header).
    *   **Process**: Returns the profile information of the currently authenticated user.

## 2. Notes Routes (`/notes`)

These routes manage fetching and interacting with the user's notes.

*   **`GET /notes`**:
    *   **Controller**: `notesController.getNotesList`
    *   **Parameters/Body**: 
        *   Query Parameters: `?email=user@example.com`
    *   **Process**: Protected by `doubleCsrfProtection`. Fetches and returns a list of the user's generated notes from the storage provider (S3/GitHub/Obsidian).
*   **`GET /notes/content`**:
    *   **Controller**: `notesController.getNoteContent`
    *   **Parameters/Body**: 
        *   Query Parameters: `?email=user@example.com&filename=example.md&source=S3` (or `GITHUB`)
    *   **Process**: Protected by `doubleCsrfProtection`. Retrieves the detailed markdown content and flashcards for a specific note.

## 3. Settings Routes (`/settings`)

These routes allow users to configure their integrations and application preferences.

*   **`GET /settings`**:
    *   **Controller**: `settingsController.getSettings`
    *   **Parameters/Body**: 
        *   Query Parameters: `?email=user@example.com`
    *   **Process**: Fetches the user's current configuration (e.g., storage provider preferences, repo names).
*   **`PATCH /settings`**:
    *   **Controller**: `settingsController.updateSettings`
    *   **Parameters/Body**: 
        *   Request Body (JSON): `{ "email": "...", "githubToken": "...", "obsidianRepo": "...", "storageProvider": "S3", "s3Bucket": "...", "s3Region": "...", "s3AccessKeyId": "...", "s3SecretAccessKey": "..." }`
    *   **Process**: Validates and updates the user's configuration settings in the database.

## 4. YouTube Routes (`/youtube`)

These routes handle the core active-recall generation pipeline.

*   **`POST /youtube/process`**:
    *   **Controller**: `youtubeController.processVideo`
    *   **Parameters/Body**: 
        *   Request Body (JSON): `{ "youtubeLink": "https://youtube.com/watch?v=...", "email": "user@example.com" }`
    *   **Process**: Accepts a YouTube URL (video or playlist). The controller kicks off the pipeline to extract transcripts, generate markdown notes, create flashcards, and push the final artifacts to the configured storage provider.
