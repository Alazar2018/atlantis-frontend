/**
 * Helper function to forward authentication headers to backend
 */
export function getForwardHeaders(nextRequest: { headers: Headers }): HeadersInit {
  const cookieHeader = nextRequest.headers.get("cookie") || "";
  const authHeader = nextRequest.headers.get("authorization") || "";

  const headers: HeadersInit = {};
  
  if (cookieHeader) {
    headers.cookie = cookieHeader;
  }
  
  if (authHeader) {
    headers.authorization = authHeader;
  }

  return headers;
}

