import { ChatGroq } from "@langchain/groq";

const groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
  throw new Error("GROQ_API_KEY is missing inside api/.env");
}

export const llm = new ChatGroq({
  apiKey: groqApiKey,
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});
