import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearPdfDocuments,
  deletePdfDocument,
  fetchDocuments,
  uploadPdfDocuments,
} from "../services/documentApi";

import type { UploadedDocument } from "../types/document";

import { DocumentsContext } from "./DocumentsContext";

type DocumentsProviderProps = {
  children: ReactNode;
};

export default function DocumentsProvider({
  children,
}: DocumentsProviderProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isUploading, setIsUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const refreshDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const backendDocuments = await fetchDocuments();

      setDocuments(backendDocuments);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to load documents.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshDocuments();
  }, [refreshDocuments]);

  async function uploadDocuments(files: File[]): Promise<UploadedDocument[]> {
    setIsUploading(true);
    setError(null);

    try {
      const uploadedDocuments = await uploadPdfDocuments(files);

      setDocuments((currentDocuments) => [
        ...uploadedDocuments,
        ...currentDocuments,
      ]);

      return uploadedDocuments;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to upload documents.";

      setError(message);

      throw new Error(message);
    } finally {
      setIsUploading(false);
    }
  }

  async function removeDocument(storedName: string): Promise<void> {
    setError(null);

    try {
      await deletePdfDocument(storedName);

      setDocuments((currentDocuments) =>
        currentDocuments.filter(
          (document) => document.storedName !== storedName,
        ),
      );
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to delete document.";

      setError(message);

      throw new Error(message);
    }
  }

  async function clearDocuments(): Promise<void> {
    setError(null);

    try {
      await clearPdfDocuments();

      setDocuments([]);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to clear documents.";

      setError(message);

      throw new Error(message);
    }
  }

  function clearError() {
    setError(null);
  }

  const contextValue = useMemo(
    () => ({
      documents,
      isLoading,
      isUploading,
      error,
      uploadDocuments,
      removeDocument,
      clearDocuments,
      refreshDocuments,
      clearError,
    }),
    [documents, error, isLoading, isUploading, refreshDocuments],
  );

  return (
    <DocumentsContext.Provider value={contextValue}>
      {children}
    </DocumentsContext.Provider>
  );
}
