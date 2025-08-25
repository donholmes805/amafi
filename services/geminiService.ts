
import { Message, AMAHighlightsData, AnalyzedMessage } from "../types";

const mockQuestions = [
    "What was the main inspiration behind this project?",
    "Can you walk us through the core technology stack?",
    "What were the biggest challenges you faced during development?",
    "What are the future plans for this project?",
    "How can the community get involved and contribute?"
];

// Helper to call our Vercel-hosted backend function
const invokeVercelFunction = async (action: string, payload: any) => {
  try {
    const response = await fetch('/api/gemini-proxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, payload })
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || `Request failed with status ${response.status}`);
    }
    
    return await response.json();

  } catch(error: any) {
    console.error(`Error invoking function action '${action}':`, error.message);
    // In a real app, you might want to show a toast notification to the user
    return null;
  }
}

export const suggestQuestions = async (title: string, description: string): Promise<string[]> => {
  const data = await invokeVercelFunction('suggestQuestions', { title, description });
  
  if (data && Array.isArray(data.questions) && data.questions.length > 0) {
    return data.questions;
  }
  return mockQuestions; // Fallback if API call fails or response is empty
};

export const generateAMAHighlights = async (title: string, description: string, messages: Message[]): Promise<AMAHighlightsData | null> => {
    const chatTranscript = messages.map(m => `${m.profiles.name}: ${m.text}`).join('\n');
    const data = await invokeVercelFunction('generateHighlights', { title, description, chatTranscript });
    return data as AMAHighlightsData | null;
};

export const analyzeChatMessage = async (messageText: string): Promise<Omit<AnalyzedMessage, 'messageId'> | null> => {
    const data = await invokeVercelFunction('analyzeMessage', { messageText });
    if (data && !data.isFlagged) {
        data.flagReason = undefined;
    }
    return data as Omit<AnalyzedMessage, 'messageId'>;
};
