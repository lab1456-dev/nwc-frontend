import { useState } from 'react';

/**
 * Custom hook for making API requests with consistent error handling
 * 
 * @param endpoint - The API endpoint to call (full URL)
 */
export const useApiRequest = (endpoint: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<any | null>(null);

  /**
   * Make an API request with the provided parameters
   * 
   * @param body - The request body
   * @param headers - Additional request headers
   * @param method - HTTP method to use (default: POST)
   * @returns Object indicating success and containing response data
   */
  const makeRequest = async (
    body: Record<string, any>,
    headers: Record<string, string> = {},
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST'
  ) => {
    // Reset states
    setError(null);
    setSuccess(false);
    setData(null);
    setIsLoading(true);

    try {
      // Log request details (but redact sensitive information)
      console.debug('API Request:', { 
        url: endpoint,
        method,
        headers: { 
          ...headers,
          Authorization: headers.Authorization ? '[REDACTED]' : undefined,
          'x-api-key': headers['x-api-key'] ? '[REDACTED]' : undefined
        }
      });

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: method !== 'GET' ? JSON.stringify(body) : undefined,
      });

      // Parse response based on content type
      let responseData: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (response.ok) {
        setSuccess(true);
        setData(responseData);
        return { success: true, data: responseData };
      } else {
        const errorMessage = 
          typeof responseData === 'object' && responseData.message
            ? responseData.message
            : `Request failed with status: ${response.status}`;
        
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to connect to the server. Please try again.';
      setError(errorMessage);
      console.error('API error:', error);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset the state of the hook
   */
  const reset = () => {
    setError(null);
    setSuccess(false);
    setData(null);
    setIsLoading(false);
  };

  return {
    makeRequest,
    isLoading,
    error,
    success,
    data,
    setError,
    setSuccess,
    reset
  };
};