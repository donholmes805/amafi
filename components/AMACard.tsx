import React from 'react';
import { AMA, AMAStatus, User, Role } from '../types';
import { formatAMADate } from '../utils/time';
import Button from './Button';
import { ICONS } from '../constants';

interface AMACardProps {
  ama: AMA;
  onSelect: (ama: AMA) => void;
  onSelectUser: (user: User) => void;
  onNavigateToHighlights?: (ama: AMA) => void;
}

const StatusBadge: React.FC<{ status: AMAStatus }> = ({ status }) => {
    const statusStyles = {
        [AMAStatus.LIVE]: 'bg-red-500 text-white animate-pulse',
        [AMAStatus.UPCOMING]: 'bg-blue-500 text-white',
        [AMAStatus.ENDED]: 'bg-gray-600 text-gray-200',
    };
    return (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyles[status]} flex-shrink-0`}>
            {status}
        </span>
    );
};

const AMACard: React.FC<AMACardProps> = ({ ama, onSelect, onSelectUser, onNavigateToHighlights }) => {
  
  const handleHostClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event from firing
    onSelectUser(ama.host);
  };
  
  const handleHighlightsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigateToHighlights?.(ama);
  }

  const hostAvatar = ama.host.avatar_url;

  return (
    <div 
        className="bg-brand-surface rounded-lg overflow-hidden shadow-lg hover:shadow-brand-primary/50 transition-shadow duration-300 cursor-pointer flex flex-col"
        onClick={() => onSelect(ama)}
    >
      <div className="p-5 flex flex-col flex-grow">
        <div className="grid grid-cols-[auto,1fr] items-start gap-x-4 mb-3">
            <img src={hostAvatar} alt={ama.host.name} className="w-12 h-12 rounded-full border-2 border-brand-secondary cursor-pointer hover:border-brand-primary" onClick={handleHostClick} />
            <div className="flex flex-col min-w-0">
                <h3 className="text-xl font-bold text-brand-text-primary">{ama.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={ama.status} />
                    <p className="text-sm text-brand-text-secondary truncate">Hosted by <span className="font-semibold hover:text-brand-primary cursor-pointer" onClick={handleHostClick}>{ama.host.name} {(ama.host.role === Role.ADMIN || ama.host.role === Role.MODERATOR) && ICONS.CROWN}</span></p>
                </div>
            </div>
        </div>
        <p className="text-brand-text-secondary text-sm mb-4 line-clamp-2 flex-grow">{ama.description}</p>
        
        {ama.status === AMAStatus.ENDED && onNavigateToHighlights ? (
           <Button variant="secondary" size="sm" onClick={handleHighlightsClick}>
               {ICONS.LIGHTBULB_YELLOW}
               <span>View AI Highlights</span>
           </Button>
        ) : (
             <div className="flex justify-between items-center text-xs text-brand-text-secondary">
                <span>{ama.status !== AMAStatus.UPCOMING ? `${ama.viewers.toLocaleString()} viewers` : `Starts ${formatAMADate(ama.startTime)}`}</span>
                <span className="font-semibold text-brand-primary">
                    {ama.status === AMAStatus.LIVE ? 'Join Now' : 'View Details'} &rarr;
                </span>
            </div>
        )}
      </div>
    </div>
  );
};

export default AMACard;