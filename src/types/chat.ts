export type MessageRole =
  | "user"
  | "assistant";

export type MessageSource = {
  id: string;
  fileName: string;
  storedName: string;
  pageNumber: number | null;
};

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  sources?: MessageSource[];
  isError?: boolean;
};