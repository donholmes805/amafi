import React from 'react';
import { AMA, User, Role } from '../types';
import { formatAMADate } from '../utils/time';
import { ICONS } from '../constants';

interface ModeratorDashboardProps {
    users: User[];
    amas: AMA[];
}

const ModeratorDashboard: React.FC<ModeratorDashboardProps> = ({ users, amas }) => {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Moderator Dashboard</h1>
                <p className="text-brand-text-secondary mt-2">Oversee platform users and activities.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* All Users */}
                <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">All Users</h2>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                        {users.map(user => (
                            <div key={user.id} className="flex justify-between items-center bg-brand-bg p-3 rounded-md">
                                <div className="flex items-center space-x-3">
                                    <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold flex items-center">{user.name}{(user.role === Role.ADMIN || user.role === Role.MODERATOR) && ICONS.CROWN}</p>
                                        <p className="text-sm text-brand-text-secondary" title={user.id}>ID: {user.id.substring(0, 13)}...</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">{user.role}</p>
                                    {user.tier && <p className="text-xs text-brand-primary">{user.tier}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* All AMAs */}
                <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">All AMAs</h2>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                        {amas.map(ama => (
                            <div key={ama.id} className="bg-brand-bg p-3 rounded-md">
                                <p className="font-semibold truncate">{ama.title}</p>
                                <div className="flex justify-between items-center text-sm text-brand-text-secondary mt-1">
                                    <span>Host: {ama.host.name}</span>
                                    <span className={`font-bold ${
                                        ama.status === 'LIVE' ? 'text-red-500' :
                                        ama.status === 'UPCOMING' ? 'text-blue-500' :
                                        'text-gray-500'
                                    }`}>{ama.status}</span>
                                </div>
                                <p className="text-xs text-brand-text-secondary mt-1">{formatAMADate(ama.startTime)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModeratorDashboard;