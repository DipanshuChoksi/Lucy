import { doubleCsrf } from 'csrf-csrf';
import { Request } from 'express';

export const {
  invalidCsrfTokenError, // This is just for convenience if we want to check the error message
  generateCsrfToken: generateToken, // Use this in your routes to provide a CSRF hash cookie and token
  validateRequest, // Also a convenience if we want to use the function directly
  doubleCsrfProtection, // This is the default CSRF protection middleware
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "fallback-secret",
  cookieName: process.env.NODE_ENV === "production" ? "__Host-psifi.x-csrf-token" : "x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",  // strictly sameSite protects from CSRF as well, but 'lax' allows normal navigation
    path: "/",
    secure: process.env.NODE_ENV === "production",
  },
  size: 64, // The size of the generated tokens in bytes
  ignoredMethods: ["GET", "HEAD", "OPTIONS"], // A list of request methods that will not be protected.
  getCsrfTokenFromRequest: (req: Request) => req.headers["x-csrf-token"] as string, // How the token is retrieved from the request.
  getSessionIdentifier: (req: Request) => req.cookies['__Secure-token'] || 'guest',
});
