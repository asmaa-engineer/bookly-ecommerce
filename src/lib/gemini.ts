// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Next.js uses process.env, not import.meta.env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface AIResponse {
  text: string;
  intent: "search" | "recommend" | "greeting" | "unknown" | "fallback" | "error";
  keywords?: string;
}

export const chatWithAI = async (message: string, history: any[]): Promise<AIResponse> => {
  // Check if API key is available
  if (!GEMINI_API_KEY || GEMINI_API_KEY === '') {
    console.log("No Gemini API key found - using offline mode");
    return offlineResponse(message);
  }

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const lowerMsg = message.toLowerCase();
    
    const prompt = `You are Bookly AI, a helpful book recommendation assistant.
    
User message: "${message}"

Analyze the user's intent and return ONLY a JSON object with these fields:
- text: your natural, friendly response to the user
- intent: either "search" (if user wants book recommendations), "greeting", or "unknown"
- keywords: if intent is "search", extract the main search terms (genre, mood, author, or topic)

Examples:
{"text": "I'd love to recommend some thrilling books! Here are my top picks:", "intent": "search", "keywords": "thriller"}
{"text": "Hello! I'm Bookly AI. What kind of book are you in the mood for today?", "intent": "greeting", "keywords": ""}
{"text": "That's interesting! Tell me more about what you like to read.", "intent": "unknown", "keywords": ""}

Return ONLY the JSON, no other text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response
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
    console.error("Gemini API Error:", error);
    return offlineResponse(message);
  }
};

// Offline mode - works without API key
function offlineResponse(message: string): AIResponse {
  const lowerMsg = message.toLowerCase();
  
  // Detect intent from keywords
  if (lowerMsg.includes("recommend") || lowerMsg.includes("find") || lowerMsg.includes("book") || lowerMsg.includes("read")) {
    let keywords = "";
    
    // Extract potential keywords
    if (lowerMsg.includes("thriller") || lowerMsg.includes("mystery")) {
      keywords = "thriller";
    } else if (lowerMsg.includes("sci-fi") || lowerMsg.includes("science fiction") || lowerMsg.includes("sci fi")) {
      keywords = "sci-fi";
    } else if (lowerMsg.includes("motivation") || lowerMsg.includes("self") || lowerMsg.includes("development")) {
      keywords = "self development";
    } else if (lowerMsg.includes("romance") || lowerMsg.includes("love")) {
      keywords = "romance";
    } else if (lowerMsg.includes("fantasy")) {
      keywords = "fantasy";
    } else {
      // Extract simple keywords
      keywords = message.replace(/recommend|find|me|some|books|about|like|please/gi, "").trim();
      if (keywords.length > 30) keywords = keywords.substring(0, 30);
      if (keywords === "") keywords = "fiction";
    }
    
    return {
      text: `I'll look for some ${keywords} books for you!`,
      intent: "search",
      keywords: keywords
    };
  }
  
  if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
    return {
      text: "Hello! I'm Bookly AI. Tell me what kind of book you're looking for and I'll help you find it!",
      intent: "greeting"
    };
  }
  
  return {
    text: "I can help you find books! Try asking for 'thriller books', 'sci-fi recommendations', or 'books for motivation'.",
    intent: "unknown"
  };
}

export const generateDescription = async (title: string, author: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    return `${title} by ${author} is a captivating book that readers are loving. A must-read for fans of ${author}!`;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(`Generate a short, engaging book description for "${title}" by ${author}. Make it 2-3 sentences.`);
    return result.response.text();
  } catch {
    return `${title} by ${author} is a wonderful book that explores deep themes with beautiful prose. Highly recommended!`;
  }
};

export const generateReviewSummary = async (reviews: any[]): Promise<string> => {
  if (!reviews || reviews.length === 0) return "No reviews yet. Be the first to review this book!";
  if (!GEMINI_API_KEY) {
    const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
    return `Readers rate this book ${avgRating.toFixed(1)} stars out of 5. ${reviews.length} reviews total.`;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const reviewTexts = reviews.slice(0, 5).map(r => r.comment).join(". ");
    const result = await model.generateContent(`Summarize what readers are saying about this book in 1 sentence based on these reviews: ${reviewTexts}`);
    return result.response.text();
  } catch {
    return "Readers are enjoying this book! Check out the reviews for more details.";
  }
};

export const analyzeUserMood = (mood: string): string[] => {
  const moodMap: Record<string, string[]> = {
    happy: ["Fiction", "Comedy", "Lifestyle", "Adventure"],
    sad: ["Drama", "Poetry", "Memoir", "Inspirational"],
    curious: ["Science", "History", "Technology", "Philosophy"],
    tired: ["Short Stories", "Light Fiction", "Art", "Travel"],
    motivated: ["Self Development", "Business", "Biography", "Productivity"],
    stressed: ["Mindfulness", "Meditation", "Self Development", "Fiction"],
    romantic: ["Romance", "Fiction", "Classics"],
    adventurous: ["Adventure", "Fantasy", "Sci-Fi", "Travel"]
  };
  
  return moodMap[mood.toLowerCase()] || ["Fiction", "General"];
};