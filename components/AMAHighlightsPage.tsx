
import React, { useState, useEffect } from 'react';
import { AMA, AMAHighlightsData, Message } from '../types';
import Button from './Button';
import { ICONS } from '../constants';
import { generateAMAHighlights } from '../services/geminiService';
import api from '../services/api';

interface AMAHighlightsPageProps {
  ama: AMA;
  onExit: () => void;
}

const AMAHighlightsPage: React.FC<AMAHighlightsPageProps> = ({ ama, onExit }) => {
    const [highlights, setHighlights] = useState<AMAHighlightsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAndGenerateHighlights = async () => {
            setIsLoading(true);
            setError(null);
            
            // 1. Fetch all messages for the AMA using the new API service
            const messages = await api.fetchMessages(ama.id);

            if (!messages) {
                setError("Could not retrieve the chat history to generate highlights.");
                setIsLoading(false);
                return;
            }

            // For now, we generate on the fly. In production, we'd cache this result.
            const generatedHighlights = await generateAMAHighlights(ama.title, ama.description, messages);
            
            if (generatedHighlights) {
                setHighlights(generatedHighlights);
            } else {
                setError("The AI failed to generate highlights for this session. It might be too short or have an unusual format.");
            }

            setIsLoading(false);
        };

        fetchAndGenerateHighlights();
    }, [ama]);

    return (
        <div className="space-y-6">
            <div>
                <Button onClick={onExit} variant="ghost">
                    {ICONS.ARROW_LEFT}
                    <span>Back to Home</span>
                </Button>
            </div>
            <div className="bg-brand-surface p-6 md:p-8 rounded-lg shadow-lg">
                <div className="text-center border-b border-brand-secondary/50 pb-6 mb-6">
                    <p className="text-brand-primary font-semibold">AI-Generated Highlights For</p>
                    <h1 className="text-4xl font-bold mt-1">{ama.title}</h1>
                    <p className="text-brand-text-secondary mt-2">Hosted by {ama.host.name}</p>
                </div>

                {isLoading && (
                    <div className="text-center p-12">
                        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-brand-text-secondary">Analyzing transcript and generating highlights...</p>
                    </div>
                )}

                {error && <p className="text-center text-red-500 p-8">{error}</p>}
                
                {highlights && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-4 border-l-4 border-brand-primary pl-3">Top Questions & Answers</h2>
                                <div className="space-y-4">
                                    {highlights.topQuestions.map((qa, index) => (
                                        <div key={index} className="bg-brand-bg/50 p-4 rounded-md">
                                            <p className="font-semibold text-brand-text-primary">Q: {qa.question}</p>
                                            <p className="mt-2 text-brand-text-secondary">A: {qa.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h2 className="text-2xl font-bold mb-4 border-l-4 border-brand-primary pl-3">Golden Nuggets</h2>
                                 <div className="space-y-3">
                                    {highlights.goldenNuggets.map((nugget, index) => (
                                        <blockquote key={index} className="border-l-4 border-brand-secondary pl-4 italic text-brand-text-primary">
                                            "{nugget}"
                                        </blockquote>
                                    ))}
                                 </div>
                            </div>
                        </div>
                        {/* Right Column (Sidebar) */}
                        <div className="space-y-8">
                             <div>
                                <h2 className="text-xl font-bold mb-4">Key Topics</h2>
                                <ul className="space-y-2">
                                    {highlights.keyTopics.map((topic, index) => (
                                        <li key={index} className="flex items-center space-x-2 bg-brand-bg/50 px-3 py-2 rounded-md text-brand-text-secondary">
                                            <span className="text-brand-primary">#</span>
                                            <span>{topic}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                             <div>
                                <h2 className="text-xl font-bold mb-4">Overall Sentiment</h2>
                                <div className="bg-brand-bg/50 p-4 rounded-md text-center">
                                    <p className="text-3xl font-bold text-brand-primary">{highlights.sentiment}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AMAHighlightsPage;
