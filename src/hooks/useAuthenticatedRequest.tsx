import { useState, useContext, useCallback, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../contexts/AuthContext';
import { 
  ApiResponse, 
  makeApiRequest, 
  API_CONFIG
} from '../services/apiService';

/**
 * Interface for decoded JWT token
 */
interface DecodedToken {
  'cognito:groups'?: string[] | string;
  [key: string]: any;
}

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
   * Extract user groups from JWT token
   * @param token JWT token
   * @returns Array of user groups
   */
  const extractGroupsFromToken = useCallback(async (token: string): Promise<string[]> => {
    try {
      // Decode the JWT token
      const decoded: DecodedToken = jwtDecode(token);
      
      // Extract user groups
      if (decoded['cognito:groups']) {
        // Handle both string and array formats
        if (typeof decoded['cognito:groups'] === 'string') {
          return decoded['cognito:groups'].split(',').map(g => g.trim());
        } else if (Array.isArray(decoded['cognito:groups'])) {
          return decoded['cognito:groups'];
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      throw error;
    }
  }, []);

  /**
   * Fetch user groups from API as fallback method
   */
  const fetchUserGroupsFromAPI = useCallback(async (token: string): Promise<string[]> => {
    try {
      // Check if API_CONFIG has usergroups endpoint
      if (!API_CONFIG.ENDPOINTS.USER_GROUPS) {
        console.warn('USER_GROUPS endpoint not defined in API_CONFIG');
        return [];
      }
      
      // Make API request to get groups
      const result = await makeApiRequest(
        API_CONFIG.ENDPOINTS.USER_GROUPS,
        { operation: API_CONFIG.OPERATIONS.GET_USER_GROUPS },
        token
      );
      
      if (result.success && result.data) {
        const groups = result.data.groups || [];
        return Array.isArray(groups) ? groups : [groups];
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching user groups from API:', error);
      return [];
    }
  }, []);

  /**
   * Fetch user groups using JWT decoding with API fallback
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
      
      // Get token for decoding
      const token = await getAuthToken();
      if (!token) {
        console.error('Failed to get auth token for group fetch');
        setGroupsLoaded(true);
        fetchingGroups.current = false;
        return;
      }
      
      // First try to extract groups from JWT token
      try {
        const groupsFromToken = await extractGroupsFromToken(token);
        if (groupsFromToken.length > 0) {
          console.log('Groups extracted from JWT token:', groupsFromToken);
          setUserGroups(groupsFromToken);
          setGroupsLoaded(true);
          fetchingGroups.current = false;
          return;
        }
      } catch (error) {
        console.warn('Failed to extract groups from JWT, falling back to API');
      }
      
      // If JWT extraction failed or returned empty, fall back to API
      const groupsFromAPI = await fetchUserGroupsFromAPI(token);
      console.log('Groups fetched from API:', groupsFromAPI);
      setUserGroups(groupsFromAPI);
      
      setGroupsLoaded(true);
    } catch (error) {
      console.error('Error fetching user groups:', error);
      // If there's an error fetching groups, we'll log it but not block the app
      setUserGroups([]);
      setGroupsLoaded(true);
    } finally {
      fetchingGroups.current = false;
    }
  }, [isAuthenticated, getAuthToken, extractGroupsFromToken, fetchUserGroupsFromAPI]);

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
      
      // Check if user is authenticated for protected endpoints
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
      
      // Make the request with the appropriate authentication
      const result = await makeApiRequest<T>(
        endpointPath,
        requestData,
        token,
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