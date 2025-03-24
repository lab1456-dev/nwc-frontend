import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Bird, User, Lock, AlertCircle, Key, RefreshCw } from 'lucide-react';

// Define the possible UI states
type AuthUIMode = 'signin' | 'mfa' | 'newPassword';

const SignInPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [uiMode, setUiMode] = useState<AuthUIMode>('signin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { 
    signIn, 
    isAuthenticated, 
    mfaRequired, 
    newPasswordRequired,
    completeNewPasswordChallenge 
  } = useContext(AuthContext);
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
  
  // Update UI mode based on auth challenges
  useEffect(() => {
    if (newPasswordRequired) {
      setUiMode('newPassword');
    } else if (mfaRequired) {
      setUiMode('mfa');
    }
  }, [mfaRequired, newPasswordRequired]);
  
  const handleSignIn = async (e: React.FormEvent) => {
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
      const result = await signIn(username, password, uiMode === 'mfa' ? mfaCode : undefined);
      
      if (!result.success) {
        // Handle different challenge types
        if (result.challengeName === 'NewPasswordRequired') {
          setUiMode('newPassword');
        } else if (result.challengeName === 'MFARequired' || 
                  result.challengeName === 'TOTPRequired') {
          setUiMode('mfa');
        }
      }
      // If successful, useEffect will handle navigation
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err && 'message' in err) {
        setError(err.message as string);
      } else {
        setError('Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords
    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Password complexity validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await completeNewPasswordChallenge(newPassword);
      
      if (!result.success && result.challengeName === 'MFARequired') {
        // If MFA is now required after password change
        setUiMode('mfa');
      }
      // If successful, useEffect will handle navigation
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err && 'message' in err) {
        setError(err.message as string);
      } else {
        setError('Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const renderSignInForm = () => (
    <form onSubmit={handleSignIn}>
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
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
      >
        {loading 
          ? 'Processing...' 
          : 'Sign In'}
      </button>
    </form>
  );
  
  const renderMfaForm = () => (
    <form onSubmit={handleSignIn}>
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
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
      >
        {loading 
          ? 'Verifying...' 
          : 'Verify'}
      </button>
      
      <button
        type="button"
        onClick={() => setUiMode('signin')}
        className="w-full mt-4 bg-transparent border border-cyan-600 text-cyan-400 font-bold py-2 px-4 rounded hover:bg-cyan-900/30 transition-colors"
      >
        Back to Sign In
      </button>
    </form>
  );
  
  const renderNewPasswordForm = () => (
    <form onSubmit={handleNewPassword}>
      <div className="mb-6 p-4 bg-blue-900/30 border border-blue-700/50 rounded">
        <p className="text-blue-200 text-sm">
          <RefreshCw className="inline-block mr-2 h-4 w-4" />
          You need to change your password before continuing.
        </p>
      </div>
      
      <div className="mb-4">
        <label 
          htmlFor="newPassword" 
          className="block text-cyan-200 mb-2 font-medium"
        >
          New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-cyan-500" />
          </div>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-slate-800/70 text-cyan-100 border border-cyan-900/50 rounded px-10 py-2 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
            placeholder="Create a new password"
            required
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.
        </p>
      </div>
      
      <div className="mb-6">
        <label 
          htmlFor="confirmPassword" 
          className="block text-cyan-200 mb-2 font-medium"
        >
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-cyan-500" />
          </div>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-slate-800/70 text-cyan-100 border border-cyan-900/50 rounded px-10 py-2 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
            placeholder="Confirm your new password"
            required
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
      >
        {loading 
          ? 'Setting Password...' 
          : 'Set New Password'}
      </button>
    </form>
  );
  
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
              {uiMode === 'signin' && 'Sign in to your account'}
              {uiMode === 'mfa' && 'Enter MFA Code'}
              {uiMode === 'newPassword' && 'Change Your Password'}
            </h2>
            <p className="text-cyan-300 text-lg">
              {uiMode === 'signin' && 'Enter your credentials to access your account'}
              {uiMode === 'mfa' && 'Please enter the code from your authenticator app'}
              {uiMode === 'newPassword' && 'Create a new password for your account'}
            </p>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Render the appropriate form based on UI mode */}
          {uiMode === 'signin' && renderSignInForm()}
          {uiMode === 'mfa' && renderMfaForm()}
          {uiMode === 'newPassword' && renderNewPasswordForm()}
          
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