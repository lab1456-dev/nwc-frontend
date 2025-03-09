import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Bird, User, Lock, AlertCircle, Key } from 'lucide-react';

const SignInPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfaInput, setShowMfaInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Keep this variable to easily re-enable sign-up later
  const isSignUp = false;
  
  const { signIn, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path or default to home
  const from = location.state?.from?.pathname || '/';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }
    
    try {
      if (showMfaInput) {
        // If MFA input is showing, we need to provide the MFA code
        if (!mfaCode) {
          setError('Please enter your MFA code');
          setLoading(false);
          return;
        }
        
        await signIn(username, password, mfaCode);
      } else {
        try {
          // First attempt without MFA
          await signIn(username, password);
        } catch (err: unknown) {
          // If the error indicates MFA is required, show MFA input
          if (err instanceof Error && 
             (err.message.includes('MFA') || err.message.includes('multi-factor'))) {
            setShowMfaInput(true);
            setError('');
            setLoading(false);
            return;
          }
          // Otherwise, rethrow the error to be caught by the outer catch
          throw err;
        }
      }
      // Redirect handled by the useEffect above
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to sign in');
      }
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-900">
      <div className="mb-8 flex items-center space-x-2">
        <Bird className="w-12 h-12 text-cyan-400" />
        <span className="text-2xl font-bold text-cyan-100">Night's Watch Crow Management</span>
      </div>
      
      <div className="w-full max-w-xl">
        <div className="feature-card p-8 rounded-lg shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {showMfaInput 
                ? 'Enter MFA Code' 
                : 'Sign in to your account'}
            </h2>
            <p className="text-cyan-300 text-lg">
              {showMfaInput 
                ? 'Please enter the code from your authenticator app'
                : 'Enter your credentials to access your account'}
            </p>
          </div>
          
          {/* Removed sign-up/sign-in tabs - can be re-added later if needed */}
          
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Show different fields based on whether we're in MFA verification mode */}
            {showMfaInput ? (
              <div className="mb-6">
                <label 
                  htmlFor="mfaCode" 
                  className="block text-cyan-200 mb-2 font-medium"
                >
                  MFA Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-cyan-500" />
                  </div>
                  <input
                    id="mfaCode"
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="w-full bg-slate-800/70 text-cyan-100 border border-cyan-900/50 rounded px-10 py-2 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
                    placeholder="Enter 6-digit code"
                    autoComplete="one-time-code"
                    required
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label 
                    htmlFor="username" 
                    className="block text-cyan-200 mb-2 font-medium"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-cyan-500" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-800/70 text-cyan-100 border border-cyan-900/50 rounded px-10 py-2 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label 
                    htmlFor="password" 
                    className="block text-cyan-200 mb-2 font-medium"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-cyan-500" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-800/70 text-cyan-100 border border-cyan-900/50 rounded px-10 py-2 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mb-6">
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm">
                    Forgot your password?
                  </a>
                </div>
              </>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
            >
              {loading 
                ? 'Processing...' 
                : showMfaInput 
                  ? 'Verify'
                  : 'Sign In'}
            </button>
            
            {showMfaInput && (
              <button
                type="button"
                onClick={() => setShowMfaInput(false)}
                className="w-full mt-4 bg-transparent border border-cyan-600 text-cyan-400 font-bold py-2 px-4 rounded hover:bg-cyan-900/30 transition-colors"
              >
                Back to Sign In
              </button>
            )}
          </form>
          
          {/* Placeholder for future notice text */}
          <div className="mt-6 text-center">
            <p className="text-cyan-200/70">
              "I shall take no accounts, hold no memberships, father no sessions."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;