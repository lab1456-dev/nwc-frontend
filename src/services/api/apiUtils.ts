/**
 * API Utilities
 * Common functions for making API requests
 */

import { API_BASE} from './apiConfig';
import type { ApiResponse, HttpMethod, AuthType } from './apiTypes';

/**
 * Build a complete API URL ensuring proper formatting
 * @param endpoint The API endpoint path
 * @returns The complete URL
 */
export const buildApiUrl = (endpoint: string): string => {
  // Remove trailing slash from base URL if it exists
  const cleanBaseUrl = API_BASE.endsWith('/') 
    ? API_BASE.slice(0, -1) 
    : API_BASE;
  
  // Ensure endpoint starts with a slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Construct the final URL
  return `${cleanBaseUrl}${cleanEndpoint}`;
};

/**
 * Generate authorization header based on auth type
 * @param authType The type of authentication to use
 * @param token The authentication token (if applicable)
 * @returns Authorization headers object
 */
export const getAuthHeader = (
  authType: AuthType,
  token?: string
): Record<string, string> => {
  switch (authType) {
    case 'Bearer':
      return token ? { 'Authorization': `Bearer ${token}` } : {};
    case 'None':
    default:
      return {};
  }
};

/**
 * Safely stringify a request body
 * @param data The request data to stringify
 * @returns JSON string of the data
 */
export const safeStringify = (data: any): string => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error stringifying request data:', error);
    return '{}';
  }
};

/**
 * Make an API request with appropriate authentication and error handling
 * @param endpoint API endpoint path
 * @param data Request body data
 * @param authType Type of authentication to use
 * @param token Auth token (if using Bearer auth)
 * @param additionalHeaders Additional request headers
 * @param method HTTP method to use
 * @returns Promise resolving to API response
 */
export const makeApiRequest = async <T = any>(
  endpoint: string,
  data: Record<string, any>,
  authType: AuthType = 'Bearer',
  token?: string,
  additionalHeaders: Record<string, string> = {},
  method: HttpMethod = 'POST'
): Promise<ApiResponse<T>> => {
  try {
    // Build the complete URL
    const url = buildApiUrl(endpoint);
    
    // Get auth headers
    const authHeaders = getAuthHeader(authType, token);
    
    // Combine all headers
    const headers = {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...additionalHeaders
    };
    
    // Configure fetch options
    const fetchOptions: RequestInit = {
      method,
      headers
    };
    
    // Add body for non-GET requests
    if (method !== 'GET' && Object.keys(data).length > 0) {
      fetchOptions.body = safeStringify(data);
    }
    
    // Make the request
    const response = await fetch(url, fetchOptions);
    
    // Parse response based on content type
    let responseData: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    // Check for success
    if (response.ok) {
      return {
        success: true,
        data: responseData,
        requestId: responseData.requestId
      };
    } else {
      // Extract error message
      const errorMessage = typeof responseData === 'object' && responseData.message 
        ? responseData.message 
        : `Request failed with status: ${response.status}`;
      
      console.error('API error response:', responseData);
      
      return {
        success: false,
        message: errorMessage,
        requestId: responseData.requestId
      };
    }
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network or server error occurred'
    };
  }
};