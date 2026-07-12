import { ChatGroq } from "@langchain/groq";

if (!process.env.VITE_GROQ_API_KEY) {
  throw new Error("VITE_GROQ_API_KEY is missing inside api/.env");
}

export const llm = new ChatGroq({
  apiKey: process.env.VITE_GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  maxRetries: 2,
});
