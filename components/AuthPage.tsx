
import React, { useState, useRef } from 'react';
import { Role, User, UserTier } from '../types';
import Button from './Button';
import api from '../services/api';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
  initialRole?: Role;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, initialRole = Role.VIEWER }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>(initialRole === Role.HOST ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<Role>(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const switchMode = (newMode: 'login' | 'signup' | 'reset') => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError(null);
    setMessage(null);
    setAuthMode(newMode);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const user = await api.login(email, password);
    
    if (user) {
        onAuthSuccess(user);
    } else {
        setError("Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const user = await api.signup(username, email, password, role);

    if (user) {
      setMessage("Success! Your account has been created.");
      setTimeout(() => onAuthSuccess(user), 1500);
    } else {
      setError("An error occurred during sign up. The email may already be in use.");
    }

    setLoading(false);
  };

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const success = await api.requestPasswordReset(email);
    if (success) {
        setMessage("If an account exists for this email, a password reset link has been sent.");
    } else {
        setError("Could not send reset link. Please try again later.");
    }
    setLoading(false);
  };


  const commonFormFields = (
    <>
       <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-text-secondary mb-1">Email</label>
        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
      </div>
      <div>
        <label htmlFor="password"className="block text-sm font-medium text-brand-text-secondary mb-1">Password</label>
        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
      </div>
    </>
  );

  return (
    <div className="max-w-md mx-auto bg-brand-surface p-8 rounded-lg shadow-lg">
      {authMode !== 'reset' && (
        <div className="flex border-b border-brand-secondary mb-6">
            <button onClick={() => switchMode('login')} className={`flex-1 py-2 font-semibold transition-colors ${authMode === 'login' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-secondary'}`}>Login</button>
            <button onClick={() => switchMode('signup')} className={`flex-1 py-2 font-semibold transition-colors ${authMode === 'signup' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-secondary'}`}>Sign Up</button>
        </div>
      )}

      {authMode === 'signup' && (
        <form onSubmit={handleSignUp} className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Create your Account</h2>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-brand-text-secondary mb-1">Username</label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
          </div>
          {commonFormFields}
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-1">Account Type</label>
            <div className="flex space-x-2 bg-brand-bg p-1 rounded-lg border border-brand-secondary">
                <button
                  type="button"
                  onClick={() => setRole(Role.VIEWER)}
                  className={`flex-1 py-2 rounded-md transition-all duration-200 text-sm font-semibold ${role === Role.VIEWER ? 'bg-brand-primary text-white shadow-md' : 'hover:bg-brand-surface'}`}
                >
                  Supporter
                </button>
                <button
                  type="button"
                  onClick={() => setRole(Role.HOST)}
                  className={`flex-1 py-2 rounded-md transition-all duration-200 text-sm font-semibold ${role === Role.HOST ? 'bg-brand-primary text-white shadow-md' : 'hover:bg-brand-surface'}`}
                >
                  Host
                </button>
            </div>
          </div>
          <Button type="submit" isLoading={loading} className="w-full" size="lg">Sign Up</Button>
        </form>
      )}
      
      {authMode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
            {commonFormFields}
            <div className="text-right">
              <button
                type="button"
                onClick={() => switchMode('reset')}
                className="text-sm text-brand-text-secondary hover:text-brand-primary transition-colors"
                aria-label="Forgot password?"
              >
                Forgot Password?
              </button>
            </div>
            <Button type="submit" isLoading={loading} className="w-full" size="lg">Login</Button>
        </form>
      )}

      {authMode === 'reset' && (
        <form onSubmit={handlePasswordResetRequest} className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Reset Password</h2>
          <p className="text-center text-sm text-brand-text-secondary">Enter your email and we'll send a link to get back into your account.</p>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-text-secondary mb-1">Email</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
          </div>
          <Button type="submit" isLoading={loading} className="w-full" size="lg">Send Reset Link</Button>
          <div className="text-center">
            <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-sm text-brand-text-secondary hover:text-brand-primary transition-colors"
                aria-label="Back to login"
            >
                &larr; Back to Login
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      {message && <p className="text-green-500 text-sm mt-4 text-center">{message}</p>}
    </div>
  );
};

export default AuthPage;
