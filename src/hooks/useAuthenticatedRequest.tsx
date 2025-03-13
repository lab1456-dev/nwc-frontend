import { useState, useContext, useCallback, useEffect, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { 
  ApiResponse, 
  makeApiRequest, 
  API_CONFIG,
  buildApiUrl
} from '../services/apiService';

/**
 * Enhanced hook that combines API requests with Cognito authentication
 * Handles token expiration, role-based permissions, and group fetching
 * 
 * @param endpointPath - The API endpoint path (not the full URL)
 * @param requiredGroups - Optional array of group names required for authorization
 * @param bypassGroupCheck - Optional flag to bypass group check (for debugging)
 */
export const useAuthenticatedRequest = (
  endpointPath: string, 
  requiredGroups?: string[],
  bypassGroupCheck: boolean = false
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>(undefined);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [groupsLoaded, setGroupsLoaded] = useState(false);
  
  // Use a ref to track if groups are being fetched
  const fetchingGroups = useRef(false);
  
  // Get auth context to access the Cognito token and user info
  const { 
    getAuthToken, 
    isAuthenticated, 
    user 
  } = useContext(AuthContext);

  /**
   * Fetch user groups from the backend if not available in user object
   */
  const fetchUserGroups = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (fetchingGroups.current) return;
    fetchingGroups.current = true;
    
    try {
      // Skip if we're not authenticated
      if (!isAuthenticated) {
        setUserGroups([]);
        setGroupsLoaded(true);
        fetchingGroups.current = false;
        return;
      }
      
      // Get token for the request
      const token = await getAuthToken();
      if (!token) {
        console.error('Failed to get auth token for group fetch');
        setGroupsLoaded(true);
        fetchingGroups.current = false;
        return;
      }
      
      // Check if API_CONFIG has usergroups endpoint
      if (!API_CONFIG.ENDPOINTS.USER_GROUPS) {
        console.warn('USER_GROUPS endpoint not defined in API_CONFIG');
        // If unable to fetch groups, we'll assume access for now
        setUserGroups([]);
        setGroupsLoaded(true);
        fetchingGroups.current = false;
        return;
      }
      
      // Build URL and make request
      const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.USER_GROUPS);
      
      // Make API request to get groups
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ operation: 'usergroups' })
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching user groups: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Get groups from response
      const groups = result.groups || [];
      console.log('Fetched user groups:', groups);
      
      setUserGroups(groups);
      setGroupsLoaded(true);
    } catch (error) {
      console.error('Error fetching user groups:', error);
      // If there's an error fetching groups, we'll log it but not block the app
      setUserGroups([]);
      setGroupsLoaded(true);
    } finally {
      fetchingGroups.current = false;
    }
  }, [isAuthenticated, getAuthToken]);

  // Check if user has required group permissions
  useEffect(() => {
    // If bypassing group check, assume authorized
    if (bypassGroupCheck) {
      setIsAuthorized(isAuthenticated);
      return;
    }
    
    // If no specific groups required, just need to be authenticated
    if (!requiredGroups || requiredGroups.length === 0) {
      setIsAuthorized(isAuthenticated);
      return;
    }

    // Not authorized if not authenticated
    if (!isAuthenticated) {
      setIsAuthorized(false);
      return;
    }
    
    // Debug info
    console.log('User object:', user);
    
    // Try to get groups from various possible locations in user object
    let userGroupsFromToken: string[] = [];
    const possibleGroupSources = [
      user?.['cognito:groups'],
      user?.groups,
      user?.['custom:groups']
    ];
    
    for (const source of possibleGroupSources) {
      if (source) {
        if (typeof source === 'string') {
          userGroupsFromToken = source.split(',').map(g => g.trim());
          break;
        } else if (Array.isArray(source)) {
          userGroupsFromToken = source;
          break;
        }
      }
    }
    
    console.log('Groups from token:', userGroupsFromToken);
    
    // If we have groups from the token, use them
    if (userGroupsFromToken.length > 0) {
      setUserGroups(userGroupsFromToken);
      setGroupsLoaded(true);
      
      // Check if user has any of the required groups
      const hasRequiredGroup = requiredGroups.some(group => 
        userGroupsFromToken.includes(group)
      );
      
      console.log('Authorization result from token groups:', hasRequiredGroup);
      setIsAuthorized(hasRequiredGroup);
      return;
    }
    
    // If no groups in token, but we've already loaded groups from API
    if (groupsLoaded) {
      // Check if user has any of the required groups
      const hasRequiredGroup = requiredGroups.some(group => 
        userGroups.includes(group)
      );
      
      console.log('Authorization result from API groups:', hasRequiredGroup);
      setIsAuthorized(hasRequiredGroup);
      return;
    }
    
    // If no groups in token and we haven't loaded from API yet, fetch them
    fetchUserGroups();
    
  }, [isAuthenticated, user, requiredGroups, userGroups, groupsLoaded, fetchUserGroups, bypassGroupCheck]);

  // When groups change, check authorization again
  useEffect(() => {
    // Skip if no groups required or bypassing check
    if (!requiredGroups || requiredGroups.length === 0 || bypassGroupCheck) {
      return;
    }
    
    // Skip if not authenticated or groups not loaded yet
    if (!isAuthenticated || !groupsLoaded) {
      return;
    }
    
    // Check if user has any of the required groups
    const hasRequiredGroup = requiredGroups.some(group => 
      userGroups.includes(group)
    );
    
    console.log('Group authorization check:', {
      userGroups,
      requiredGroups,
      hasRequiredGroup
    });
    
    setIsAuthorized(hasRequiredGroup);
  }, [userGroups, requiredGroups, isAuthenticated, groupsLoaded, bypassGroupCheck]);

  /**
   * Make an authenticated API request with automatic token handling
   * 
   * @param requestData - The request body
   * @param additionalHeaders - Any additional headers to include
   * @param method - HTTP method to use
   */
  const makeRequest = useCallback(async <T = any>(
    requestData: Record<string, any>,
    additionalHeaders: Record<string, string> = {},
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST'
  ): Promise<ApiResponse<T>> => {
    // Reset state
    setError(null);
    setSuccess(false);
    setData(null);
    setIsLoading(true);
    
    try {
      let token: string | null = null;
      
      // For non-provision endpoints, we need authentication
      if (endpointPath !== API_CONFIG.ENDPOINTS.PROVISION &&
          endpointPath !== API_CONFIG.ENDPOINTS.GET_CROW_MODELS &&
          endpointPath !== API_CONFIG.ENDPOINTS.GET_ACTIVE_OS_IMAGES) {
        
        // Check if user is authenticated
        if (!isAuthenticated) {
          throw new Error('User is not authenticated');
        }
        
        // Check if user is authorized (if requiredGroups specified)
        if (!bypassGroupCheck && requiredGroups && requiredGroups.length > 0 && isAuthorized === false) {
          throw new Error(`User does not have required permissions: ${requiredGroups.join(', ')}`);
        }
        
        // Get the Cognito token
        token = await getAuthToken();
        
        if (!token) {
          throw new Error('Failed to get authentication token');
        }
      }

      // Ensure operation field is present in request data
      // This is required by the controller Lambda
      if (!requestData.operation && endpointPath) {
        // Extract operation from endpoint path
        const pathParts = endpointPath.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        requestData.operation = lastPart.toLowerCase();
      }
      
      // Build the full API URL
      const apiUrl = buildApiUrl(endpointPath);
      
      // Log request (with sensitive data redacted)
      console.debug('API Request:', {
        url: apiUrl,
        method,
        operation: requestData.operation,
        // Exclude sensitive data from logging
        headers: {
          ...additionalHeaders,
          Authorization: token ? '[REDACTED]' : undefined,
        }
      });
      
      // Make the request with the appropriate authentication
      const result = await makeApiRequest<T>(
        endpointPath,
        requestData,
        token || undefined,
        additionalHeaders,
        method
      );
      
      // Handle API response
      if (result.success) {
        setSuccess(true);
        setData(result.data);
      } else {
        setError(result.message || 'Unknown error occurred');
      }
      
      setIsLoading(false);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      console.error('API request error:', error);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  }, [endpointPath, isAuthenticated, isAuthorized, getAuthToken, requiredGroups, bypassGroupCheck]);
  
  /**
   * Reset the state of the hook
   */
  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setData(null);
    setIsLoading(false);
  }, []);

  return {
    makeRequest,
    isLoading,
    error,
    success,
    data,
    reset,
    setSuccess,
    setError,
    isAuthorized,
    userGroups,
    groupsLoaded,
    refreshGroups: fetchUserGroups
  };
};