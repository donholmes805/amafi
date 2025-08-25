import React from 'react';
import { AMA, AMAStatus, User, Role } from '../types';
import Button from './Button';
import { ICONS } from '../constants';

interface FeaturedAMACardProps {
  ama: AMA;
  onSelect: (ama: AMA) => void;
  onSelectUser: (user: User) => void;
}

const FeaturedStatusBadge: React.FC<{ ama: AMA }> = ({ ama }) => {
    const statusInfo = {
        [AMAStatus.LIVE]: { text: 'LIVE NOW', icon: ICONS.LIVE_DOT, color: 'bg-red-500' },
        [AMAStatus.UPCOMING]: { text: `UPCOMING`, icon: null, color: 'bg-blue-500' },
        [AMAStatus.ENDED]: { text: 'ENDED', icon: null, color: 'bg-gray-600' },
    };
    
    const currentStatus = statusInfo[ama.status];
    if (!currentStatus) return null;

    return (
        <div className={`self-start text-xs font-bold px-3 py-1.5 rounded-full text-white ${currentStatus.color} flex items-center space-x-1.5 z-10`}>
            {currentStatus.icon}
            <span>{currentStatus.text}</span>
        </div>
    );
};


const FeaturedAMACard: React.FC<FeaturedAMACardProps> = ({ ama, onSelect, onSelectUser }) => {
  const handleHostClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectUser(ama.host);
  };
  
  const hostAvatar = ama.host.avatar_url;

  return (
    <div 
        className="relative w-80 h-96 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl group cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
        onClick={() => onSelect(ama)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary opacity-80"></div>
      
      <div className="relative z-20 h-full flex flex-col p-6 text-white">
          <FeaturedStatusBadge ama={ama} />

          <div className="mt-4">
            <div className="flex items-center space-x-3 mb-3 cursor-pointer" onClick={handleHostClick}>
                <img src={hostAvatar} alt={ama.host.name} className="w-10 h-10 rounded-full border-2 border-white/50" />
                <span className="text-sm font-semibold hover:underline inline-flex items-center">{ama.host.name} {(ama.host.role === Role.ADMIN || ama.host.role === Role.MODERATOR) && ICONS.CROWN}</span>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 leading-tight">{ama.title}</h3>
          </div>
          
          <Button variant="primary" className="w-full justify-center mt-auto opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300">
              {ama.status === AMAStatus.LIVE ? 'Join Now' : 'View Details'}
          </Button>
      </div>
    </div>
  );
};

export default FeaturedAMACard;
