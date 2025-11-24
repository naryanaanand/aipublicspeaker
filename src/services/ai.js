import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with a placeholder key. 
// In a real app, this should be an environment variable or input by the user.
let genAI = null;

export const initializeGemini = (apiKey) => {
  const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  if (key) {
    genAI = new GoogleGenerativeAI(key);
  }
};

export const analyzeSpeech = async (transcript) => {
  if (!genAI) {
    throw new Error("Gemini API not initialized. Please provide an API Key.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Act as a world-class Public Speaking Coach. Analyze the following speech transcript and provide a structured JSON response.
    
    Transcript: "${transcript}"

    Return ONLY raw JSON (no markdown formatting) with the following structure:
    {
      "score": number (1-100),
      "tone": string (e.g., "Confident", "Hesitant", "Formal", "Casual"),
      "summary": "Brief 1-sentence summary of the content",
      "strengths": ["point 1", "point 2", "point 3"],
      "improvements": ["point 1", "point 2", "point 3"],
      "rephrasing": [
        { "original": "weak sentence from transcript", "better": "stronger alternative" }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to analyze speech");
  }
};

export const generateDrill = async (difficulty = "easy") => {
  if (!genAI) throw new Error("API Key missing");

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `Give me a unique, creative public speaking impromptu topic. Difficulty: ${difficulty}. 
  Return ONLY the topic text, no quotes or extra words.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Drill Gen Error:", error);
    throw error;
  }
};
