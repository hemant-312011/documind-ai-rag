const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5000";

export type ChatCitation = {
  id: string;
  fileName: string;
  storedName: string;
  pageNumber: number | null;
};

export type AskQuestionResponse = {
  success: boolean;
  question: string;
  answer: string;
  citations: ChatCitation[];
  retrievedChunkCount: number;
};

export type RagStatusResponse = {
  success: boolean;
  indexed: boolean;

  documents: Array<{
    storedName: string;
    name: string;
  }>;

  documentCount: number;
  pageCount: number;
  chunkCount: number;
};

export type IndexDocumentsResponse = {
  success: boolean;
  message: string;
  indexed?: boolean;
  documentCount: number;
  pageCount: number;
  chunkCount: number;
};

type ApiErrorResponse = {
  success?: boolean;
  code?: string;
  message?: string;
};

export class ApiRequestError extends Error {
  status: number;
  code?: string;

  constructor(
    message: string,
    status: number,
    code?: string,
  ) {
    super(message);

    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

async function readError(
  response: Response,
): Promise<ApiRequestError> {
  try {
    const data =
      (await response.json()) as ApiErrorResponse;

    return new ApiRequestError(
      data.message ??
        `Request failed with status ${response.status}.`,
      response.status,
      data.code,
    );
  } catch {
    return new ApiRequestError(
      `Request failed with status ${response.status}.`,
      response.status,
    );
  }
}

export async function fetchRagStatus(): Promise<RagStatusResponse> {
  const response = await fetch(
    `${API_URL}/api/rag/status`,
  );

  if (!response.ok) {
    throw await readError(response);
  }

  return (await response.json()) as RagStatusResponse;
}

export async function indexDocuments(): Promise<IndexDocumentsResponse> {
  const response = await fetch(
    `${API_URL}/api/rag/index`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw await readError(response);
  }

  return (await response.json()) as IndexDocumentsResponse;
}

export async function askDocumentQuestion(
  question: string,
): Promise<AskQuestionResponse> {
  const response = await fetch(
    `${API_URL}/api/chat/ask`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        question,
      }),
    },
  );

  if (!response.ok) {
    throw await readError(response);
  }

  return (await response.json()) as AskQuestionResponse;
}