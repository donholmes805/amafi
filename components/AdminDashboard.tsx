
import React, { useState } from 'react';
import { AMA, User, Role, UserTier, AMAStatus } from '../types';
import Button from './Button';
import PayPalButton from './PayPalButton';
import { ICONS } from '../constants';

interface AdminDashboardProps {
    currentUser: User;
    users: User[];
    amas: AMA[];
    onUpdateUser: (userId: string, updates: Partial<Pick<User, 'role' | 'tier'>>) => Promise<User | null>;
    onFeatureAMA: (amaId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, users, amas, onUpdateUser, onFeatureAMA }) => {
    const [selectedAMAId, setSelectedAMAId] = useState<string>('');
    const upcomingAMAs = amas.filter(a => a.status === AMAStatus.UPCOMING);

    const getSelectedAMATitle = () => {
        const ama = amas.find(a => a.id.toString() === selectedAMAId);
        return ama ? ama.title : '';
    };

    const handlePaymentSuccess = () => {
        if (!selectedAMAId) return;
        onFeatureAMA(selectedAMAId);
        setSelectedAMAId('');
    };

    const handleManualFeature = () => {
        if (!selectedAMAId) {
            alert("Please select an AMA to feature.");
            return;
        }
        const confirmFeature = window.confirm(`Are you sure you want to manually feature "${getSelectedAMATitle()}"? This action is free.`);
        if (confirmFeature) {
            onFeatureAMA(selectedAMAId);
            setSelectedAMAId('');
        }
    };
    
    const handleRoleChange = async (user: User, newRole: Role) => {
        if (user.role === newRole) return;
        const result = await onUpdateUser(user.id, { role: newRole });
        if (result) {
            alert(`${user.name}'s role updated to ${newRole}.`);
        } else {
            alert(`Failed to update role for ${user.name}.`);
        }
    };

    const handleTierChange = async (user: User, newTier: UserTier) => {
        if (user.tier === newTier) return;
        const result = await onUpdateUser(user.id, { tier: newTier });
        if (result) {
            alert(`${user.name} has been upgraded to Premium!`);
        } else {
            alert(`Failed to upgrade tier for ${user.name}.`);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-brand-text-secondary mt-2">Manage platform settings, users, and featured content.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Feature Spotlight */}
                <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Manage Featured Spotlight</h2>
                    <div className="space-y-4">
                        <select
                            value={selectedAMAId}
                            onChange={e => setSelectedAMAId(e.target.value)}
                            className="w-full bg-brand-bg border border-brand-secondary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            <option value="">Select an upcoming AMA...</option>
                            {upcomingAMAs.map(ama => (
                                <option key={ama.id} value={ama.id}>{ama.title} (by {ama.host.name})</option>
                            ))}
                        </select>
                        <div className="bg-brand-bg/50 p-3 rounded-md text-sm text-brand-text-secondary">
                            <p><span className="font-semibold text-brand-text-primary">Cost:</span> $39.99</p>
                            <p><span className="font-semibold text-brand-text-primary">Duration:</span> 72 hours from time of posting or scheduled time.</p>
                        </div>
                        <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <div>
                                <p className="text-sm text-center font-semibold mb-2 text-brand-text-secondary">Via PayPal ($39.99)</p>
                                 <PayPalButton
                                    type="one-time"
                                    amount="39.99"
                                    description={`Feature AMA: ${getSelectedAMATitle()}`}
                                    onSuccess={handlePaymentSuccess}
                                    disabled={!selectedAMAId}
                                 />
                            </div>
                            <div>
                                <p className="text-sm text-center font-semibold mb-2 text-brand-text-secondary">Manual Admin Action</p>
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={handleManualFeature}
                                    disabled={!selectedAMAId}
                                >
                                    Feature for Free
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manage Users */}
                <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                        {users.map(user => {
                            const isCurrentUser = user.id === currentUser.id;
                            return (
                                <div key={user.id} className="flex justify-between items-center bg-brand-bg p-3 rounded-md">
                                    <div>
                                        <p className="font-semibold flex items-center">
                                            {user.name}
                                            {isCurrentUser && <span className="text-xs text-brand-text-secondary ml-2">(You)</span>}
                                            {(user.role === Role.ADMIN || user.role === Role.MODERATOR) && ICONS.CROWN}
                                        </p>
                                        <p className="text-sm text-brand-text-secondary">
                                            {user.role}
                                            {user.role === Role.HOST && user.tier && ` - ${user.tier}`}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap justify-end gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => handleRoleChange(user, Role.ADMIN)} disabled={isCurrentUser}>Make Admin</Button>
                                        <Button size="sm" variant="secondary" onClick={() => handleRoleChange(user, Role.MODERATOR)} disabled={isCurrentUser}>Make Mod</Button>
                                        {user.role === Role.HOST && user.tier !== 'PREMIUM' && (
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleTierChange(user, 'PREMIUM')}>Grant Premium</Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
