import { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { 
  ApiResponse, 
  makeApiRequest, 
  buildApiUrl,
  API_CONFIG 
} from '../services/apiService';

/**
 * Custom hook that combines API requests with Cognito authentication
 * 
 * @param endpointPath - The API endpoint path (not the full URL)
 */
export const useAuthenticatedRequest = (endpointPath: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<any | null>(null);
  
  // Get auth context to access the Cognito token
  const { getAuthToken, isAuthenticated } = useContext(AuthContext);

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
      if (endpointPath !== API_CONFIG.ENDPOINTS.PROVISION) {
        // Check if user is authenticated
        if (!isAuthenticated) {
          throw new Error('User is not authenticated');
        }
        
        // Get the Cognito token
        token = await getAuthToken();
        
        if (!token) {
          throw new Error('Failed to get authentication token');
        }
      }
      
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
  }, [endpointPath, isAuthenticated, getAuthToken]);
  
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
    setError
  };
};