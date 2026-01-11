
import { GoogleGenAI, Type } from "@google/genai";
import { ActionLog, LimitRule } from "../types";

export const getAIInsights = async (logs: ActionLog[], rules: LimitRule[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const simplifiedLogs = logs.slice(-50).map(l => ({
    name: l.actionName,
    success: l.success,
    override: l.override,
    time: new Date(l.timestamp).toISOString()
  }));

  const prompt = `
    Analyze these productivity logs and current rate limiting rules:
    Logs: ${JSON.stringify(simplifiedLogs)}
    Rules: ${JSON.stringify(rules)}

    Provide 3 actionable insights to improve productivity. 
    Focus on patterns of overages or frequent overrides.
    Keep the tone encouraging but firm.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  actionableStep: { type: Type.STRING }
                },
                required: ["title", "description", "actionableStep"]
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{"insights": []}');
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return { insights: [{ title: "Analysis Failed", description: "Unable to connect to AI server.", actionableStep: "Check your API key or connection." }] };
  }
};
