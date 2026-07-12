let retriever = null;

let indexedDocuments = [];

let indexStats = {
  documentCount: 0,
  pageCount: 0,
  chunkCount: 0,
};

export function setRetriever(newRetriever) {
  retriever = newRetriever;
}

export function getRetriever() {
  return retriever;
}

export function setIndexedDocuments(documents) {
  indexedDocuments = documents;
}

export function getIndexedDocuments() {
  return indexedDocuments;
}

export function setIndexStats(stats) {
  indexStats = stats;
}

export function getIndexStats() {
  return indexStats;
}

export function clearRagStore() {
  retriever = null;
  indexedDocuments = [];

  indexStats = {
    documentCount: 0,
    pageCount: 0,
    chunkCount: 0,
  };
}
