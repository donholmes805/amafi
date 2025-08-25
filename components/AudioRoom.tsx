import React from 'react';
import { User } from '../types';
import StreamParticipant from './StreamParticipant';
import { useActiveSpeaker } from '../hooks/useActiveSpeaker';

interface AudioRoomProps {
  host: User;
  coHosts?: User[];
  isPremium: boolean;
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
            type="audio"
            isSpeaking={isSpeaking}
        />
    );
};

const AudioRoom: React.FC<AudioRoomProps> = ({ host, coHosts = [], isPremium, localStream, currentUser }) => {
    const participants = isPremium ? [host, ...coHosts.slice(0, 3)] : [host];
    const isCurrentUserParticipant = participants.some(p => p.id === currentUser?.id);

    return (
        <div className="aspect-video w-full bg-brand-bg rounded-lg shadow-lg flex flex-col items-center justify-center p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
                {participants.map((user, index) => {
                    const isLocal = user.id === currentUser?.id;
                    const stream = isLocal ? localStream : null; // In a real app, this would be a remote stream
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
            </div>
            {!isCurrentUserParticipant && !localStream && (
                 <p className="text-xs text-brand-text-secondary mt-6">
                    You are listening in.
                </p>
            )}
            {participants.length === 1 && !isPremium && (
                <p className="text-xs text-brand-text-secondary mt-6">
                    Premium hosts can add up to 3 co-hosts.
                </p>
            )}
        </div>
    );
};

export default AudioRoom;