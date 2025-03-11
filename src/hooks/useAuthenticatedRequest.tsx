import { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ApiResponse, buildApiUrl } from '../services/apiService';

/**
 * Custom hook that combines API requests with Cognito authentication
 * 
 * @param endpoint - The API endpoint to call
 */
export const useAuthenticatedRequest = (endpoint: string) => {
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
      // Check if user is authenticated
      if (!isAuthenticated) {
        throw new Error('User is not authenticated');
      }
      
      // Get the Cognito token
      const token = await getAuthToken();
      
      if (!token) {
        throw new Error('Failed to get authentication token');
      }
      
      // Prepare request URL and options
      const url = buildApiUrl(endpoint);
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...additionalHeaders
        }
      };
      
      // Add body for non-GET requests
      if (method !== 'GET') {
        fetchOptions.body = JSON.stringify(requestData);
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
      
      // Handle API response
      if (response.ok) {
        setSuccess(true);
        setData(responseData);
        return { success: true, data: responseData as T };
      } else {
        // Extract error message from response if available
        const errorMessage = 
          (typeof responseData === 'object' && responseData.message) 
            ? responseData.message 
            : `Request failed with status: ${response.status}`;
        
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      console.error('API request error:', error);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, isAuthenticated, getAuthToken]);
  
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