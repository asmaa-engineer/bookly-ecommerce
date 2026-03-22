import { GoogleGenerativeAI } from "@google/generative-ai";

// Vite uses import.meta.env instead of process.env
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export interface AIResponse {
  text: string;
  intent: "search" | "recommend" | "greeting" | "unknown" | "fallback" | "error";
  keywords?: string;
}

export const chatWithAI = async (message: string, history: any[]): Promise<AIResponse> => {
  if (!genAI) {
    return offlineResponse(message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are Bookly AI, a helpful book recommendation assistant.
    
    User message: "${message}"

    Analyze the user's intent and return ONLY a JSON object with these fields:
    - text: your natural, friendly response to the user
    - intent: either "search" (if user wants book recommendations), "greeting", or "unknown"
    - keywords: if intent is "search", extract the main search terms (genre, mood, author, or topic)

    Examples:
    {"text": "I'd love to recommend some thrilling books! Here are my top picks:", "intent": "search", "keywords": "thriller"}
    {"text": "Hello! I'm Bookly AI. What kind of book are you in the mood for today?", "intent": "greeting", "keywords": ""}

    Return ONLY the JSON, no other text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        text: parsed.text || "Here are some books you might enjoy!",
        intent: parsed.intent || "unknown",
        keywords: parsed.keywords || ""
      };
    }
    
    return {
      text: responseText,
      intent: "unknown"
    };
    
  } catch (error) {
    console.error("Gemini SDK Error:", error);
    return offlineResponse(message);
  }
};

function offlineResponse(message: string): AIResponse {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes("recommend") || lowerMsg.includes("find") || lowerMsg.includes("book")) {
    return {
      text: "I'll look for some books for you!",
      intent: "search",
      keywords: "fiction"
    };
  }
  return {
    text: "Hello! I'm Bookly AI. How can I help you find your next read?",
    intent: "greeting"
  };
}

export const generateDescription = async (title: string, author: string): Promise<string> => {
  if (!genAI) return `${title} by ${author} is a great read.`;
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a short, engaging book description for "${title}" by ${author}. Make it 2-3 sentences.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    return `${title} by ${author} is a wonderful book.`;
  }
};

export const generateReviewSummary = async (reviews: any[]): Promise<string> => {
  if (!reviews || reviews.length === 0) return "No reviews yet.";
  if (!genAI) return "Readers are enjoying this book!";
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const reviewTexts = reviews.slice(0, 5).map(r => r.comment).join(". ");
    const prompt = `Summarize what readers are saying about this book in 1 sentence: ${reviewTexts}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    return "Readers are enjoying this book!";
  }
};

export const analyzeUserMood = (mood: string): string[] => {
  const moodMap: Record<string, string[]> = {
    happy: ["Fiction", "Comedy", "Adventure"],
    sad: ["Drama", "Poetry", "Inspirational"],
    curious: ["Science", "History", "Philosophy"],
    tired: ["Short Stories", "Light Fiction"],
    motivated: ["Self Development", "Business", "Biography"],
  };
  return moodMap[mood.toLowerCase()] || ["Fiction"];
};