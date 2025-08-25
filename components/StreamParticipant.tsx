import React, { useEffect, useRef } from 'react';
import { User, Role } from '../types';
import { ICONS } from '../constants';

interface StreamParticipantProps {
  user: User;
  stream: MediaStream | null;
  isMuted?: boolean;
  isLocal?: boolean;
  isHost?: boolean;
  type: 'video' | 'audio';
  isSpeaking?: boolean;
}

const StreamParticipant: React.FC<StreamParticipantProps> = ({ user, stream, isMuted = false, isLocal = false, isHost = false, type, isSpeaking = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (type === 'audio') {
    return (
      <div className="relative flex flex-col items-center justify-center space-y-3">
        <div className="relative">
            <img 
                src={user.avatar_url} 
                alt={user.name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-brand-secondary" 
            />
            {isSpeaking && <div className="absolute inset-0 rounded-full border-4 border-brand-primary animate-pulse"></div>}
        </div>
        <div className="text-center">
            <p className="font-bold text-brand-text-primary flex items-center justify-center">{user.name} {(user.role === Role.ADMIN || user.role === Role.MODERATOR) && ICONS.CROWN}</p>
            {isHost && <p className="text-xs text-brand-primary font-semibold">HOST</p>}
        </div>
        {isMuted && (
             <div className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>
        )}
      </div>
    );
  }

  // Video type
  return (
    <div className={`relative aspect-video bg-black rounded-lg overflow-hidden border-2 text-white ${isSpeaking ? 'border-brand-primary ring-4 ring-brand-primary/50' : 'border-brand-surface'} transition-all duration-300`}>
      <video ref={videoRef} autoPlay playsInline muted={isLocal} className="w-full h-full object-cover"></video>
      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded-md text-sm font-semibold flex items-center space-x-2">
          {isHost && <span className="text-brand-primary font-bold">HOST</span>}
          <span className="flex items-center">{user.name} {(user.role === Role.ADMIN || user.role === Role.MODERATOR) && ICONS.CROWN}</span>
      </div>
      {(isMuted || !stream) && (
         <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex flex-col items-center justify-center">
             <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-full opacity-50 mb-2" />
             <p className="text-sm text-brand-text-secondary">{!stream ? "Connecting..." : "Camera Off"}</p>
         </div>
      )}
    </div>
  );
};

export default StreamParticipant;