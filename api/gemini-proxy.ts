import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// This function acts as a secure proxy to the Gemini API.
export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }

  try {
    const { action, payload } = await request.json();

    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
      
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-2.5-flash";

    let response;

    switch (action) {
      case 'suggestQuestions': {
        const { title, description } = payload;
        const prompt = `Based on the AMA title "${title}" and description "${description}", generate 5 thought-provoking and relevant questions an audience member might ask.`;
        
        response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const jsonResponse = JSON.parse(response.text);
        return NextResponse.json(jsonResponse);
      }
      
      case 'generateHighlights': {
        // Placeholder for future implementation
        return NextResponse.json({ message: "Highlights generation not yet implemented." });
      }

      case 'analyzeMessage': {
        // Placeholder for future implementation
        return NextResponse.json({ message: "Message analysis not yet implemented." });
      }

      default:
        return new NextResponse('Invalid action', { status: 400 });
    }

  } catch (error: any) {
    console.error(`Error in Gemini proxy for action:`, error.message);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
