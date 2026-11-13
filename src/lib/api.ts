/**
 * API utility functions for backend communication
 */

import apiClient from './axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  errors?: any[];
}

/**
 * Make API request with authentication using axios
 */
async function apiRequest<T>(
  endpoint: string,
  options: { method?: string; data?: any; headers?: Record<string, string> } = {}
): Promise<T> {
  try {
    const response = await apiClient({
      url: `/api${endpoint}`,
      method: options.method || 'GET',
      data: options.data,
      headers: options.headers,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.error || `HTTP error! status: ${error.response.status}`);
    }
    throw new Error(error.message || 'Request failed');
  }
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function apiPost<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    data,
  });
}

/**
 * PUT request
 */
export async function apiPut<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    data,
  });
}

/**
 * PATCH request
 */
export async function apiPatch<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    data,
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

export default apiRequest;

