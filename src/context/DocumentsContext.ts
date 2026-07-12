import { createContext } from "react";

import type { UploadedDocument } from "../types/document";

export type DocumentsContextValue = {
  documents: UploadedDocument[];

  isLoading: boolean;
  isUploading: boolean;

  error: string | null;

  uploadDocuments: (
    files: File[],
  ) => Promise<UploadedDocument[]>;

  removeDocument: (
    storedName: string,
  ) => Promise<void>;

  clearDocuments: () => Promise<void>;

  refreshDocuments: () => Promise<void>;

  clearError: () => void;
};

export const DocumentsContext =
  createContext<DocumentsContextValue | undefined>(
    undefined,
  );