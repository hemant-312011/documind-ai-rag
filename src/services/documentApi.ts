import type { UploadedDocument } from "../types/document";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5000";

type ApiDocument = {
  id: string;
  name: string;
  storedName: string;
  size: number;
  mimeType?: string;
  uploadedAt: string;
  status: "ready";
};

type DocumentsResponse = {
  success: boolean;
  count: number;
  documents: ApiDocument[];
};

type UploadDocumentsResponse = {
  success: boolean;
  message: string;
  documents: ApiDocument[];
};

type ErrorResponse = {
  success?: boolean;
  message?: string;
};

function convertApiDocument(
  document: ApiDocument,
): UploadedDocument {
  return {
    ...document,
    progress: 100,
  };
}

async function getErrorMessage(
  response: Response,
): Promise<string> {
  try {
    const errorData =
      (await response.json()) as ErrorResponse;

    return (
      errorData.message ??
      `Request failed with status ${response.status}.`
    );
  } catch {
    return `Request failed with status ${response.status}.`;
  }
}

// Backend se uploaded PDFs ki list lao
export async function fetchDocuments(): Promise<
  UploadedDocument[]
> {
  const response = await fetch(
    `${API_URL}/api/documents`,
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const data =
    (await response.json()) as DocumentsResponse;

  return data.documents.map(convertApiDocument);
}

// Backend par PDFs upload karo
export async function uploadPdfDocuments(
  files: File[],
): Promise<UploadedDocument[]> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("documents", file);
  });

  const response = await fetch(
    `${API_URL}/api/documents/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const data =
    (await response.json()) as UploadDocumentsResponse;

  return data.documents.map(convertApiDocument);
}

// Backend se ek PDF delete karo
export async function deletePdfDocument(
  storedName: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/documents/${encodeURIComponent(
      storedName,
    )}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

// Backend se saari PDFs delete karo
export async function clearPdfDocuments(): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/documents`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}