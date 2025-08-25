import React from 'react';
import { User } from '../types';
import StreamParticipant from './StreamParticipant';
import { useActiveSpeaker } from '../hooks/useActiveSpeaker';

interface MultiStreamViewProps {
  host: User;
  coHosts?: User[];
  localStream: MediaStream | null;
  currentUser: User | null;
}

// Wrapper component to correctly use the hook for each participant
const Participant: React.FC<{ user: User, stream: MediaStream | null, isHost: boolean, isLocal: boolean }> = ({ user, stream, isHost, isLocal }) => {
    const isSpeaking = useActiveSpeaker(stream);

    return (
        <StreamParticipant
            user={user}
            stream={stream}
            isHost={isHost}
            isLocal={isLocal}
            type="video"
            isSpeaking={isSpeaking}
        />
    );
};

const MultiStreamView: React.FC<MultiStreamViewProps> = ({ host, coHosts = [], localStream, currentUser }) => {
    const participants = [host, ...coHosts.slice(0, 3)];

    return (
        <div className="w-full bg-brand-bg rounded-lg p-2 shadow-lg">
            <div className="grid grid-cols-2 gap-2">
                {participants.map((user, index) => {
                     const isLocal = user.id === currentUser?.id;
                     const stream = isLocal ? localStream : null; // Placeholder for remote stream
                     return (
                        <Participant
                            key={user.id}
                            user={user}
                            stream={stream}
                            isHost={index === 0}
                            isLocal={isLocal}
                        />
                     )
                })}
                 {/* Fill empty spots */}
                {Array.from({ length: 4 - participants.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-video bg-brand-surface rounded-lg flex items-center justify-center text-brand-text-secondary">
                        Empty Slot
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultiStreamView;