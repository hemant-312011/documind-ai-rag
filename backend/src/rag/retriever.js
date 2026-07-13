export function createRetriever(vectorStore) {
  if (!vectorStore) {
    throw new Error("Vector store is required to create the retriever.");
  }

  const retriever = vectorStore.asRetriever({
    k: 4,
  });

  return retriever;
}
