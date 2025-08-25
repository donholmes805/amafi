
import React, { useState, useEffect } from 'react';
import { AMA, User, AMAStatus, AMAType, Role, Message } from '../types';
import YoutubeEmbed from './YoutubeEmbed';
import Chat from './Chat';
import HostControls from './HostControls';
import Button from './Button';
import { ICONS } from '../constants';
import MultiStreamView from './MultiStreamView';
import SupportHost from './SupportHost';
import AudioRoom from './AudioRoom';
import ModeratorAssistPanel from './ModeratorAssistPanel';
import MultiYoutubeView from './MultiYoutubeView';
import api from '../services/api';
import { processAMA } from '../utils/data';

interface AMARoomProps {
  ama: AMA;
  currentUser: User | null;
  onExit: () => void;
  onSelectUser: (user: User) => void;
  onPromptLogin: () => void;
  onNavigateToHighlights: (ama: AMA) => void;
  onAmaInteraction: (amaId: number, type: 'like' | 'dislike') => void;
}

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const Timer: React.FC<{ ama: AMA }> = ({ ama }) => {
    const timeLimit = ama.timeLimitMinutes || ama.time_limit_minutes;
    const [timeLeft, setTimeLeft] = useState(timeLimit * 60);

    useEffect(() => {
        if (ama.status !== AMAStatus.LIVE) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    // Here you might trigger an auto-end event
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [ama.status]);

    if (ama.status !== AMAStatus.LIVE) return null;

    return (
        <div className="absolute top-4 right-4 bg-black/50 text-white text-sm font-mono px-3 py-1.5 rounded-lg z-10">
            TIME LEFT: {formatTime(timeLeft)}
        </div>
    );
};

const AMARoom: React.FC<AMARoomProps> = ({ ama, currentUser, onExit, onSelectUser, onPromptLogin, onNavigateToHighlights, onAmaInteraction }) => {
    const [currentAMA, setCurrentAMA] = useState(ama);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingChat, setLoadingChat] = useState(true);

    useEffect(() => {
        setCurrentAMA(ama);
    }, [ama]);
    
    useEffect(() => {
        const fetchMessages = async () => {
          setLoadingChat(true);
          const data = await api.fetchMessages(currentAMA.id);
          setMessages(data || []);
          setLoadingChat(false);
        };
    
        fetchMessages();

        // TODO: With a Vercel backend, real-time chat updates would be implemented
        // using a service like Pusher, Ably, or a custom WebSocket server.
        // A polling mechanism could be a simpler alternative for now.
        
    }, [currentAMA.id]);


    const handleNewMessage = (message: Message) => {
        setMessages(existing => [...existing, message]);
    };

    const isHost = currentUser?.id === currentAMA.host.id;
    const isModerator = currentUser?.role === Role.ADMIN || currentUser?.role === Role.MODERATOR;
    const isPremium = currentAMA.host.tier === 'PREMIUM' || currentAMA.host.role === Role.ADMIN || currentAMA.host.role === Role.MODERATOR;
    const coHosts = currentAMA.coHosts ?? [];
    const isCoHost = coHosts.some(c => c.id === currentUser?.id);
    const canStream = isHost || (isPremium && isCoHost);
    const amaType = currentAMA.amaType || currentAMA.ama_type || AMAType.VIDEO;

     useEffect(() => {
        // Only get local media for Audio AMAs, as Video AMAs now use YouTube embeds.
        const shouldStream = canStream && amaType === AMAType.AUDIO;

        if (shouldStream) {
            const getMedia = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: false, // Always false for audio room
                        audio: true,
                    });
                    setLocalStream(stream);
                } catch (err: any) {
                    console.error("Error accessing media devices.", err.message);
                    alert("Could not access microphone. Please check permissions and try again.");
                }
            };
            getMedia();
        }

        return () => {
            localStream?.getTracks().forEach(track => track.stop());
        };
    }, [canStream, amaType]);

    const handleStatusChange = async (newStatus: AMAStatus) => {
        const updatedAMA = await api.updateAma(currentAMA.id, { status: newStatus });
        if (updatedAMA) {
            setCurrentAMA(processAMA(updatedAMA));
        } else {
             alert("Could not update AMA status.");
        }
    };
    
    const handleLike = () => onAmaInteraction(currentAMA.id, 'like');
    const handleDislike = () => onAmaInteraction(currentAMA.id, 'dislike');

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setIsMuted(!isMuted);
        }
    };
    
    const toggleCamera = () => {
        if (localStream && amaType === AMAType.VIDEO) {
            localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setIsCameraOff(!isCameraOff);
        }
    };

    const hostAvatar = currentAMA.host.avatar_url;
    const walletAddress = currentAMA.walletAddress || currentAMA.wallet_address;
    const walletTicker = currentAMA.walletTicker || currentAMA.wallet_ticker;

    const renderMediaContent = () => {
        if (amaType === AMAType.AUDIO) {
            return <AudioRoom host={currentAMA.host} coHosts={coHosts} isPremium={isPremium} localStream={localStream} currentUser={currentUser} />;
        }
    
        // Video AMA Logic
        const youtubeUrls = currentAMA.youtubeUrls || [];

        if (isPremium && youtubeUrls.length > 1) {
            return <MultiYoutubeView urls={youtubeUrls} />;
        }
        
        const singleUrl = youtubeUrls[0] || '';

        if (!singleUrl) {
            return (
                <div className="aspect-video w-full bg-black flex items-center justify-center text-brand-text-secondary rounded-lg">
                    Video stream is not available for this AMA.
                </div>
            );
        }
        
        return <YoutubeEmbed url={singleUrl} />;
    };

  const showModPanel = isModerator || isHost;

  return (
    <div className="space-y-6">
      <div>
        <Button onClick={onExit} variant="ghost" className="mb-4">
          {ICONS.ARROW_LEFT}
          <span>Back to all AMAs</span>
        </Button>
      </div>
      <div className={`grid grid-cols-1 ${showModPanel ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} lg:gap-6 lg:h-[75vh]`}>
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
             <Timer ama={currentAMA} />
             {renderMediaContent()}
          </div>
           {canStream && localStream && (
              <div className="bg-brand-surface p-3 rounded-lg flex items-center justify-center space-x-4">
                  <p className="text-sm font-semibold text-brand-text-secondary">Stream Controls:</p>
                  <Button onClick={toggleMute} variant={isMuted ? 'primary' : 'secondary'} size="sm" aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}>{isMuted ? 'Unmute' : 'Mute'}</Button>
                  {amaType === AMAType.VIDEO && <Button onClick={toggleCamera} variant={isCameraOff ? 'primary' : 'secondary'} size="sm" aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}>{isCameraOff ? 'Camera On' : 'Camera Off'}</Button>}
              </div>
          )}
          <div className="bg-brand-surface p-4 rounded-lg">
            <h1 className="text-3xl font-bold text-brand-text-primary">{currentAMA.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
                <img src={hostAvatar} alt={currentAMA.host.name} className="w-12 h-12 rounded-full border-2 border-brand-secondary cursor-pointer hover:border-brand-primary" onClick={() => onSelectUser(currentAMA.host)}/>
                <div>
                    <p className="font-semibold text-brand-text-primary">Hosted by <span className="hover:text-brand-primary cursor-pointer inline-flex items-center" onClick={() => onSelectUser(currentAMA.host)}>{currentAMA.host.name}{(currentAMA.host.role === Role.ADMIN || currentAMA.host.role === Role.MODERATOR) && ICONS.CROWN}</span></p>
                    <p className="text-sm text-brand-text-secondary">{currentAMA.viewers.toLocaleString()} viewers</p>
                </div>
            </div>
            <p className="text-brand-text-secondary mt-4 text-sm">{currentAMA.description}</p>
            {currentAMA.status === AMAStatus.ENDED ? (
                <div className="mt-6 pt-6 border-t border-brand-secondary/30">
                    <Button variant="primary" className="w-full" onClick={() => onNavigateToHighlights(currentAMA)}>
                        {ICONS.LIGHTBULB_YELLOW}
                        <span>View AI Highlights</span>
                    </Button>
                </div>
            ) : (
                <SupportHost 
                    walletAddress={walletAddress}
                    walletTicker={walletTicker}
                    likes={currentAMA.likes ?? 0}
                    dislikes={currentAMA.dislikes ?? 0}
                    onLike={handleLike}
                    onDislike={handleDislike}
                />
            )}
          </div>
          {isHost && <HostControls status={currentAMA.status} onStatusChange={handleStatusChange} />}
        </div>
        <div className={`${showModPanel ? 'lg:col-span-1' : ''} mt-6 lg:mt-0`}>
          <Chat amaId={currentAMA.id} amaStatus={currentAMA.status} currentUser={currentUser} messages={messages} loading={loadingChat} onPromptLogin={onPromptLogin} onNewMessage={handleNewMessage} />
        </div>
        {showModPanel && (
            <div className="lg:col-span-1 mt-6 lg:mt-0">
                <ModeratorAssistPanel messages={messages} />
            </div>
        )}
      </div>
    </div>
  );
};

export default AMARoom;