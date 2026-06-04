# Login User Flow

This document outlines the authentication and login process for the Lucy platform. Users can securely access their accounts using either Email/Password or Google OAuth.

## Mermaid Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Next.js Frontend
    participant Backend as Express Backend
    participant DB as PostgreSQL Database
    participant Google as Google Auth

    User->>Frontend: Navigates to /login

    alt Email & Password Login
        User->>Frontend: Enters Email & Password
        User->>Frontend: Clicks "Sign in"
        Frontend->>Backend: GET /api/auth/csrf-token
        Backend-->>Frontend: Returns X-CSRF-Token
        Frontend->>Backend: POST /api/auth/login (Credentials + CSRF)
        
        Backend->>DB: Lookup user by email
        
        alt Invalid Credentials
            DB-->>Backend: User not found OR Missing passwordHash
            Backend-->>Frontend: 401 Unauthorized (Invalid credentials)
            Frontend-->>User: Displays error message
        else User Found
            DB-->>Backend: Returns User record and passwordHash
            Backend->>Backend: Verify password using argon2
            
            alt Password Mismatch
                Backend-->>Frontend: 401 Unauthorized (Invalid credentials)
                Frontend-->>User: Displays error message
            else Password Match
                Backend->>Backend: Generate JWT Session Token
                Backend-->>Frontend: 200 OK (Sets __Secure-token HttpOnly Cookie)
                Frontend-->>User: Redirects to Dashboard (/)
            end
        end

    else Google OAuth Login
        User->>Frontend: Clicks "Sign in with Google"
        Frontend->>Backend: Redirects to /api/auth/google
        Backend->>Google: Redirects user for Google Auth
        User->>Google: Authenticates
        Google-->>Backend: Redirects to /api/auth/google/callback with Auth Code
        Backend->>Google: Exchanges code for Profile Info
        Google-->>Backend: Returns Profile (Email, Google ID)
        
        Backend->>DB: Check if user exists by email
        
        alt User Exists
            DB-->>Backend: User found
            Backend->>Backend: Generate JWT Session Token
            Backend-->>Frontend: Redirects to / with __Secure-token HttpOnly Cookie
            Frontend-->>User: User is logged in and sees Dashboard
        else User Not Found (Accidental Signup)
            DB-->>Backend: No user found
            Backend->>DB: Create new User record with Google ID (JIT Provisioning)
            Backend->>Backend: Generate JWT Session Token
            Backend-->>Frontend: Redirects to / with __Secure-token HttpOnly Cookie
            Frontend-->>User: User is logged in and sees Dashboard
        end
    end
```

## Security Considerations

- **Credential Obfuscation:** The backend returns a generic "Invalid credentials" error for both unrecognized emails and incorrect passwords to prevent user enumeration attacks.
- **CSRF Protection:** State-changing requests like login are protected by a strict Cross-Site Request Forgery (CSRF) token implemented via the `double-submit cookie` pattern.
- **Stateless Authentication:** Successful logins grant a stateless JSON Web Token (JWT) injected seamlessly into an `HttpOnly` and `Secure` cookie, ensuring that user sessions are resistant to token-theft via cross-site scripting (XSS).
