/**
 * Centralized API configuration and endpoints
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
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
    NON_DEPLOYED_CROWS: '/non-deployed-crows-at-site',
    GET_CROW_MODELS: '/getcrowmodels',
    GET_ACTIVE_OS_IMAGES: '/getactiveosimages'
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
 * Determine the appropriate authentication headers based on endpoint
 */
export const getAuthHeadersForEndpoint = (
  endpoint: string, 
  token?: string
): Record<string, string> => {
  // For provision endpoint, use API key authentication
  if (endpoint === API_CONFIG.ENDPOINTS.PROVISION || 
      endpoint === API_CONFIG.ENDPOINTS.GET_CROW_MODELS || 
      endpoint === API_CONFIG.ENDPOINTS.GET_ACTIVE_OS_IMAGES) {
    return getAuthHeader('ApiKey');
  }
  
  // For all other endpoints, use Bearer token if provided
  if (token) {
    return getAuthHeader('Bearer', token);
  }
  
  // If no token is provided for non-provision endpoints, return empty headers
  console.warn('No authentication token provided for protected endpoint');
  return {};
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
    
    // Get the appropriate auth headers for this endpoint
    const authHeaders = getAuthHeadersForEndpoint(endpoint, token);
    
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
    if (method !== 'GET') {
      fetchOptions.body = JSON.stringify(data);
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
        data: responseData
      };
    } else {
      // Extract error message
      const errorMessage = typeof responseData === 'object' && responseData.message 
        ? responseData.message 
        : `Request failed with status: ${response.status}`;
      
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

// Provision a new Crow
export const provisionCrow = async (
  data: { serial_number: string; site_name: string }
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.PROVISION,
    data,
    undefined  // No token needed for provision endpoint
  );
};

// Receive a Crow at a site
export const receiveCrow = async (
  data: CrowData,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.RECEIVE,
    data,
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
    API_CONFIG.ENDPOINTS.DEPLOY,
    data,
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
    API_CONFIG.ENDPOINTS.REPLACE,
    data,
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
    API_CONFIG.ENDPOINTS.TRANSFER,
    data,
    token,
    { 'step': 'transferred' }
  );
};

// Check the monitoring status of a Crow
export const checkCrowStatus = async (
  crowId: string,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.MONITOR_STATUS,
    { crow_id: crowId },
    token
  );
};

// Retire a Crow
export const retireCrow = async (
  data: CrowData,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.RETIRE,
    data,
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
    API_CONFIG.ENDPOINTS.GET_CROWS,
    { site_id: siteId },
    token
  );
};

// Get non-deployed Crows at a site
export const getNonDeployedCrowsAtSite = async (
  siteId: string,
  token: string
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.NON_DEPLOYED_CROWS,
    { site_id: siteId },
    token
  );
};

/**
 * Get all manufacturers or models for a specific manufacturer
 * @param manufacturer Manufacturer ID or "*" to get all manufacturers
 * @param models Model ID or "*" to get all models for a manufacturer
 */
export const getCrowModels = async (
  manufacturer: string = "*",
  models: string = "*"
): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.GET_CROW_MODELS,
    { manufacturer, models },
    undefined,  // No token needed
    {},  // No additional headers
    'GET'  // GET method
  );
};

/**
 * Get all active OS images
 */
export const getActiveOsImages = async (): Promise<ApiResponse> => {
  return makeApiRequest(
    API_CONFIG.ENDPOINTS.GET_ACTIVE_OS_IMAGES,
    {},
    undefined,  // No token needed
    {},  // No additional headers
    'GET'  // GET method
  );
};