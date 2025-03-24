// Define a type for the user object based on typical Cognito attributes
export interface CognitoUserAttributes {
  email?: string;
  email_verified?: string;
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  [key: string]: string | undefined; // Allow for other custom attributes
}

// Define response interface for auth challenge
export interface AuthChallengeResponse {
  success: boolean;
  challengeName?: string;
  message?: string;
  userAttributes?: any;
  requiredAttributes?: any;
}

// Define a session type for Cognito
export interface CognitoSessionData {
  idToken: { jwtToken: string };
  accessToken: { jwtToken: string };
  refreshToken?: { token: string };
  clockDrift?: number;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: CognitoUserAttributes | null;
  signIn: (username: string, password: string, mfaCode?: string) => Promise<AuthChallengeResponse>;
  signOut: () => void;
  loading: boolean;
  mfaRequired: boolean;
  newPasswordRequired: boolean;
  completeNewPasswordChallenge: (newPassword: string) => Promise<AuthChallengeResponse>;
  getAuthToken: () => Promise<string | null>;
}