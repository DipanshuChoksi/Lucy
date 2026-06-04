# Registration User Flow

This document outlines the registration process for the Lucy platform. The system supports two primary methods for account creation: Email/Password and Google OAuth.

## Mermaid Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Next.js Frontend
    participant Backend as Express Backend
    participant DB as PostgreSQL Database
    participant Google as Google Auth

    User->>Frontend: Navigates to /register

    alt Email & Password Registration
        User->>Frontend: Enters Email & Password (min 8 chars)
        User->>Frontend: Clicks "Sign up"
        Frontend->>Backend: GET /api/auth/csrf-token
        Backend-->>Frontend: Returns X-CSRF-Token
        Frontend->>Backend: POST /api/auth/register (Credentials + CSRF)
        
        Backend->>DB: Check if email exists
        
        alt User Already Exists
            DB-->>Backend: User found
            Backend-->>Frontend: 409 Conflict (User already exists)
            Frontend-->>User: Displays error message
        else New User
            DB-->>Backend: No user found
            Backend->>Backend: Hash password with argon2
            Backend->>DB: Create new User record
            DB-->>Backend: Return User ID
            Backend->>Backend: Generate JWT Session Token
            Backend-->>Frontend: 201 Created (Sets __Secure-token HttpOnly Cookie)
            Frontend-->>User: Redirects to Dashboard (/)
        end

    else Google OAuth Registration
        User->>Frontend: Clicks "Sign up with Google"
        Frontend->>Backend: Redirects to /api/auth/google
        Backend->>Google: Redirects user for Google Consent
        User->>Google: Grants permission
        Google-->>Backend: Redirects to /api/auth/google/callback with Auth Code
        Backend->>Google: Exchanges code for Profile Info
        Google-->>Backend: Returns Profile (Email, Google ID)
        
        Backend->>DB: Check if user exists by email
        
        alt User Exists (Linking)
            DB-->>Backend: User found (Email/Password account)
            Backend->>DB: Update User to link Google ID
        else New User
            DB-->>Backend: No user found
            Backend->>DB: Create new User record with Google ID
        end
        
        Backend->>Backend: Generate JWT Session Token
        Backend-->>Frontend: Redirects to / with __Secure-token HttpOnly Cookie
        Frontend-->>User: User is logged in and sees Dashboard
    end
```

## Security Considerations

- **CSRF Protection:** The frontend automatically fetches a CSRF token from the backend and includes it in state-changing requests (`POST /api/auth/register`) to prevent Cross-Site Request Forgery attacks.
- **Secure Sessions:** Sessions are issued via JSON Web Tokens (JWT) mapped to secure, stateless `__Secure-token` `HttpOnly` cookies, preventing the tokens from being accessed by malicious client-side JavaScript (protecting against XSS).
- **Password Hashing:** Passwords are hashed using the memory-hard `argon2` algorithm with unique per-user salts, ensuring high resilience against brute-force and rainbow table attacks.
- **Input Validation:** The backend enforces a strong minimum password length before processing the registration request.
