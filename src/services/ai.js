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

// Helper to convert Blob to Base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const analyzeSpeech = async (audioBlob, transcriptFallback) => {
  if (!genAI) {
    throw new Error("Gemini API not initialized. Please provide an API Key.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  let promptParts = [];

  if (audioBlob) {
    const audioBase64 = await blobToBase64(audioBlob);
    promptParts.push({
      inlineData: {
        data: audioBase64,
        mimeType: "audio/webm",
      },
    });
    promptParts.push(`
      Act as a world-class Public Speaking Coach. Listen to the attached audio recording of a speech.
      
      Your goal is to provide "tough love" feedback. Do NOT gloss over mistakes.
      
      1. **Transcription**: Transcribe the speech EXACTLY as heard, including every "um", "uh", stutter, and hesitation. Do not correct grammar.
      2. **Pause Analysis**: Analyze the silence. Distinguish between "effective dramatic pauses" and "lost/thinking pauses".
      3. **Pacing**: Was the speed appropriate for the content? (e.g., fast for excitement, slow for emphasis).
      4. **Tone**: Describe the speaker's emotional tone.
    `);
  } else {
    // Fallback to text-only if no audio (shouldn't happen in new flow, but good for safety)
    promptParts.push(`
      Act as a world-class Public Speaking Coach. Analyze the following speech transcript.
      Transcript: "${transcriptFallback}"
    `);
  }

  promptParts.push(`
    Return ONLY raw JSON (no markdown formatting) with the following structure:
    {
      "score": number (1-100),
      "tone": string,
      "summary": "Brief 1-sentence summary",
      "strengths": ["point 1", "point 2"],
      "improvements": ["point 1", "point 2"],
      "rephrasing": [
        { "original": "weak phrase", "better": "stronger alternative" }
      ],
      "stutter_analysis": {
        "count": number,
        "examples": ["phrase with stutter"]
      },
      "pause_analysis": "One sentence critique of their use of silence.",
      "pacing_analysis": "One sentence critique of their speed variation."
    }
  `);

  try {
    const result = await model.generateContent(promptParts);
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
