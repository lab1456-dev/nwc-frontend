/**
 * Centralized API configuration and endpoints
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  PROVISION_KEY: import.meta.env.VITE_PROVISION_API_KEY,
  ENDPOINTS: {
    // Main controller endpoints
    MANAGE_CROW_USERS: '/manageCrowUsers',  // For user operations (receive, deploy, etc.)
    MANAGE_CROW_FORMS: '/manageCrowForms',  // For form data operations
    USER_GROUPS: '/usergroups'              // For user group operations
  },
  // Operations for each controller
  OPERATIONS: {
    // User operations
    RECEIVE: 'receive',
    DEPLOY: 'deploy',
    REPLACE: 'replace',
    TRANSFER: 'transfer',
    SUSPEND_REACTIVATE: 'suspendreactivate',
    RETIRE: 'retire',
    
    // Form data operations
    GET_CROWS: 'crows',
    GET_SITES: 'sites',
    GET_WORK_CELLS: 'workcells',
    GET_CROW_MODELS: 'crowmodels',
    GET_OS_VERSIONS: 'osversions',  // Operation for OS versions worker
    
    // User group operations
    GET_USER_GROUPS: 'usergroups'
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
 * Common data types used across the application
 */
export interface CrowData {
  crow_id: string;
  site_id: string;
  work_cell_id?: string;
}

/**
 * Build a complete API URL ensuring proper formatting
 * Prevents URL duplication issues
 */
export const buildApiUrl = (endpoint: string): string => {
  // Remove trailing slash from base URL if it exists
  const cleanBaseUrl = API_CONFIG.BASE_URL.endsWith('/') 
    ? API_CONFIG.BASE_URL.slice(0, -1) 
    : API_CONFIG.BASE_URL;
  
  // Ensure endpoint starts with a slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Construct the final URL
  const url = `${cleanBaseUrl}${cleanEndpoint}`;
  
  // Log for debugging (can be removed in production)
  console.debug('API URL constructed:', url);
  
  return url;
};

/**
 * Generate authorization header based on auth type and ID
 */
export const getAuthHeader = (
  authType: 'Bearer' | 'ApiKey',
  id?: string
): Record<string, string> => {
  switch (authType) {
    case 'Bearer':
      return { 'Authorization': `Bearer ${id}` };
    case 'ApiKey':
      return { 'x-api-key': API_CONFIG.PROVISION_KEY };
    default:
      return {};
  }
};

/**
 * Make an API request with the appropriate authentication
 */
export const makeApiRequest = async <T = any>(
  endpoint: string,
  data: Record<string, any>,
  token?: string,
  additionalHeaders: Record<string, string> = {},
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST'
): Promise<ApiResponse<T>> => {
  try {
    // Build the proper URL
    const url = buildApiUrl(endpoint);
    
    // Determine auth headers based on endpoint
    const authHeaders = token 
      ? getAuthHeader('Bearer', token)
      : (endpoint.includes('provision') ? getAuthHeader('ApiKey') : {});
    
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
      fetchOptions.body = JSON.stringify(data);
    }
    
    // Log request details (with sensitive data redacted)
    console.debug('API Request:', {
      url,
      method,
      operation: data.operation,
      // Exclude sensitive data from logging
      headers: {
        ...headers,
        Authorization: headers.Authorization ? '[REDACTED]' : undefined,
        'x-api-key': headers['x-api-key'] ? '[REDACTED]' : undefined
      }
    });
    
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
        data: responseData
      };
    } else {
      // Extract error message
      const errorMessage = typeof responseData === 'object' && responseData.message 
        ? responseData.message 
        : `Request failed with status: ${response.status}`;
      
      console.error('API error response:', responseData);
      
      return {
        success: false,
        message: errorMessage
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

/**
 * Service functions for different API operations
 */

// Receive a Crow at a site
export const receiveCrow = async (
  data: CrowData,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.MANAGE_CROW_USERS,
    {
      operation: API_CONFIG.OPERATIONS.RECEIVE,
      ...data
    },
    token,
    { 'step': 'received' }
  );
};

// Deploy a Crow to a work cell
export const deployCrow = async (
  data: CrowData,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.MANAGE_CROW_USERS,
    {
      operation: API_CONFIG.OPERATIONS.DEPLOY,
      ...data
    },
    token,
    { 'step': 'deployed' }
  );
};

// Replace a Crow
export const replaceCrow = async (
  data: CrowData & { replacement_crow_id: string },
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.MANAGE_CROW_USERS,
    {
      operation: API_CONFIG.OPERATIONS.REPLACE,
      ...data
    },
    token,
    { 'step': 'replaced' }
  );
};

// Transfer a Crow to another site
export const transferCrow = async (
  data: CrowData & { destination_site_id: string },
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.MANAGE_CROW_USERS,
    {
      operation: API_CONFIG.OPERATIONS.TRANSFER,
      ...data
    },
    token,
    { 'step': 'transferred' }
  );
};

// Retire a Crow
export const retireCrow = async (
  data: CrowData,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.MANAGE_CROW_USERS,
    {
      operation: API_CONFIG.OPERATIONS.RETIRE,
      ...data
    },
    token,
    { 'step': 'retired' }
  );
};

// Get all Crows for a site
export const getCrowsForSite = async (
  siteId: string,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.MANAGE_CROW_FORMS,
    { 
      operation: API_CONFIG.OPERATIONS.GET_CROWS,
      site_id: siteId 
    },
    token
  );
};

// Get crow models
export const getCrowModels = async (
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.MANAGE_CROW_FORMS,
    { operation: API_CONFIG.OPERATIONS.GET_CROW_MODELS },
    token
  );
};

// Get user groups
export const getUserGroups = async (
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.USER_GROUPS,
    { operation: API_CONFIG.OPERATIONS.GET_USER_GROUPS },
    token
  );
};

/**
 * Get active OS images (for Provision page)
 * This operation doesn't require authentication, but still uses POST with operation in body
 */
export const getActiveOsImages = async (): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.MANAGE_CROW_FORMS,
    { 
      operation: API_CONFIG.OPERATIONS.GET_OS_VERSIONS
    },
    undefined, // No token needed
    {} // No additional headers
  );
};