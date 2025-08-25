import React from 'react';
import { AMA, User, Role } from '../types';
import CreateAMAForm from './CreateAMAForm';
import Button from './Button';
import { ICONS } from '../constants';
import PayPalButton from './PayPalButton';
import { formatAMADate } from '../utils/time';

interface HostDashboardProps {
  host: User;
  amas: AMA[];
  onCreateAMA: (newAMA: Omit<AMA, 'id' | 'viewers' | 'startTime'>) => void;
  onUpgradeToPremium: () => void;
  onExit: () => void;
  onManageAMA: (ama: AMA) => void;
}

const UpgradeBanner: React.FC<{ onUpgrade: () => void }> = ({ onUpgrade }) => {
    // This is a sample Plan ID. In a real application, you would create a
    // subscription plan in your PayPal developer dashboard and use its ID here.
    const premiumPlanId: string = 'P-9AL48325Y8512345BMSZABCD';
    const isConfigured = premiumPlanId !== 'P-YOUR_PREMIUM_PLAN_ID';

    return (
        <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold">Upgrade to Premium!</h3>
                <p className="mt-1">Unlock 4-person video/audio streams, 2-hour time limits, and more for just $7.99 a Month.</p>
            </div>
            <div className="w-full sm:w-auto flex-shrink-0">
                 {isConfigured ? (
                    <PayPalButton
                        type="subscription"
                        planId={premiumPlanId}
                        onSuccess={() => {
                            console.log("Subscription successful!");
                            onUpgrade();
                        }}
                    />
                 ) : (
                    <div className="text-center bg-gray-800/50 text-gray-200 font-semibold py-3 px-5 rounded-md text-sm">
                        <p>Subscription setup is pending.</p>
                        <p className="text-xs font-normal">(Admin: Configure PayPal Plan ID)</p>
                    </div>
                 )}
            </div>
        </div>
    );
}

const SetupWalletBanner: React.FC = () => {
    return (
        <div className="bg-brand-surface border border-brand-primary/50 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold">Set Up Your Wallet</h3>
            <p className="mt-1 text-brand-text-secondary">To receive crypto tips from your audience, please add your wallet details on your profile page.</p>
        </div>
    );
}


const HostDashboard: React.FC<HostDashboardProps> = ({ host, amas, onCreateAMA, onUpgradeToPremium, onExit, onManageAMA }) => {
  return (
    <div className="space-y-8">
       <div>
        <Button onClick={onExit} variant="ghost" className="mb-4">
          {ICONS.ARROW_LEFT}
          <span>Back to Home</span>
        </Button>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold">Host Dashboard</h1>
        <p className="text-brand-text-secondary mt-2">Manage your existing AMAs or create a new one.</p>
      </div>
      
      {host.tier === 'FREE' && host.role !== Role.ADMIN && host.role !== Role.MODERATOR && <UpgradeBanner onUpgrade={onUpgradeToPremium} />}
      {!host.wallet_address && <SetupWalletBanner />}

      <CreateAMAForm host={host} onCreate={onCreateAMA} />

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Your AMAs</h2>
        <div className="space-y-4">
          {amas.length > 0 ? amas.map(ama => (
            <div key={ama.id} className="bg-brand-surface p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{ama.title}</h3>
                <p className="text-sm text-brand-text-secondary">{ama.status} - Starts {formatAMADate(ama.startTime)}</p>
              </div>
              <Button variant="secondary" onClick={() => onManageAMA(ama)}>Manage</Button>
            </div>
          )) : (
            <p className="text-center text-brand-text-secondary p-4 bg-brand-surface rounded-lg">You haven't created any AMAs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;