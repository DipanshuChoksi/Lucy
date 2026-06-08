# CSRF Protection Architecture

This document explains how Cross-Site Request Forgery (CSRF) protection is implemented in the application to prevent malicious sites from executing unauthorized commands on behalf of authenticated users.

## 1. The Strategy: Double Submit Cookie Pattern

We utilize the **Double Submit Cookie** pattern implemented via the `csrf-csrf` library. This is a stateless CSRF protection approach that does not require storing tokens in the server's session memory or database.

In this pattern:
1. The server generates a cryptographically secure token.
2. The server sends this token to the client in two ways:
   - As an `HttpOnly` cookie (e.g., `__Host-psifi.x-csrf-token` in production).
   - Within the response payload (e.g., `{"csrfToken": "..."}`).
3. For subsequent state-changing requests, the client must read the token from the payload and attach it to an HTTP header (specifically `x-csrf-token`).
4. The server compares the token from the header with the token inside the `HttpOnly` cookie (hashed with a secret key). If they match, the request is permitted.

## 2. Implementation Details

Our CSRF logic is located in `server/src/middlewares/csrf.middleware.ts`.

### 2.1 Configuration
*   **Library**: `csrf-csrf`
*   **Secret**: We use `CSRF_SECRET` from the environment.
*   **Cookie Name**: `__Host-psifi.x-csrf-token` in production, and `x-csrf-token` in development. The `__Host-` prefix provides maximum cookie security by locking it to the root path and enforcing `Secure`.
*   **Cookie Flags**: 
    *   `httpOnly`: `true` (Cannot be read via JavaScript `document.cookie`).
    *   `sameSite`: `'lax'` (Provides baseline defense while allowing normal navigation).
    *   `secure`: `true` in production (Requires HTTPS).

### 2.2 Token Retrieval & Generation
*   **Endpoint**: Clients can fetch a token by calling `GET /auth/csrf-token`. This endpoint executes `generateCsrfToken()` which sets the hash cookie and returns the raw token in the JSON response.
*   **Storage**: The frontend stores the JSON response token (e.g., in memory or local storage) but **cannot** access the `HttpOnly` cookie.

### 2.3 Protection Enforcement
*   **Middleware**: We apply the `doubleCsrfProtection` middleware to sensitive routes (like POST, PATCH, PUT, DELETE, and even specific GET requests containing sensitive parameters).
*   **Ignored Methods**: By default, safe HTTP methods (`GET`, `HEAD`, `OPTIONS`) are ignored unless explicitly protected.
*   **Validation**: The middleware expects the client to send the token in the `x-csrf-token` HTTP header. It automatically cross-verifies this header against the hashed value in the `HttpOnly` cookie.

### 2.4 Session Binding
Our implementation binds the CSRF token to the user's session identifier by using:
```typescript
getSessionIdentifier: (req: Request) => req.cookies['__Secure-token'] || 'guest'
```
This ensures that a CSRF token generated for one user's session cannot be stolen and used by a different authenticated user.

## 3. Frontend Integration

To correctly interact with protected routes, the frontend application must:
1. Call `GET /auth/csrf-token` during application initialization (or login).
2. Store the returned `csrfToken`.
3. Include the token as an HTTP header on all subsequent requests:
   ```json
   {
       "x-csrf-token": "<your-stored-token>"
   }
   ```
4. Ensure requests include credentials (e.g., `withCredentials: true` in Axios) so the `HttpOnly` cookie is automatically attached by the browser.
