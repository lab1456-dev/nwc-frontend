import React, { useState, useEffect } from 'react';
import { 
  CognitoUserPool, 
  CognitoUser, 
  AuthenticationDetails, 
  CognitoUserSession 
} from 'amazon-cognito-identity-js';
import { AuthContext } from './AuthContext';
import { AuthChallengeResponse } from './AuthTypes';

interface CognitoUserAttributes {
  [key: string]: string;
}

export const cognitoConfig = {
  UserPoolId: `${import.meta.env.VITE_COGNITO_USER_POOL_ID}`,
  ClientId: `${import.meta.env.VITE_COGNITO_CLIENT_ID}`
};

const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId,
})

interface AuthProviderProps {
  children: React.ReactNode;
}

// Global variable to store the Cognito user during challenges
let cognitoUser: CognitoUser | null = null;

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<CognitoUserAttributes | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaPending, setMfaPending] = useState(false);
  const [newPasswordRequired, setNewPasswordRequired] = useState(false);

  console.log ({user})
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

  // Sign in function
  const signIn = (username: string, password: string, mfaCode?: string): Promise<AuthChallengeResponse> => {
    return new Promise((resolve, reject) => {
      // If we have an existing MFA challenge and a code is provided
      if (mfaPending && mfaCode && cognitoUser) {
        cognitoUser.sendMFACode(mfaCode, {
          onSuccess: (_session) => {
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
            
            resolve({ success: true });
          },
          onFailure: (err) => {
            reject({ success: false, message: err.message });
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
        onSuccess: () => {
          setIsAuthenticated(true);
          setMfaPending(false);
          setNewPasswordRequired(false);
          
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
          
          resolve({ success: true });
        },
        onFailure: (err) => {
          console.error("Authentication failed:", err);
          setIsAuthenticated(false);
          setUser(null);
          setMfaPending(false);
          setNewPasswordRequired(false);
          reject(err);
        },
        mfaRequired: (challengeName) => {
          console.log("MFA required:", challengeName);
          // Handle MFA challenge
          setMfaPending(true);
          setNewPasswordRequired(false);
          
          resolve({ success: false, challengeName: 'MFARequired' });
        },
        totpRequired: (challengeName) => {
          console.log("TOTP required:", challengeName);
          // Handle TOTP (Time-based One-Time Password) challenge
          setMfaPending(true);
          setNewPasswordRequired(false);
          
          resolve({ success: false, challengeName: 'TOTPRequired' });
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          console.log("New password required");
          // Handle new password required
          setNewPasswordRequired(true);
          setMfaPending(false);
          
          resolve({ 
            success: false, 
            challengeName: 'NewPasswordRequired',
            userAttributes,
            requiredAttributes
          });
        },
        // Added for completeness, but rarely used in typical setups
        selectMFAType: (challengeName, _challengeParameters) => {
          console.log("Select MFA type:", challengeName);
          resolve({ success: false, challengeName: 'SelectMFAType' });
        }
      });
    });
  };

  // Complete new password challenge
  const completeNewPasswordChallenge = (newPassword: string): Promise<AuthChallengeResponse> => {
    return new Promise((resolve, reject) => {
      if (!cognitoUser) {
        reject({ success: false, message: "No authentication in progress" });
        return;
      }

      cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
        onSuccess: () => {
          setIsAuthenticated(true);
          setNewPasswordRequired(false);
          
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
          
          resolve({ success: true });
        },
        onFailure: (err) => {
          console.error("Failed to complete new password challenge:", err);
          reject({ success: false, message: err.message });
        },
        mfaRequired: (challengeName) => {
          console.log("MFA required after password change:", challengeName);
          setMfaPending(true);
          setNewPasswordRequired(false);
          
          resolve({ success: false, challengeName: 'MFARequired' });
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
      setNewPasswordRequired(false);
    }
  };
  
  // Get JWT token function
  const getAuthToken = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      const currentUser = userPool.getCurrentUser();
      
      if (!currentUser) {
        resolve(null);
        return;
      }
      
      currentUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session) {
          console.error("Error getting session:", err);
          resolve(null);
          return;
        }
        
        // Return the JWT token from the session
        const token = session.getAccessToken().getJwtToken();
        resolve(token);
      });
    });
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      signIn, 
      signOut, 
      loading,
      mfaRequired: mfaPending,
      newPasswordRequired,
      completeNewPasswordChallenge,
      getAuthToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;