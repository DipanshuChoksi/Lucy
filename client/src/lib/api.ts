const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

let cachedCsrfToken: string | null = null;

export async function getCsrfToken(): Promise<string> {
  if (cachedCsrfToken) return cachedCsrfToken;

  const res = await fetch(`${API_URL}/api/auth/csrf-token`, {
    credentials: 'include', // MUST include credentials so the browser saves the Set-Cookie response!
  });

  if (!res.ok) throw new Error('Failed to fetch CSRF token');

  const data = await res.json();
  cachedCsrfToken = data.csrfToken;
  return cachedCsrfToken as string;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const isStateChanging = !['GET', 'HEAD', 'OPTIONS'].includes(options.method || 'GET');
  const headers = new Headers(options.headers || {});

  if (isStateChanging) {
    const csrfToken = await getCsrfToken();
    headers.set('x-csrf-token', csrfToken);
  }

  // Ensure credentials are included so the HttpOnly cookie is sent
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });
}
