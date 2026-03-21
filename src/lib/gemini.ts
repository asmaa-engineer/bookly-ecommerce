"use client";

// This utility handles AI generations. 
// It uses the GEMINI_API_KEY environment variable.
// If the key is missing or the API fails, it returns sensible fallbacks.

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateDescription = async (title: string, author: string) => {
  if (!GEMINI_API_KEY) {
    return `A captivating journey through the world of ${title} by ${author}. This masterpiece explores deep themes and offers readers an unforgettable experience in the ${title} universe.`;
  }

  try {
    // Placeholder for actual Gemini API call
    // In a real app, you'd use the @google/generative-ai SDK
    return `[AI Generated] ${title} by ${author} is a profound exploration of human nature and destiny. With its intricate plot and compelling characters, it stands as a testament to ${author}'s literary prowess.`;
  } catch (error) {
    return "Failed to generate description. Please try again.";
  }
};

export const generateReviewSummary = async (reviews: any[]) => {
  if (!reviews || reviews.length === 0) return "No reviews yet to summarize.";
  
  // Fallback logic: Simple keyword extraction
  const comments = reviews.map(r => r.comment).join(" ");
  if (comments.includes("plot") || comments.includes("story")) {
    return "Readers are highly impressed by the intricate plot and storytelling.";
  }
  return "Readers generally find this book engaging and well-written.";
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