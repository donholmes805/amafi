
import React, { useState } from 'react';
import Button from './Button';
import api from '../services/api';

interface UpdatePasswordPageProps {
  onUpdateSuccess: () => void;
}

const UpdatePasswordPage: React.FC<UpdatePasswordPageProps> = ({ onUpdateSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const success = await api.updateUserPassword(password);

    setLoading(false);
    if (success) {
        setMessage("Your password has been updated successfully!");
        setTimeout(() => {
            onUpdateSuccess();
        }, 2000);
    } else {
        setError("Failed to update password. You may need to log in again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-brand-surface p-8 rounded-lg shadow-lg mt-10">
      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Update Your Password</h2>
        <p className="text-center text-sm text-brand-text-secondary">Please enter a new password for your account.</p>
        
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-brand-text-secondary mb-1">New Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" 
            required 
            aria-label="New Password"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword"className="block text-sm font-medium text-brand-text-secondary mb-1">Confirm New Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" 
            required
            aria-label="Confirm New Password"
          />
        </div>
        
        <Button type="submit" isLoading={loading} className="w-full" size="lg" disabled={!!message}>Update Password</Button>
      </form>
      
      {error && <p className="text-red-500 text-sm mt-4 text-center" role="alert">{error}</p>}
      {message && <p className="text-green-500 text-sm mt-4 text-center" role="status">{message}</p>}
    </div>
  );
};

export default UpdatePasswordPage;
