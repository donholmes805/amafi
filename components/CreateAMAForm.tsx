
import React, { useState } from 'react';
import { AMA, User, AMAStatus, AMAType, Role } from '../types';
import Button from './Button';
import { ICONS } from '../constants';
import { suggestQuestions } from '../services/geminiService';

interface CreateAMAFormProps {
  host: User;
  onCreate: (newAMA: Omit<AMA, 'id' | 'viewers' | 'startTime' | 'youtubeUrls'>) => void;
}

const CreateAMAForm: React.FC<CreateAMAFormProps> = ({ host, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrls, setYoutubeUrls] = useState(['']);
  const [amaType, setAmaType] = useState<AMAType>(AMAType.VIDEO);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [walletTicker, setWalletTicker] = useState(host.wallet_ticker || '');
  const [walletAddress, setWalletAddress] = useState(host.wallet_address || '');

  const isPremiumHost = host.tier === 'PREMIUM' || host.role === Role.ADMIN || host.role === Role.MODERATOR;

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

  const handleSuggestQuestions = async () => {
    if (!title || !description) {
        alert("Please enter a title and description first.");
        return;
    }
    setIsLoadingSuggestions(true);
    setSuggestedQuestions([]);
    const questions = await suggestQuestions(title, description);
    setSuggestedQuestions(questions);
    setIsLoadingSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validUrls = youtubeUrls.filter(url => url.trim() !== '');
    if (!title || !description || (amaType === AMAType.VIDEO && validUrls.length === 0) || !startDate || !startTime) {
      alert("Please fill out all required fields.");
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);

    const getTimeLimit = () => {
        if (host.role === Role.ADMIN || host.role === Role.MODERATOR) {
            return 9999; // Effectively unlimited duration for staff
        }
        if (host.tier === 'PREMIUM') {
            return 120; // 2 hours for Premium hosts
        }
        return 30; // 30 minutes for Free hosts
    };

    const newAMA = {
      title,
      description,
      host,
      youtube_url: amaType === AMAType.VIDEO ? validUrls.join(',') : '',
      status: AMAStatus.UPCOMING,
      start_time: startDateTime.toISOString(),
      time_limit_minutes: getTimeLimit(),
      ama_type: amaType,
      wallet_ticker: walletTicker,
      wallet_address: walletAddress,
    };

    onCreate(newAMA as any); // Create AMA
    setTitle('');
    setDescription('');
    setYoutubeUrls(['']);
    setStartDate('');
    setStartTime('');
    setSuggestedQuestions([]);
    // Do not clear wallet info, as it's likely to be reused
  };
  
  const TypeButton: React.FC<{ type: AMAType, label: string, icon: React.ReactNode }> = ({ type, label, icon }) => (
      <button
        type="button"
        onClick={() => setAmaType(type)}
        className={`flex-1 p-3 rounded-md transition-all duration-200 flex items-center justify-center space-x-2 text-sm font-semibold ${amaType === type ? 'bg-brand-primary text-white shadow-lg' : 'bg-brand-bg hover:bg-brand-bg/50'}`}
      >
        {icon}
        <span>{label}</span>
      </button>
  );

  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-brand-primary">Create New AMA Session</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-text-secondary mb-1">Session Type</label>
          <div className="flex space-x-2 bg-brand-surface p-1 rounded-lg border border-brand-secondary">
              <TypeButton type={AMAType.VIDEO} label="Video AMA" icon={ICONS.VIDEO} />
              <TypeButton type={AMAType.AUDIO} label="Audio AMA" icon={ICONS.MIC} />
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-brand-text-secondary mb-1">Title</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-brand-text-secondary mb-1">Description</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" required></textarea>
        </div>

        {amaType === AMAType.VIDEO && (
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
                      required={index === 0}
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
          <p className="text-xs text-brand-text-secondary mt-1">Please enter in your local timezone. It will be displayed in PST for all users.</p>
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
        
        <div className="pt-4 space-y-4">
            <Button type="button" variant="secondary" onClick={handleSuggestQuestions} isLoading={isLoadingSuggestions} disabled={!title || !description}>
                {ICONS.SPARKLES}
                <span>Suggest Questions with AI</span>
            </Button>
            {suggestedQuestions.length > 0 && (
                <div className="bg-brand-bg p-4 rounded-md border border-brand-secondary/50">
                    <h4 className="font-semibold text-brand-text-primary mb-2">Suggested Questions:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-brand-text-secondary">
                        {suggestedQuestions.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                </div>
            )}
        </div>

        <div className="pt-4">
          <Button type="submit" variant="primary" className="w-full">
            Create AMA
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAMAForm;
