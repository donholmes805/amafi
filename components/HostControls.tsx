
import React from 'react';
import { AMAStatus } from '../types';
import Button from './Button';

interface HostControlsProps {
    status: AMAStatus;
    onStatusChange: (newStatus: AMAStatus) => void;
}

const HostControls: React.FC<HostControlsProps> = ({ status, onStatusChange }) => {
    
    const handleToggleLive = () => {
        if (status === AMAStatus.LIVE) {
            onStatusChange(AMAStatus.ENDED);
        } else if (status === AMAStatus.UPCOMING) {
            onStatusChange(AMAStatus.LIVE);
        }
    }

    const isLive = status === AMAStatus.LIVE;
    
    return (
        <div className="bg-brand-surface p-4 rounded-lg flex items-center justify-between shadow-md">
            <p className="font-semibold">Host Controls</p>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    {isLive && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
                    <span className={`font-bold ${isLive ? 'text-red-500' : 'text-brand-text-secondary'}`}>
                        {status}
                    </span>
                </div>
                <Button 
                    onClick={handleToggleLive}
                    className={`${isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    disabled={status === AMAStatus.ENDED}
                >
                    {isLive ? 'End AMA' : 'Go Live'}
                </Button>
            </div>
        </div>
    );
};

export default HostControls;
