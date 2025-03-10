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
  crowId: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DEPLOY), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader('Crow', crowId),
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

// Add other API service functions as needed
