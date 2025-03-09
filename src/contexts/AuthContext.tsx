import { createContext } from 'react';
import { AuthContextType } from './AuthTypes';

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  signIn: async () => {
    throw new Error("Auth context not initialized");
  },
  signOut: () => {},
  loading: true,
  mfaRequired: false
});

// Export the context consumer for convenience
export const AuthConsumer = AuthContext.Consumer;