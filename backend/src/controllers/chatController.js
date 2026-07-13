import { llm } from "../rag/llm.js";
import { ragPrompt } from "../rag/prompt.js";
import { getRetriever } from "../rag/ragStore.js";

function getPageNumber(document) {
  return (
    document.metadata?.loc?.pageNumber ??
    document.metadata?.pdf?.pageNumber ??
    document.metadata?.pageNumber ??
    null
  );
}

function buildContext(documents) {
  return documents
    .map((document, index) => {
      const fileName = document.metadata?.fileName ?? "Unknown document";

      const pageNumber = getPageNumber(document) ?? "Unknown";

      return [
        `SOURCE ${index + 1}`,
        `File: ${fileName}`,
        `Page: ${pageNumber}`,
        "Content:",
        document.pageContent,
      ].join("\n");
    })
    .join("\n\n--------------------\n\n");
}

function createCitations(documents) {
  const uniqueCitations = new Map();

  documents.forEach((document, index) => {
    const fileName = document.metadata?.fileName ?? "Unknown document";

    const storedName = document.metadata?.storedName ?? "";

    const pageNumber = getPageNumber(document);

    const citationKey = `${storedName}-${pageNumber ?? index}`;

    if (!uniqueCitations.has(citationKey)) {
      uniqueCitations.set(citationKey, {
        id: citationKey,
        fileName,
        storedName,
        pageNumber,
      });
    }
  });

  return Array.from(uniqueCitations.values());
}

function getResponseText(modelResponse) {
  if (typeof modelResponse.content === "string") {
    return modelResponse.content;
  }

  if (Array.isArray(modelResponse.content)) {
    return modelResponse.content
      .map((part) => {
        if (
          typeof part === "object" &&
          part !== null &&
          "text" in part &&
          typeof part.text === "string"
        ) {
          return part.text;
        }

        return "";
      })
      .join("");
  }

  return String(modelResponse.content ?? "");
}

export async function askQuestionController(request, response) {
  const { question } = request.body;

  if (typeof question !== "string" || !question.trim()) {
    response.status(400).json({
      success: false,
      message: "Question is required.",
    });

    return;
  }

  const cleanQuestion = question.trim();

  if (cleanQuestion.length > 2000) {
    response.status(400).json({
      success: false,
      message: "Question must be shorter than 2000 characters.",
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

  const retrievedDocuments = await retriever.invoke(cleanQuestion);

  if (retrievedDocuments.length === 0) {
    response.status(200).json({
      success: true,
      question: cleanQuestion,
      answer: "I don't know based on the uploaded documents.",
      citations: [],
      retrievedChunkCount: 0,
    });

    return;
  }

  const context = buildContext(retrievedDocuments);

  const formattedPrompt = await ragPrompt.invoke({
    context,
    question: cleanQuestion,
  });

  const modelResponse = await llm.invoke(formattedPrompt);

  const answer = getResponseText(modelResponse).trim();

  response.status(200).json({
    success: true,
    question: cleanQuestion,

    answer: answer || "I don't know based on the uploaded documents.",

    citations: createCitations(retrievedDocuments),

    retrievedChunkCount: retrievedDocuments.length,
  });
}
