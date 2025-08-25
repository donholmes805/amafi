
import React, { useState, useEffect, useRef } from 'react';
import { Message, User, Role, AMAStatus } from '../types';
import { ICONS } from '../constants';
import Button from './Button';
import api from '../services/api';

interface ChatProps {
  amaId: number;
  amaStatus: AMAStatus;
  currentUser: User | null;
  messages: Message[];
  loading: boolean;
  onPromptLogin: () => void;
  onNewMessage: (message: Message) => void;
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const userProfile = message.profiles;
    if (!userProfile) return null; // Don't render if profile is missing

    const isHost = userProfile.role === Role.HOST || userProfile.role === Role.CO_HOST;
    const messageBg = isHost ? 'bg-brand-secondary/50' : 'bg-transparent';
    const authorColor = isHost ? 'text-brand-primary font-bold' : 'text-brand-text-primary font-semibold';
    
    return (
        <div className={`p-3 rounded-lg flex items-start space-x-3 ${messageBg}`}>
            <img src={userProfile.avatar_url} alt={userProfile.name} className="w-8 h-8 rounded-full mt-1" />
            <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                    <span className={`${authorColor} flex items-center`}>{userProfile.name} {(userProfile.role === Role.ADMIN || userProfile.role === Role.MODERATOR) && ICONS.CROWN}</span>
                    <span className="text-xs text-brand-text-secondary">{new Date(message.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="text-brand-text-primary text-sm">{message.text}</p>
            </div>
        </div>
    );
}

const Chat: React.FC<ChatProps> = ({ amaId, amaStatus, currentUser, messages, loading, onPromptLogin, onNewMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isChatActive = amaStatus === AMAStatus.LIVE;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !isChatActive || !currentUser) return;
    
    const text = newMessage;
    setNewMessage(''); // Clear input immediately
    
    // Call the API to send the message
    const sentMessage = await api.createMessage(amaId, text);
    
    if (sentMessage) {
      // Parent component will handle adding it to the list
      onNewMessage(sentMessage);
    } else {
      alert("Could not send message. Please try again.");
      // Optional: restore the message text if sending fails
      // setNewMessage(text);
    }
  };

  return (
    <div className="bg-brand-surface rounded-lg h-full flex flex-col">
      <div className="p-4 border-b border-brand-secondary/50">
        <h3 className="text-lg font-bold">Live Q&A</h3>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {loading ? <p className="text-center text-brand-text-secondary">Loading chat...</p> : messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-brand-secondary/50">
        {isChatActive ? (
          currentUser ? (
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-brand-bg border border-brand-secondary rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <Button type="submit" variant="primary" className="rounded-full !p-3">
                {ICONS.SEND}
              </Button>
            </form>
          ) : (
            <div className="text-center text-brand-text-secondary text-sm p-4 bg-brand-bg rounded-lg">
              <p className="mb-3 font-semibold text-brand-text-primary">Want to join the conversation?</p>
              <Button variant="primary" onClick={onPromptLogin}>
                Sign Up / Login to Chat
              </Button>
            </div>
          )
        ) : (
          <div className="text-center text-brand-text-secondary text-sm p-2 bg-brand-bg rounded-full">
            {amaStatus === AMAStatus.UPCOMING ? "The Q&A hasn't started yet." : "The Q&A has ended."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
