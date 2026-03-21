"use client";

import { supabase } from './supabase';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const chatWithAI = async (message: string, history: any[]) => {
  if (!GEMINI_API_KEY) {
    return {
      text: "I'm currently in offline mode. Please add a Gemini API key to enable full AI capabilities.",
      intent: "fallback"
    };
  }

  try {
    // In a real implementation, you would use @google/generative-ai
    // For now, we simulate the AI logic that extracts keywords for book searching
    const lowerMsg = message.toLowerCase();
    let intent = "chat";
    let keywords = "";

    if (lowerMsg.includes("recommend") || lowerMsg.includes("find") || lowerMsg.includes("book") || lowerMsg.includes("read")) {
      intent = "search";
      // Simple keyword extraction simulation
      keywords = message.replace(/recommend|find|me|some|books|about|like/gi, "").trim();
    }

    // Simulated AI Response
    let responseText = "";
    if (intent === "search") {
      responseText = `I'll look for some books related to "${keywords}" for you.`;
    } else {
      responseText = "That's interesting! As your Bookly assistant, I can help you find your next favorite book or answer questions about our collection.";
    }

    return { text: responseText, intent, keywords };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Sorry, I encountered an error. How else can I help you?", intent: "error" };
  }
};

export const generateDescription = async (title: string, author: string) => {
  return `[AI Generated] ${title} by ${author} is a masterpiece that explores profound themes with a unique narrative style. A must-read for fans of ${author}.`;
};

export const generateReviewSummary = async (reviews: any[]) => {
  if (!reviews || reviews.length === 0) return "No reviews yet.";
  return "Readers are praising the character development and the unexpected plot twists.";
};

export const analyzeUserMood = (mood: string) => {
  const moodMap: Record<string, string[]> = {
    happy: ["Fiction", "Lifestyle", "Comedy"],
    sad: ["Drama", "Poetry", "Memoir"],
    curious: ["Science", "History", "Technology"],
    tired: ["Fiction", "Short Stories", "Art"],
    motivated: ["Self-development", "Business", "Biography"]
  };
  return moodMap[mood.toLowerCase()] || ["Fiction"];
};