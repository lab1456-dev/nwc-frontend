import React, { useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../../contexts/AuthContext';
import { useAuthenticatedRequest } from '../../hooks/useAuthenticatedRequest';
import { API_CONFIG } from '../../services/apiService';
import { 
  PageContainer, 
  PageHeader, 
  ContentCard 
} from '../../components/layoutComponents';
import { 
  SubmitButton, 
  ErrorMessage 
} from '../../components/formComponents';

/**
 * Profile component - Displays user profile information from Cognito
 * and allows looking up user group memberships
 */
const Profile: React.FC = () => {
  // Auth context for user information
  const { user, isAuthenticated, getAuthToken } = useContext(AuthContext);
  
  // State for groups display
  const [showGroups, setShowGroups] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  
  // For backend API fallback
  const { 
    makeRequest, 
    isLoading: apiLoading, 
    error: apiError, 
    data: apiData,
    reset
  } = useAuthenticatedRequest(API_CONFIG.ENDPOINTS.USER_GROUPS);
  
  // Effect to reset when component mounts
  useEffect(() => {
    reset();
  }, [reset]);

  /**
   * Handle looking up user groups by decoding the JWT token
   */
  const handleLookupGroups = async () => {
    setShowGroups(true);
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the JWT token from auth context
      const token = await getAuthToken();
      
      if (!token) {
        throw new Error("Unable to retrieve authentication token");
      }
      
      // Decode the JWT to extract groups
      interface DecodedToken {
        'cognito:groups'?: string[] | string;
        [key: string]: any;
      }
      
      const decoded: DecodedToken = jwtDecode(token);
      
      // Handle groups from JWT
      let cognitoGroups: string[] = [];
      
      if (decoded['cognito:groups']) {
        if (typeof decoded['cognito:groups'] === 'string') {
          // If it's a comma-separated string, split it
          cognitoGroups = decoded['cognito:groups'].split(',').map(g => g.trim());
        } else if (Array.isArray(decoded['cognito:groups'])) {
          // If it's already an array
          cognitoGroups = decoded['cognito:groups'];
        }
      }
      
      setUserGroups(cognitoGroups);
    } catch (err) {
      console.error('Error decoding JWT:', err);
      setError((err as Error).message || 'Failed to retrieve user groups from token');
      
      // Fall back to API request if JWT decode fails
      console.log('Falling back to API request for groups');
      await makeRequest({ operation: API_CONFIG.OPERATIONS.GET_USER_GROUPS });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Render user attributes in a structured format
   */
  const renderUserAttributes = () => {
    if (!user) return null;

    // Define the attributes we want to display and their labels
    const displayAttributes = [
      { key: 'email', label: 'Email' },
      { key: 'name', label: 'Name' },
      { key: 'given_name', label: 'Given Name' },
      { key: 'family_name', label: 'Family Name' },
      { key: 'preferred_username', label: 'Username' },
      { key: 'sub', label: 'User ID' },
      { key: 'email_verified', label: 'Email Verified' }
    ];

    return (
      <div className="space-y-4">
        {displayAttributes.map(attr => {
          const value = user[attr.key];
          if (value === undefined) return null;
          
          return (
            <div key={attr.key} className="flex flex-col space-y-1">
              <label className="text-cyan-300 text-sm font-medium">{attr.label}</label>
              <div className="bg-slate-700/50 rounded px-3 py-2 text-gray-100">
                {attr.key === 'email_verified' ? (value === 'true' ? 'Yes' : 'No') : value}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * Render user groups from the JWT token or API response
   */
  const renderUserGroups = () => {
    if (!showGroups) return null;
    
    // Show loading spinner
    if (isLoading || apiLoading) {
      return (
        <div className="mt-6">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      );
    }
    
    // Show error if both methods failed
    if (error && apiError) {
      return (
        <div className="mt-6">
          <ErrorMessage message={error} />
          <p className="text-amber-200 mt-2">API fallback also failed: {apiError}</p>
          <button
            onClick={() => setShowGroups(false)}
            className="mt-4 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Hide Groups
          </button>
        </div>
      );
    }
    
    // If we have groups from JWT decoding
    if (userGroups.length > 0 || (error === null && !isLoading)) {
      return (
        <div className="mt-6 border-t border-cyan-900/30 pt-6">
          <h3 className="text-xl font-medium text-cyan-200 mb-4">Your Group Memberships</h3>
          <p className="text-cyan-200/70 text-sm mb-4">Retrieved directly from your JWT token</p>
          
          {userGroups.length === 0 ? (
            <p className="text-amber-200">You are not a member of any groups.</p>
          ) : (
            <div className="space-y-2">
              {userGroups.map((group: string, index: number) => (
                <div key={index} className="bg-slate-700/50 rounded px-4 py-3 text-cyan-100">
                  {group}
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={() => setShowGroups(false)}
            className="mt-4 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Hide Groups
          </button>
        </div>
      );
    }
    
    // If JWT decode failed but API request succeeded as fallback
    if (apiData && apiData.groups) {
      const groups = Array.isArray(apiData.groups) ? apiData.groups : [apiData.groups];
      
      return (
        <div className="mt-6 border-t border-cyan-900/30 pt-6">
          <h3 className="text-xl font-medium text-cyan-200 mb-4">Your Group Memberships</h3>
          <p className="text-amber-200/70 text-sm mb-4">Retrieved via API (JWT decode failed)</p>
          
          {groups.length === 0 ? (
            <p className="text-amber-200">You are not a member of any groups.</p>
          ) : (
            <div className="space-y-2">
              {groups.map((group: string, index: number) => (
                <div key={index} className="bg-slate-700/50 rounded px-4 py-3 text-cyan-100">
                  {group}
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={() => setShowGroups(false)}
            className="mt-4 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Hide Groups
          </button>
        </div>
      );
    }
    
    return null;
  };

  /**
   * If not authenticated, show a message
   */
  if (!isAuthenticated) {
    return (
      <PageContainer>
        <PageHeader
          title="User Profile"
          subtitle="View your account information"
        />
        
        <ContentCard>
          <div className="text-center py-8">
            <p className="text-amber-200">You need to be signed in to view your profile.</p>
          </div>
        </ContentCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="User Profile"
        subtitle="View your account information and group memberships"
      />
      
      <ContentCard>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-cyan-200 border-b border-cyan-900/30 pb-2">
            Account Information
          </h2>
          
          {renderUserAttributes()}
          
          {!showGroups && (
            <div className="flex justify-center mt-8">
              <SubmitButton
                onClick={handleLookupGroups}
                isLoading={isLoading}
                text="Lookup My Group Memberships"
                loadingText="Looking up groups..."
              />
            </div>
          )}
          
          {renderUserGroups()}
        </div>
      </ContentCard>
    </PageContainer>
  );
};

export default Profile;