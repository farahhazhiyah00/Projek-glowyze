
import { GoogleGenAI, Chat } from "@google/genai";
import { UserProfile } from "../types";

const SYSTEM_INSTRUCTION = `You are Glowyze, an expert AI skincare consultant. 
Your goal is to help users understand their skin health and recommend routines.
Be empathetic, encouraging, and scientifically accurate but accessible.
Keep responses concise (under 100 words) unless asked for a detailed routine.
Always prioritize safety: advise seeing a dermatologist for severe issues.
Use formatting like bullet points for readability.
If the user provides profile data, tailor your advice to their skin type and lifestyle.`;

export class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    // Correctly initialize with named apiKey parameter as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  public async startChat(userProfile?: UserProfile) {
    let instruction = SYSTEM_INSTRUCTION;
    if (userProfile) {
      instruction += `\n\nUser Profile Context:
      Name: ${userProfile.name}
      Skin Type: ${userProfile.skinType}
      Age: ${userProfile.age}
      Allergies: ${userProfile.allergies.join(', ') || 'None'}
      Stress: ${userProfile.stressLevel}
      Water Intake: ${userProfile.waterIntake}L`;
    }

    this.chatSession = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: instruction,
      },
    });
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.chatSession) {
      await this.startChat();
    }
    
    try {
      if (!this.chatSession) {
         throw new Error("Chat session not initialized");
      }
      const response = await this.chatSession.sendMessage({ message });
      // Correctly accessing .text property (not calling as a function)
      return response.text || "I'm having trouble thinking clearly right now. Please try again.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Sorry, I'm having trouble connecting to the skincare database. Please try again later.";
    }
  }
}

export const geminiService = new GeminiService();
