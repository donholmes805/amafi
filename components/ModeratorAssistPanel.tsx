
import React, { useState, useEffect, useRef } from 'react';
import { Message, AnalyzedMessage } from '../types';
import { analyzeChatMessage } from '../services/geminiService';

interface ModeratorAssistPanelProps {
  messages: Message[];
}

const ModeratorAssistPanel: React.FC<ModeratorAssistPanelProps> = ({ messages }) => {
    const [analyzedMessages, setAnalyzedMessages] = useState<AnalyzedMessage[]>([]);
    const [activeTab, setActiveTab] = useState<'feed' | 'flagged' | 'questions'>('feed');
    const analyzedIds = useRef(new Set<number>());

    useEffect(() => {
        const newMessages = messages.filter(m => !analyzedIds.current.has(m.id));
        
        if (newMessages.length > 0) {
            newMessages.forEach(async message => {
                analyzedIds.current.add(message.id);
                const analysis = await analyzeChatMessage(message.text);
                if (analysis) {
                    setAnalyzedMessages(prev => [...prev, { messageId: message.id, ...analysis }]);
                }
            });
        }
    }, [messages]);
    
    const messageMap = new Map(messages.map(m => [m.id, m]));
    const analysisMap = new Map(analyzedMessages.map(a => [a.messageId, a]));

    const getFilteredMessages = () => {
        const combined = messages.map(msg => ({
            ...msg,
            analysis: analysisMap.get(msg.id)
        })).reverse(); // Show newest first

        switch(activeTab) {
            case 'flagged':
                return combined.filter(m => m.analysis?.isFlagged);
            case 'questions':
                return combined.filter(m => m.analysis?.category === 'Question');
            case 'feed':
            default:
                return combined;
        }
    }
    
    const filteredMessages = getFilteredMessages();

    const CategoryBadge: React.FC<{ category?: string }> = ({ category }) => {
        if (!category) return null;
        const colors: { [key: string]: string } = {
            'Question': 'bg-blue-500',
            'Comment': 'bg-gray-500',
            'Spam': 'bg-yellow-600',
            'Off-topic': 'bg-purple-600',
            'Other': 'bg-gray-600',
        };
        return <span className={`text-xs px-2 py-0.5 rounded-full text-white ${colors[category] || 'bg-gray-700'}`}>{category}</span>;
    };

    return (
        <div className="bg-brand-surface rounded-lg h-full flex flex-col">
            <div className="p-4 border-b border-brand-secondary/50">
                <h3 className="text-lg font-bold">Moderator Assist</h3>
                <div className="flex border-b border-brand-secondary mt-3">
                    <button onClick={() => setActiveTab('feed')} className={`flex-1 pb-2 text-sm font-semibold ${activeTab === 'feed' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-secondary'}`}>Feed</button>
                    <button onClick={() => setActiveTab('flagged')} className={`flex-1 pb-2 text-sm font-semibold ${activeTab === 'flagged' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-secondary'}`}>Flagged</button>
                    <button onClick={() => setActiveTab('questions')} className={`flex-1 pb-2 text-sm font-semibold ${activeTab === 'questions' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-secondary'}`}>Questions</button>
                </div>
            </div>
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {filteredMessages.map(msg => (
                     <div key={msg.id} className={`p-2 rounded-md ${msg.analysis?.isFlagged ? 'bg-red-900/50 border border-red-500' : 'bg-brand-bg/50'}`}>
                         <div className="flex items-start space-x-2">
                             <img src={msg.profiles.avatar_url} alt={msg.profiles.name} className="w-6 h-6 rounded-full mt-1" />
                             <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-sm">{msg.profiles.name}</span>
                                    {msg.analysis ? <CategoryBadge category={msg.analysis.category} /> : <div className="w-4 h-4 rounded-full bg-brand-secondary animate-pulse"></div>}
                                </div>
                                <p className="text-sm text-brand-text-secondary">{msg.text}</p>
                                {msg.analysis?.isFlagged && <p className="text-xs text-red-400 mt-1 font-semibold">Reason: {msg.analysis.flagReason}</p>}
                             </div>
                         </div>
                     </div>
                ))}
            </div>
        </div>
    );
};

export default ModeratorAssistPanel;
