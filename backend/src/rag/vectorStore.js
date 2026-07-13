import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

import { embeddings } from "./embeddings.js";

export async function createVectorStore(chunks) {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new Error("Chunks are required to create the vector store.");
  }

  const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);

  return vectorStore;
}
