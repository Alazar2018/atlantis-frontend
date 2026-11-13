/**
 * Fetch wrapper that automatically adds Authorization header with bearer token
 */

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  // Prepare headers
  const headers = new Headers(options.headers || {});

  // Add Authorization header if token exists
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Make request with auth header
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for refresh token
  });
}

