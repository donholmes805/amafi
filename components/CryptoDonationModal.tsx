
import React, { useState } from 'react';
import Button from './Button';
import { ICONS } from '../constants';

interface CryptoDonationModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticker: string;
    address: string;
}

const CryptoDonationModal: React.FC<CryptoDonationModalProps> = ({ isOpen, onClose, ticker, address }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}`;

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="crypto-donation-title"
        >
            <div 
                className="bg-brand-surface rounded-lg shadow-2xl p-6 w-full max-w-sm text-center relative animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 text-brand-text-secondary hover:text-brand-primary"
                    aria-label="Close donation modal"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 id="crypto-donation-title" className="text-2xl font-bold text-brand-primary mb-2">Donate {ticker.toUpperCase()}</h2>
                <p className="text-brand-text-secondary text-sm mb-4">Scan the QR code or copy the address below to send your tip.</p>

                <div className="bg-white p-4 rounded-lg inline-block">
                    <img src={qrCodeUrl} alt={`${ticker} QR Code`} width="200" height="200" />
                </div>
                
                <div className="bg-brand-bg/50 p-3 rounded-lg mt-4 space-y-2">
                    <p className="text-xs text-brand-text-secondary font-semibold">WALLET ADDRESS</p>
                    <code className="text-sm text-brand-text-primary break-all">{address}</code>
                </div>

                <Button onClick={handleCopy} variant="secondary" className="w-full mt-4">
                    {ICONS.COPY}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Address'}</span>
                </Button>
            </div>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default CryptoDonationModal;
