
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateMysteryContent(topic: string, category: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a cryptic, mysterious ${category === 'EMAILS' ? 'email' : 'police statement'} from the year 1979. 
    The topic is: ${topic}. 
    Keep it under 80 words. 
    Use a tone of paranoia and suspense. 
    Format it as a letter with a To/Officer, Subject/CaseNum, and Date field.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          to: { type: Type.STRING },
          subject: { type: Type.STRING },
          date: { type: Type.STRING },
          message: { type: Type.STRING },
          reconstructionPrompt: { type: Type.STRING, description: "A highly descriptive visual prompt for a video reconstruction of the scene mentioned." }
        },
        required: ["to", "subject", "date", "message", "reconstructionPrompt"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse mystery content", e);
    return null;
  }
}

export async function decryptRedacted(redactedText: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an expert cryptographer investigating a Cold War mystery. 
    Provide a chilling interpretation or 'decrypted' version of this redacted information: "${redactedText}". 
    The tone should be bone-chilling.`,
  });
  return response.text;
}

export async function reconstructScene(prompt: string) {
  const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await aiInstance.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Gritty, 1970s CCTV style video reconstruction of: ${prompt}. Low light, grainy film, high suspense.`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await aiInstance.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
}
