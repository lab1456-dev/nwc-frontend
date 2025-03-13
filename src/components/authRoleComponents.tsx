import React, { useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Component props for RequireAuth
 */
interface RequireAuthProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Component that requires user to be authenticated
 * Redirects to login if not authenticated
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to login, preserving the return URL
      const currentPath = window.location.pathname;
      navigate(redirectTo, { 
        state: { returnUrl: currentPath } 
      });
    }
  }, [isAuthenticated, loading, navigate, redirectTo]);
  
  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

/**
 * Component props for RequireGroup
 */
interface RequireGroupProps {
  children: ReactNode;
  groups: string[];
  redirectTo?: string;
}

/**
 * Component that requires user to be in specific Cognito groups
 * Redirects to unauthorized page if not in required groups
 */
export const RequireGroup: React.FC<RequireGroupProps> = ({ 
  children, 
  groups, 
  redirectTo = '/unauthorized' 
}) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Don't check groups until auth is confirmed and loaded
    if (loading || !isAuthenticated) return;
    
    // Get user groups from Cognito attributes
    const userGroups = user?.['cognito:groups'] || [];
    
    // Convert to array if it's a string (comma-separated)
    const groupsArray = typeof userGroups === 'string' 
      ? userGroups.split(',').map(g => g.trim())
      : userGroups;
    
    // Check if user has any of the required groups
    const hasRequiredGroup = groups.some(group => 
      groupsArray.includes(group)
    );
    
    if (!hasRequiredGroup) {
      // Redirect to unauthorized page with details
      navigate(redirectTo, { 
        state: { 
          requiredGroups: groups,
          currentGroups: groupsArray 
        } 
      });
    }
  }, [isAuthenticated, user, loading, groups, navigate, redirectTo]);
  
  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  // Only render children if authenticated and in required groups
  return isAuthenticated ? <>{children}</> : null;
};

/**
 * Component props for ConditionalContent
 */
interface ConditionalContentProps {
  children: ReactNode;
  groups?: string[];
  requireAuth?: boolean;
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders content based on auth status and group membership
 * Renders fallback content if conditions not met
 */
export const ConditionalContent: React.FC<ConditionalContentProps> = ({ 
  children, 
  groups, 
  requireAuth = true,
  fallback = null 
}) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  
  // Check if user is authenticated (if required)
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }
  
  // If groups are specified, check group membership
  if (groups && groups.length > 0) {
    // Get user groups from Cognito attributes
    const userGroups = user?.['cognito:groups'] || [];
    
    // Convert to array if it's a string (comma-separated)
    const groupsArray = typeof userGroups === 'string' 
      ? userGroups.split(',').map(g => g.trim())
      : userGroups;
    
    // Check if user has any of the required groups
    const hasRequiredGroup = groups.some(group => 
      groupsArray.includes(group)
    );
    
    // Render fallback if not in required groups
    if (!hasRequiredGroup) {
      return <>{fallback}</>;
    }
  }
  
  // Render children if all conditions are met
  return <>{children}</>;
};

/**
 * Hook to check if current user is in specified groups
 * @param groups - Array of group names to check
 * @returns boolean indicating if user is in any of the specified groups
 */
export const useIsInGroups = (groups: string[]): boolean => {
  const { isAuthenticated, user } = useContext(AuthContext);
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  // Get user groups from Cognito attributes
  const userGroups = user['cognito:groups'] || [];
  
  // Convert to array if it's a string (comma-separated)
  const groupsArray = typeof userGroups === 'string' 
    ? userGroups.split(',').map(g => g.trim())
    : userGroups;
  
  // Check if user has any of the specified groups
  return groups.some(group => groupsArray.includes(group));
};

/**
 * Hook to get all groups the current user belongs to
 * @returns array of group names the user belongs to
 */
export const useUserGroups = (): string[] => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return [];
  }
  
  // Get user groups from Cognito attributes
  const userGroups = user['cognito:groups'] || [];
  
  // Convert to array if it's a string (comma-separated)
  return typeof userGroups === 'string' 
    ? userGroups.split(',').map(g => g.trim())
    : userGroups;
};