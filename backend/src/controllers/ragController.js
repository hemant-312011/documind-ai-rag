import fs from "node:fs/promises";
import path from "node:path";

import { loadPdfDocument } from "../rag/documentLoader.js";
import { createRetriever } from "../rag/retriever.js";
import {
  getIndexedDocuments,
  getIndexStats,
  getRetriever,
  setIndexedDocuments,
  setIndexStats,
  setRetriever,
} from "../rag/ragStore.js";
import { splitPdfDocuments } from "../rag/textSplitter.js";
import { createVectorStore } from "../rag/vectorStore.js";

const uploadsDirectory = path.resolve("uploads");

function getOriginalName(storedFileName) {
  const uuidPrefixLength = 37;

  if (storedFileName.length <= uuidPrefixLength) {
    return storedFileName;
  }

  return storedFileName.slice(uuidPrefixLength);
}

export async function indexDocumentsController(request, response) {
  const storedFiles = await fs.readdir(uploadsDirectory);

  const pdfFiles = storedFiles.filter((fileName) =>
    fileName.toLowerCase().endsWith(".pdf"),
  );

  if (pdfFiles.length === 0) {
    response.status(400).json({
      success: false,
      message: "Upload at least one PDF before indexing.",
    });

    return;
  }

  const allDocuments = [];

  for (const storedName of pdfFiles) {
    const filePath = path.join(uploadsDirectory, storedName);

    const loadedDocuments = await loadPdfDocument(filePath);

    const originalName = getOriginalName(storedName);

    const documentsWithMetadata = loadedDocuments.map((document) => ({
      ...document,

      metadata: {
        ...document.metadata,
        fileName: originalName,
        storedName,
      },
    }));

    allDocuments.push(...documentsWithMetadata);
  }

  if (allDocuments.length === 0) {
    response.status(400).json({
      success: false,
      message: "No readable pages were found in the uploaded PDFs.",
    });

    return;
  }

  const chunks = await splitPdfDocuments(allDocuments);

  if (chunks.length === 0) {
    response.status(400).json({
      success: false,
      message: "No readable text was found inside the uploaded PDFs.",
    });

    return;
  }

  const vectorStore = await createVectorStore(chunks);

  if (!vectorStore) {
    throw new Error("Vector store creation failed.");
  }

  const retriever = createRetriever(vectorStore);

  if (!retriever) {
    throw new Error("Retriever creation failed.");
  }

  setRetriever(retriever);

  setIndexedDocuments(
    pdfFiles.map((storedName) => ({
      storedName,
      name: getOriginalName(storedName),
    })),
  );

  const stats = {
    documentCount: pdfFiles.length,
    pageCount: allDocuments.length,
    chunkCount: chunks.length,
  };

  setIndexStats(stats);

  response.status(200).json({
    success: true,
    message: "Documents indexed successfully.",
    indexed: Boolean(getRetriever()),
    ...stats,
  });
}

export function getIndexStatusController(request, response) {
  const retriever = getRetriever();
  const stats = getIndexStats();

  response.status(200).json({
    success: true,
    indexed: Boolean(retriever),
    documents: getIndexedDocuments(),
    documentCount: stats.documentCount,
    pageCount: stats.pageCount,
    chunkCount: stats.chunkCount,
  });
}

export async function testRetrievalController(request, response) {
  const { question } = request.body;

  if (typeof question !== "string" || !question.trim()) {
    response.status(400).json({
      success: false,
      message: "Question is required.",
    });

    return;
  }

  const retriever = getRetriever();

  if (!retriever) {
    response.status(409).json({
      success: false,
      code: "INDEX_REQUIRED",
      message:
        "Documents are not indexed yet. Index your PDFs before asking questions.",
    });

    return;
  }

  const retrievedDocuments = await retriever.invoke(question.trim());

  response.status(200).json({
    success: true,
    question: question.trim(),
    resultCount: retrievedDocuments.length,

    documents: retrievedDocuments.map((document, index) => ({
      id: index + 1,
      pageContent: document.pageContent,
      metadata: document.metadata,
    })),
  });
}
