import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function splitPdfDocuments(documents) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 700,
    chunkOverlap: 120,
  });

  const chunks = await splitter.splitDocuments(documents);

  return chunks;
}
