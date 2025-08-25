
import React, { useState, useEffect } from 'react';
import { AMA, AMAStatus, AMAType, Role } from '../types';
import Button from './Button';
import { ICONS } from '../constants';

interface ManageAMAPageProps {
  ama: AMA;
  onUpdateAMA: (updatedData: Partial<AMA>) => Promise<void>;
  onDeleteAMA: (amaId: number) => Promise<void>;
  onExit: () => void;
}

const ManageAMAPage: React.FC<ManageAMAPageProps> = ({ ama, onUpdateAMA, onDeleteAMA, onExit }) => {
  const [title, setTitle] = useState(ama.title);
  const [description, setDescription] = useState(ama.description);
  const [youtubeUrls, setYoutubeUrls] = useState(ama.youtubeUrls.length > 0 ? ama.youtubeUrls : ['']);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [status, setStatus] = useState<AMAStatus>(ama.status);
  const [walletTicker, setWalletTicker] = useState(ama.wallet_ticker || ama.walletTicker || '');
  const [walletAddress, setWalletAddress] = useState(ama.wallet_address || ama.walletAddress || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isPremiumHost = ama.host.tier === 'PREMIUM' || ama.host.role === Role.ADMIN || ama.host.role === Role.MODERATOR;

  useEffect(() => {
    const d = new Date(ama.startTime);
    // Format to YYYY-MM-DD
    const datePart = d.toISOString().split('T')[0];
    // Format to HH:mm
    const timePart = d.toTimeString().split(' ')[0].substring(0, 5);
    setStartDate(datePart);
    setStartTime(timePart);
  }, [ama.startTime]);
  
  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...youtubeUrls];
    newUrls[index] = value;
    setYoutubeUrls(newUrls);
  };

  const addUrlInput = () => {
    if (youtubeUrls.length < 4) {
      setYoutubeUrls([...youtubeUrls, '']);
    }
  };

  const removeUrlInput = (index: number) => {
    if (youtubeUrls.length > 1) {
        const newUrls = youtubeUrls.filter((_, i) => i !== index);
        setYoutubeUrls(newUrls);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const start_time = new Date(`${startDate}T${startTime}`).toISOString();
    const validUrls = youtubeUrls.filter(url => url.trim() !== '');

    const updatedData: Partial<AMA> = {
        id: ama.id,
        title,
        description,
        youtube_url: validUrls.join(','),
        start_time,
        status,
        wallet_ticker: walletTicker,
        wallet_address: walletAddress,
    };
    
    await onUpdateAMA(updatedData);
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete the AMA "${ama.title}"? This action cannot be undone.`)) {
        setIsDeleting(true);
        await onDeleteAMA(ama.id);
        // isDeleting will remain true as the component unmounts on success.
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <div>
        <Button onClick={onExit} variant="ghost">
          {ICONS.ARROW_LEFT}
          <span>Back to Dashboard</span>
        </Button>
      </div>
      <div className="bg-brand-surface p-6 rounded-lg shadow-lg w-full mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-brand-primary">Manage AMA: {ama.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-brand-text-secondary mb-1">Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-brand-text-secondary mb-1">Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" required></textarea>
          </div>
          
          {ama.ama_type === AMAType.VIDEO && (
             <div>
                <label className="block text-sm font-medium text-brand-text-secondary mb-1">
                  YouTube Video/Stream URL(s)
                  {isPremiumHost && <span className="text-xs"> (up to 4 for Premium)</span>}
                </label>
                <div className="space-y-2">
                  {youtubeUrls.map((url, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={url}
                        onChange={e => handleUrlChange(index, e.target.value)}
                        className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        placeholder={`https://youtube.com/watch?v=`}
                        required={index === 0 && youtubeUrls.filter(u => u.trim()).length > 0}
                      />
                      {isPremiumHost && youtubeUrls.length > 1 && (
                        <button type="button" onClick={() => removeUrlInput(index)} className="p-2 text-red-500 hover:text-red-400">&times;</button>
                      )}
                    </div>
                  ))}
                  {isPremiumHost && youtubeUrls.length < 4 && (
                    <Button type="button" variant="ghost" size="sm" onClick={addUrlInput}>+ Add another URL</Button>
                  )}
                </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-1">Start Date & Time</label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-brand-text-secondary mb-1">Status</label>
            <select id="status" value={status} onChange={e => setStatus(e.target.value as AMAStatus)} className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary">
                <option value={AMAStatus.UPCOMING}>Upcoming</option>
                <option value={AMAStatus.LIVE}>Live</option>
                <option value={AMAStatus.ENDED}>Ended</option>
            </select>
          </div>
          
           <div className="border-t border-brand-secondary/50 pt-4">
                <label className="block text-sm font-medium text-brand-text-secondary mb-2">Crypto Wallet (Optional)</label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                     <input 
                        type="text" 
                        value={walletTicker}
                        onChange={e => setWalletTicker(e.target.value)}
                        placeholder="Ticker (e.g., ETH)"
                        className="w-full sm:w-1/3 bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                     <input 
                        type="text" 
                        value={walletAddress}
                        onChange={e => setWalletAddress(e.target.value)}
                        placeholder="Wallet Address (0x...)"
                        className="w-full sm:w-2/3 bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
            </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto bg-red-600/80 hover:bg-red-600 text-white"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete AMA
            </Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto" isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageAMAPage;
