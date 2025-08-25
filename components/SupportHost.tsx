
import React, { useState } from 'react';
import Button from './Button';
import { ICONS } from '../constants';
import PayPalButton from './PayPalButton';
import CryptoDonationModal from './CryptoDonationModal';

interface SupportHostProps {
    walletAddress?: string;
    walletTicker?: string;
    likes: number;
    dislikes: number;
    onLike: () => void;
    onDislike: () => void;
}

const SupportHost: React.FC<SupportHostProps> = ({ walletAddress, walletTicker, likes, dislikes, onLike, onDislike }) => {
    const [supportAmount, setSupportAmount] = useState('5.00');
    const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);

    const isAmountValid = () => {
        const num = parseFloat(supportAmount);
        return !isNaN(num) && num > 0;
    }

    return (
        <>
            <div className="mt-6 pt-6 border-t border-brand-secondary/30 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    {/* PayPal Donation */}
                    <div className="flex items-center space-x-2">
                        <input 
                            type="number"
                            value={supportAmount}
                            onChange={(e) => setSupportAmount(e.target.value)}
                            className="w-24 bg-brand-bg border border-brand-secondary rounded-md p-2 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            min="1"
                            step="1"
                            aria-label="Donation amount in USD"
                        />
                        <PayPalButton 
                            type="one-time"
                            amount={supportAmount}
                            description="Support for the host"
                            onSuccess={() => alert(`Thank you for your $${supportAmount} support!`)}
                            disabled={!isAmountValid()}
                        />
                    </div>
                    {/* Crypto Donation */}
                    {walletAddress && walletTicker && (
                         <div className="flex items-center space-x-2 text-sm text-brand-text-secondary">
                            <span>or</span>
                            <Button variant="ghost" onClick={() => setIsCryptoModalOpen(true)}>
                                Donate Crypto
                            </Button>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button variant="secondary" size="sm" onClick={onLike} className="!px-3 !py-2 flex items-center space-x-2">
                        {ICONS.THUMBS_UP}
                        <span>{likes}</span>
                    </Button>
                    <Button variant="secondary" size="sm" onClick={onDislike} className="!px-3 !py-2 flex items-center space-x-2">
                        {ICONS.THUMBS_DOWN}
                        <span>{dislikes}</span>
                    </Button>
                </div>
            </div>

            {walletAddress && walletTicker && (
                <CryptoDonationModal 
                    isOpen={isCryptoModalOpen}
                    onClose={() => setIsCryptoModalOpen(false)}
                    ticker={walletTicker}
                    address={walletAddress}
                />
            )}
        </>
    );
};

export default SupportHost;
