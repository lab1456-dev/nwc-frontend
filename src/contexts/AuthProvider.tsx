import React, { useState, useEffect } from 'react';
import { 
  CognitoUserPool, 
  CognitoUser, 
  AuthenticationDetails, 
  CognitoUserSession 
} from 'amazon-cognito-identity-js';
import { AuthContext } from './AuthContext';
import { CognitoUserAttributes } from './AuthTypes';

const poolData = {
  UserPoolId: 'us-east-1_uJiLlyoFF',
  ClientId: '3uff7cmoji5rifqrb7vcvc7eoi'
};

const userPool = new CognitoUserPool(poolData);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Global variable to store the Cognito user during MFA flow
let cognitoUser: CognitoUser | null = null;

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<CognitoUserAttributes | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaPending, setMfaPending] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const currentUser = userPool.getCurrentUser();
    
    if (currentUser) {
      currentUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          console.error("Session error:", err);
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (session && session.isValid()) {
          setIsAuthenticated(true);
          
          // Get user attributes if needed
          currentUser.getUserAttributes((err, attributes) => {
            if (err) {
              console.error("Error getting user attributes:", err);
              setLoading(false);
              return;
            }
            
            if (attributes) {
              const userAttributes = attributes.reduce((acc, attribute) => {
                acc[attribute.getName()] = attribute.getValue();
                return acc;
              }, {} as CognitoUserAttributes);
              
              setUser(userAttributes);
            }
            setLoading(false);
          });
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
        }
      });
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Handle URL tokens (for redirect based auth flows)
  useEffect(() => {
    // Check if we have tokens in the URL (from a redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      console.log("Detected auth redirect with code");
      // You might need to implement specific handling here if using auth code grant flow
    }
  }, []);

  // Sign in function
  const signIn = (username: string, password: string, mfaCode?: string): Promise<CognitoUserSession> => {
    return new Promise((resolve, reject) => {
      // If we have an existing MFA challenge and a code is provided
      if (mfaPending && mfaCode && cognitoUser) {
        cognitoUser.sendMFACode(mfaCode, {
          onSuccess: (session) => {
            setIsAuthenticated(true);
            setMfaPending(false);
            
            // Get user attributes
            cognitoUser!.getUserAttributes((err, attributes) => {
              if (err) {
                console.error("Error getting user attributes:", err);
                return;
              }
              
              if (attributes) {
                const userAttributes = attributes.reduce((acc, attribute) => {
                  acc[attribute.getName()] = attribute.getValue();
                  return acc;
                }, {} as CognitoUserAttributes);
                
                setUser(userAttributes);
              }
            });
            
            resolve(session);
          },
          onFailure: (err) => {
            reject(err);
          }
        });
        return;
      }

      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password
      });

      cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
        Storage: localStorage // Explicitly set storage
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          setIsAuthenticated(true);
          setMfaPending(false);
          
          // Get user attributes
          cognitoUser!.getUserAttributes((err, attributes) => {
            if (err) {
              console.error("Error getting user attributes:", err);
              return;
            }
            
            if (attributes) {
              const userAttributes = attributes.reduce((acc, attribute) => {
                acc[attribute.getName()] = attribute.getValue();
                return acc;
              }, {} as CognitoUserAttributes);
              
              setUser(userAttributes);
            }
          });
          
          resolve(session);
        },
        onFailure: (err) => {
          console.error("Authentication failed:", err);
          setIsAuthenticated(false);
          setUser(null);
          setMfaPending(false);
          reject(err);
        },
        mfaRequired: (challengeName) => {
          console.log("MFA required:", challengeName);
          // Handle MFA challenge
          setMfaPending(true);
          
          // Create a custom error to indicate MFA is required
          const mfaError = new Error('MFA is required to complete authentication');
          mfaError.name = 'MFARequiredError';
          reject(mfaError);
        },
        totpRequired: (challengeName) => {
          console.log("TOTP required:", challengeName);
          // Handle TOTP (Time-based One-Time Password) challenge
          setMfaPending(true);
          
          // Create a custom error to indicate TOTP is required
          const totpError = new Error('TOTP code is required to complete authentication');
          totpError.name = 'TOTPRequiredError';
          reject(totpError);
        },
        newPasswordRequired: (_userAttributes, _requiredAttributes) => {
          console.log("New password required");
          // Handle new password required
          const newPasswordError = new Error('New password required');
          newPasswordError.name = 'NewPasswordRequiredError';
          reject(newPasswordError);
        },
        // Added for completeness, but rarely used in typical setups
        selectMFAType: (challengeName, _challengeParameters) => {
          console.log("Select MFA type:", challengeName);
          const selectMfaError = new Error('Please select MFA type');
          selectMfaError.name = 'SelectMFATypeError';
          reject(selectMfaError);
        }
      });
    });
  };

  // Sign out function
  const signOut = () => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setMfaPending(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      signIn, 
      signOut, 
      loading,
      mfaRequired: mfaPending
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;