
import React, { useState, useRef, useEffect } from 'react';
import { AMA, User, Role } from '../types';
import Button from './Button';
import { ICONS } from '../constants';
import AMACard from './AMACard';
import { compressImage } from '../utils/image';
import api from '../services/api';

interface ProfilePageProps {
  user: User;
  currentUser: User | null;
  amas: AMA[];
  onSelectAMA: (ama: AMA) => void;
  onFollowToggle: (hostId: string) => void;
  onUpdateAvatar: (newAvatarUrl: string) => Promise<void>;
  onUpdateBio: (newBio: string) => Promise<void>;
  onUpdateWalletInfo: (ticker: string, address: string) => Promise<void>;
  onExit: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, currentUser, amas, onSelectAMA, onFollowToggle, onUpdateAvatar, onUpdateBio, onUpdateWalletInfo, onExit }) => {
    const isOwnProfile = user.id === currentUser?.id;
    const isFollowing = currentUser?.following?.includes(user.id);
    const userAMAs = amas.filter(ama => ama.host.id === user.id);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState(user.bio || '');
    const [isSavingBio, setIsSavingBio] = useState(false);
    
    const [walletTicker, setWalletTicker] = useState(user.wallet_ticker || '');
    const [walletAddress, setWalletAddress] = useState(user.wallet_address || '');
    const [isSavingWallet, setIsSavingWallet] = useState(false);

    useEffect(() => {
      if (!isEditingBio) {
        setBioText(user.bio || '');
      }
      setWalletTicker(user.wallet_ticker || '');
      setWalletAddress(user.wallet_address || '');
    }, [user, isEditingBio]);
    
    const uploadAvatar = async (file: File) => {
        if (!file || !currentUser) return;

        setIsUploading(true);
        try {
            const compressedFile = await compressImage(file);
            
            // This now calls our real API service
            const result = await api.uploadAvatarFile(compressedFile);

            if (!result?.publicUrl) {
                throw new Error("Could not get public URL for the avatar from the server.");
            }
            
            await onUpdateAvatar(result.publicUrl);

        } catch (error: any) {
            console.error('Error uploading avatar:', error.message);
            alert(`An unexpected error occurred during upload: ${error.message}`);
        } finally {
            setIsUploading(false);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };
    
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        await uploadAvatar(file);
    };

    const handleSaveBio = async () => {
        setIsSavingBio(true);
        await onUpdateBio(bioText);
        setIsSavingBio(false);
        setIsEditingBio(false);
    };

    const handleCancelEditBio = () => {
        setBioText(user.bio || '');
        setIsEditingBio(false);
    };
    
    const handleSaveWallet = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingWallet(true);
        await onUpdateWalletInfo(walletTicker.toUpperCase(), walletAddress);
        setIsSavingWallet(false);
    };

  return (
    <div className="space-y-8">
       <div>
        <Button onClick={onExit} variant="ghost" className="mb-4">
          {ICONS.ARROW_LEFT}
          <span>Back to Home</span>
        </Button>
      </div>

      <div className="bg-brand-surface rounded-lg shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
        <div className="relative flex-shrink-0">
          <img 
              src={user.avatar_url} 
              alt={user.name} 
              className={`w-32 h-32 rounded-full border-4 border-brand-primary transition-opacity duration-300 object-cover ${isUploading ? 'opacity-40' : 'opacity-100'}`}
          />
          {isOwnProfile && (
            <>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept="image/png, image/jpeg"
                disabled={isUploading}
              />
              <button 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity duration-300 cursor-pointer"
                aria-label="Change profile picture"
                disabled={isUploading}
              >
                  {isUploading ? (
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
              </button>
            </>
          )}
        </div>
        <div className="md:ml-8 mt-4 md:mt-0 flex-grow">
            <div className="flex flex-col md:flex-row justify-between items-start">
                <div className="flex-grow">
                    <h1 className="text-4xl font-bold flex items-center justify-center md:justify-start">{user.name} {(user.role === Role.ADMIN || user.role === Role.MODERATOR) && ICONS.CROWN}</h1>
                    <p className="text-brand-text-secondary text-lg">
                        {user.role}
                        {user.role === Role.HOST && user.tier && ` - ${user.tier}`}
                    </p>
                </div>
                 <div className="flex items-center space-x-2 mt-4 md:mt-0 flex-shrink-0">
                    {!isOwnProfile && currentUser && user.role === Role.HOST && (
                        <Button 
                            variant={isFollowing ? 'secondary' : 'primary'}
                            onClick={() => onFollowToggle(user.id)}
                        >
                           {isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                    )}
                </div>
            </div>
            <div className="mt-4">
              {isOwnProfile && isEditingBio ? (
                <div className="space-y-2">
                  <textarea
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    rows={4}
                    maxLength={500}
                    placeholder="Tell us about yourself..."
                    aria-label="Edit your bio"
                  />
                  <div className="flex space-x-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={handleCancelEditBio}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={handleSaveBio} isLoading={isSavingBio}>Save Bio</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-4">
                  <p className="text-brand-text-secondary max-w-2xl flex-grow min-h-[4rem]">{user.bio || "This user hasn't written a bio yet."}</p>
                  {isOwnProfile && (
                    <Button variant="secondary" size="sm" onClick={() => setIsEditingBio(true)}>Edit Bio</Button>
                  )}
                </div>
              )}
            </div>
        </div>
      </div>
      
       {isOwnProfile && user.role === Role.HOST && (
        <div className="bg-brand-surface rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-brand-primary">Wallet Settings</h2>
            <p className="text-brand-text-secondary mb-4 text-sm">Set your default crypto wallet for receiving tips during your AMAs. This can be overridden on a per-AMA basis.</p>
            <form onSubmit={handleSaveWallet} className="space-y-4 max-w-lg">
                <div>
                    <label htmlFor="walletTicker" className="block text-sm font-medium text-brand-text-secondary mb-1">Crypto Ticker</label>
                    <input 
                        type="text" 
                        id="walletTicker"
                        value={walletTicker}
                        onChange={e => setWalletTicker(e.target.value)}
                        placeholder="e.g., ETH, BTC, SOL"
                        className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
                <div>
                    <label htmlFor="walletAddress" className="block text-sm font-medium text-brand-text-secondary mb-1">Wallet Address</label>
                    <input 
                        type="text" 
                        id="walletAddress"
                        value={walletAddress}
                        onChange={e => setWalletAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
                <div className="text-right">
                    <Button type="submit" variant="primary" isLoading={isSavingWallet}>Save Wallet Info</Button>
                </div>
            </form>
        </div>
      )}

      {user.role === Role.HOST && (
        <div>
            <h2 className="text-3xl font-bold border-l-4 border-brand-primary pl-4 mb-6">{isOwnProfile ? "My AMAs" : `${user.name}'s AMAs`}</h2>
            {userAMAs.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userAMAs.map(ama => <AMACard key={ama.id} ama={ama} onSelect={onSelectAMA} onSelectUser={() => {}} />)}
                </div>
            ) : (
                <p className="text-center text-brand-text-secondary p-4 bg-brand-surface rounded-lg">
                    {isOwnProfile ? "You haven't hosted any AMAs yet." : `${user.name} hasn't hosted any AMAs yet.`}
                </p>
            )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
