/**
 * Centralized API configuration and endpoints
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  PROVISION_URL: import.meta.env.VITE_PROVISION_API_URL,
  PROVISION_KEY: import.meta.env.VITE_PROVISION_API_KEY,
  ENDPOINTS: {
    PROVISION: '/provision',
    RECEIVE: '/receive',
    DEPLOY: '/deploy',
    REPLACE: '/replace',
    TRANSFER: '/transfer',
    MONITOR_STATUS: '/monitor-status',
    RETIRE: '/retire',
    GET_CROWS: '/getcrows',
    NON_DEPLOYED_CROWS: '/non-deployed-crows-at-site'
  }
};

/**
 * Types for API requests and responses
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Generate authorization header based on auth type and ID
 */
export const getAuthHeader = (
  authType: 'Crow' | 'Device' | 'Bearer' | 'ApiKey',
  id?: string
): Record<string, string> => {
  switch (authType) {
    case 'Crow':
    case 'Device':
      // Legacy auth types - consider deprecating
      console.warn(`Using deprecated auth type: ${authType}`);
      return { 'Authorization': `${authType} ${id}` };
    case 'Bearer':
      return { 'Authorization': `Bearer ${id}` };
    case 'ApiKey':
      return { 'x-api-key': API_CONFIG.PROVISION_KEY };
    default:
      return {};
  }
};

/**
 * Build a complete API URL
 */
export const buildApiUrl = (endpoint: string, baseUrl = API_CONFIG.BASE_URL): string => {
  return `${baseUrl}${endpoint}`;
};

/**
 * Common data types used across the application
 */
export interface CrowData {
  crow_id: string;
  site_id: string;
  work_cell_id?: string;
}

/**
 * Service functions for different API operations
 */

// Deploy a Crow to a work cell
export const deployCrow = async (
  data: CrowData,
  token: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DEPLOY), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader('Bearer', token),
        'step': 'deployed'
      },
      body: JSON.stringify(data),
    });
    
    const responseData = await response.json();
    
    return {
      success: response.status === 200,
      data: responseData,
      message: response.status !== 200 ? responseData.message : undefined
    };
  } catch (error) {
    console.error('Deploy error:', error);
    return {
      success: false,
      message: 'Failed to connect to the server. Please try again.'
    };
  }
};

/**
 * Make an authenticated request to API Gateway using Cognito token
 * 
 * @param endpoint - The API endpoint to call
 * @param data - The request body
 * @param token - The Cognito JWT token
 * @param additionalHeaders - Any additional headers to include
 * @returns Promise with the API response
 */
export const makeAuthenticatedRequest = async <T = any>(
  endpoint: string,
  data: Record<string, any>,
  token: string,
  additionalHeaders: Record<string, string> = {},
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST'
): Promise<ApiResponse<T>> => {
  try {
    const url = buildApiUrl(endpoint);
    
    // Configure fetch options with authorization header
    const fetchOptions: RequestInit = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader('Bearer', token),
        ...additionalHeaders
      }
    };
    
    // Add body for non-GET requests
    if (method !== 'GET') {
      fetchOptions.body = JSON.stringify(data);
    }
    
    // Make the request
    const response = await fetch(url, fetchOptions);
    
    // Handle different response types
    let responseData: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    // Check for common API Gateway error patterns
    if (!response.ok) {
      // Handle specific API Gateway error codes
      if (response.status === 403) {
        console.warn('Authentication error: Invalid or expired token');
      } else if (response.status === 429) {
        console.warn('Rate limit exceeded');
      }
      
      return {
        success: false,
        message: typeof responseData === 'object' && responseData.message 
          ? responseData.message 
          : `Request failed with status: ${response.status}`
      };
    }
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      message: 'Network or server error occurred'
    };
  }
};

/**
 * Receive a Crow at a specific site
 * @param data The Crow and Site data
 * @param token Cognito JWT token
 */
export const receiveCrow = async (
  data: CrowData,
  token: string
): Promise<ApiResponse> => {
  return makeAuthenticatedRequest(
    API_CONFIG.ENDPOINTS.RECEIVE,
    data,
    token,
    { 'step': 'received' }
  );
};

