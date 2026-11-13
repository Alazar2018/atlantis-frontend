/**
 * Authentication utilities
 * This file contains helper functions for authentication
 */

export const SAMPLE_CREDENTIALS = {
  email: "",
  password: "",
};

/**
 * Check if user is authenticated
 * This should be used in server components
 */
export async function isAuthenticated(request?: Request): Promise<boolean> {
  // For server-side checks, we would verify the cookie
  // This is a placeholder for when we implement the full backend
  return false;
}

