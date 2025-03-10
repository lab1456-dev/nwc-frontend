import { useState } from 'react';

/**
 * Custom hook for making API requests with consistent error handling
 * 
 * @param endpoint - The API endpoint to call
 * @param authMethod - The authentication method to use (e.g., "Crow", "Device")
 */
export const useApiRequest = (endpoint: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  /**
   * Make an API request with the provided parameters
   * 
   * @param body - The request body
   * @param headers - Additional request headers
   * @returns Object indicating success and containing response data
   */
  const makeRequest = async (
    body: Record<string, any>,
    headers: Record<string, string> = {}
  ) => {
    // Reset states
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.status === 200) {
        setSuccess(true);
        return { success: true, data };
      } else {
        const errorMessage = data.message || 'An error occurred during the operation';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = 'Failed to connect to the server. Please try again.';
      setError(errorMessage);
      console.error('API error:', error);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    makeRequest,
    isLoading,
    error,
    success,
    setError,
    setSuccess,
  };
};
