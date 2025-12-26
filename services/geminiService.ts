import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSymptoms = async (symptoms: string): Promise<string> => {
  try {
    const ai = getClient();
    
    // Using flash model for quick text analysis
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: symptoms,
      config: {
        systemInstruction: `You are Aura Health's AI medical assistant. 
        Your goal is to provide preliminary information based on symptoms described by the user. 
        
        RULES:
        1. Always include a disclaimer that you are an AI and not a doctor.
        2. If the symptoms sound life-threatening (chest pain, stroke signs, severe bleeding), advise them to call emergency services immediately.
        3. Keep responses concise, empathetic, and structured (use bullet points).
        4. Suggest potential causes and recommended next steps (e.g., "See a GP", "Rest and hydrate").
        5. Do not make definitive diagnoses. Use phrases like "This could be...", "Possible causes include...".`,
        temperature: 0.7,
      }
    });

    return response.text || "I apologize, but I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "I am currently unable to process your request. Please try again later or consult a medical professional directly.";
  }
};