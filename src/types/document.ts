export type DocumentStatus =
  | "uploading"
  | "ready"
  | "error";

export type UploadedDocument = {
  id: string;
  name: string;
  storedName: string;
  size: number;
  uploadedAt: string;
  progress: number;
  status: DocumentStatus;
  mimeType?: string;
  file?: File;
};