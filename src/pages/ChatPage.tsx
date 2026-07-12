import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Copy,
  FileText,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { Link } from "react-router-dom";

import { useDocuments } from "../hooks/useDocuments";

import {
  ApiRequestError,
  askDocumentQuestion,
  fetchRagStatus,
  indexDocuments,
} from "../services/chatApi";

import type { ChatMessage } from "../types/chat";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome-message",
    role: "assistant",
    content:
      "Hello! Upload your PDF documents and ask questions about their content. I will answer using retrieved document context and show source citations.",
    createdAt: new Date().toISOString(),
  },
];

function formatMessageTime(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export default function ChatPage() {
  const { documents } = useDocuments();

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const [question, setQuestion] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  const [isCheckingIndex, setIsCheckingIndex] = useState(true);

  const [isIndexing, setIsIndexing] = useState(false);

  const [isIndexed, setIsIndexed] = useState(false);

  const [pageError, setPageError] = useState<string | null>(null);

  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const readyDocuments = documents.filter(
    (document) => document.status === "ready",
  );

  const hasReadyDocuments = readyDocuments.length > 0;

  const checkIndexStatus = useCallback(async () => {
    setIsCheckingIndex(true);
    setPageError(null);

    try {
      const status = await fetchRagStatus();

      setIsIndexed(status.indexed);
    } catch (error) {
      setIsIndexed(false);

      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to check RAG index status.",
      );
    } finally {
      setIsCheckingIndex(false);
    }
  }, []);

  useEffect(() => {
    async function loadIndexStatus() {
      await checkIndexStatus();
    }

    void loadIndexStatus();
  }, [checkIndexStatus, documents.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isGenerating, isIndexing]);

  async function ensureDocumentsAreIndexed(): Promise<boolean> {
    if (isIndexed) {
      return true;
    }

    if (!hasReadyDocuments) {
      setPageError("Upload at least one PDF before asking a question.");

      return false;
    }

    setIsIndexing(true);
    setPageError(null);

    try {
      await indexDocuments();

      setIsIndexed(true);

      return true;
    } catch (error) {
      setIsIndexed(false);

      setPageError(
        error instanceof Error ? error.message : "Unable to index documents.",
      );

      return false;
    } finally {
      setIsIndexing(false);
    }
  }

  function resizeTextarea() {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    const nextHeight = Math.min(textarea.scrollHeight, 144);

    textarea.style.height = `${nextHeight}px`;
  }

  function resetTextareaHeight() {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "44px";
    }
  }

  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const cleanQuestion = question.trim();

    if (!cleanQuestion || isGenerating || isIndexing || isCheckingIndex) {
      return;
    }

    if (!hasReadyDocuments) {
      setPageError("Upload at least one PDF before asking a question.");

      return;
    }

    setPageError(null);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: cleanQuestion,
      createdAt: new Date().toISOString(),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);

    setQuestion("");
    resetTextareaHeight();

    const indexReady = await ensureDocumentsAreIndexed();

    if (!indexReady) {
      return;
    }

    setIsGenerating(true);

    try {
      let result;

      try {
        result = await askDocumentQuestion(cleanQuestion);
      } catch (error) {
        /*
         * Backend restart hone par MemoryVectorStore clear
         * ho sakta hai.
         *
         * Agar backend INDEX_REQUIRED bheje:
         * 1. Index dobara banao
         * 2. Same question dobara bhejo
         */
        if (
          error instanceof ApiRequestError &&
          error.code === "INDEX_REQUIRED"
        ) {
          setIsIndexed(false);
          setIsIndexing(true);

          await indexDocuments();

          setIsIndexed(true);
          setIsIndexing(false);

          result = await askDocumentQuestion(cleanQuestion);
        } else {
          throw error;
        }
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.answer,
        createdAt: new Date().toISOString(),

        sources: result.citations.map((citation) => ({
          id: citation.id,
          fileName: citation.fileName,
          storedName: citation.storedName,
          pageNumber: citation.pageNumber,
        })),
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to generate an answer.";

      const assistantErrorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: message,
        createdAt: new Date().toISOString(),
        isError: true,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantErrorMessage,
      ]);

      if (error instanceof ApiRequestError && error.code === "INDEX_REQUIRED") {
        setIsIndexed(false);
      }
    } finally {
      setIsGenerating(false);
      setIsIndexing(false);
      textareaRef.current?.focus();
    }
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();

      void handleSubmit();
    }
  }

  function clearConversation() {
    const shouldClear = window.confirm(
      "Are you sure you want to clear this conversation?",
    );

    if (!shouldClear) {
      return;
    }

    setMessages(initialMessages);
    setQuestion("");
    setPageError(null);

    resetTextareaHeight();
  }

  async function copyMessage(messageId: string, content: string) {
    try {
      await navigator.clipboard.writeText(content);

      setCopiedMessageId(messageId);

      window.setTimeout(() => {
        setCopiedMessageId(null);
      }, 1800);
    } catch {
      setCopiedMessageId(null);
    }
  }

  const isBusy = isGenerating || isIndexing || isCheckingIndex;

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="glass-panel mx-auto flex min-h-[78vh] max-w-7xl flex-col overflow-hidden rounded-[2rem]">
        <header className="flex flex-col gap-4 border-b border-indigo-100 bg-white/65 p-5 dark:border-white/10 dark:bg-slate-900/65 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950/50">
              <Bot size={24} />
            </span>

            <div>
              <h1 className="font-bold text-slate-950 dark:text-white">
                DocuMind Assistant
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <span
                  className={[
                    "size-2 rounded-full",
                    isIndexed
                      ? "bg-emerald-500"
                      : hasReadyDocuments
                        ? "bg-amber-500"
                        : "bg-red-500",
                  ].join(" ")}
                />

                <span className="text-slate-500 dark:text-slate-400">
                  {isCheckingIndex
                    ? "Checking RAG index..."
                    : isIndexing
                      ? "Indexing documents..."
                      : isIndexed
                        ? `${readyDocuments.length} document${
                            readyDocuments.length === 1 ? "" : "s"
                          } indexed`
                        : hasReadyDocuments
                          ? "Documents ready for indexing"
                          : "No documents uploaded"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {hasReadyDocuments && !isIndexed && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => {
                  void ensureDocumentsAreIndexed();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-400/20 dark:bg-slate-950 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
              >
                {isIndexing ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <RefreshCw size={17} />
                )}

                {isIndexing ? "Indexing..." : "Build index"}
              </button>
            )}

            <button
              type="button"
              disabled={messages.length === 1 || isGenerating}
              onClick={clearConversation}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <RotateCcw size={17} />
              Clear conversation
            </button>
          </div>
        </header>

        {pageError && (
          <div className="border-b border-red-200 bg-red-50 px-5 py-4 dark:border-red-500/20 dark:bg-red-500/10">
            <div className="mx-auto flex max-w-4xl items-start gap-3">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-red-600 dark:text-red-300"
              />

              <p className="flex-1 text-sm font-medium text-red-800 dark:text-red-200">
                {pageError}
              </p>

              <button
                type="button"
                onClick={() => setPageError(null)}
                aria-label="Close error"
                className="rounded-lg p-1 text-red-700 transition hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-500/10"
              >
                <X size={17} />
              </button>
            </div>
          </div>
        )}

        {!hasReadyDocuments && (
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-500/20 dark:bg-amber-500/10">
            <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <FileText
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-300"
                />

                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    Upload a PDF to start chatting
                  </p>

                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-200/80">
                    DocuMind needs at least one PDF document before it can
                    generate grounded answers.
                  </p>
                </div>
              </div>

              <Link
                to="/upload"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400"
              >
                Upload PDF
              </Link>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-4xl space-y-7">
            {messages.map((message) => {
              const isAssistant = message.role === "assistant";

              return (
                <article
                  key={message.id}
                  className={[
                    "flex gap-3 sm:gap-4",
                    isAssistant ? "justify-start" : "justify-end",
                  ].join(" ")}
                >
                  {isAssistant && (
                    <span
                      className={[
                        "flex size-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-md",
                        message.isError
                          ? "bg-red-500"
                          : "bg-gradient-to-br from-indigo-600 to-sky-500 shadow-indigo-200 dark:shadow-indigo-950/40",
                      ].join(" ")}
                    >
                      {message.isError ? (
                        <AlertCircle size={19} />
                      ) : (
                        <Bot size={19} />
                      )}
                    </span>
                  )}

                  <div className="max-w-[88%] sm:max-w-[78%]">
                    <div
                      className={[
                        "rounded-3xl px-5 py-4 shadow-sm",
                        isAssistant
                          ? message.isError
                            ? "rounded-tl-md border border-red-200 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200"
                            : "rounded-tl-md border border-indigo-100 bg-white text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
                          : "rounded-tr-md bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950/40",
                      ].join(" ")}
                    >
                      <p className="whitespace-pre-wrap leading-7">
                        {message.content}
                      </p>
                    </div>

                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                          Sources
                        </p>

                        {message.sources.map((source) => (
                          <div
                            key={source.id}
                            className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-sm dark:border-indigo-400/15 dark:bg-indigo-500/10"
                          >
                            <FileText
                              size={17}
                              className="shrink-0 text-indigo-600 dark:text-indigo-300"
                            />

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                                {source.fileName}
                              </p>

                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {source.pageNumber
                                  ? `Page ${source.pageNumber}`
                                  : "Page unavailable"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      className={[
                        "mt-2 flex items-center gap-2 px-1 text-xs text-slate-400",
                        isAssistant ? "justify-start" : "justify-end",
                      ].join(" ")}
                    >
                      <span>{formatMessageTime(message.createdAt)}</span>

                      {isAssistant && !message.isError && message.content && (
                        <button
                          type="button"
                          onClick={() => {
                            void copyMessage(message.id, message.content);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-white/10 dark:hover:text-indigo-300"
                        >
                          {copiedMessageId === message.id ? (
                            <>
                              <CheckCircle2 size={13} />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              Copy
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isAssistant && (
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900">
                      <User size={19} />
                    </span>
                  )}
                </article>
              );
            })}

            {(isGenerating || isIndexing) && (
              <div className="flex items-center gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white">
                  <Bot size={19} />
                </span>

                <div className="flex items-center gap-3 rounded-3xl rounded-tl-md border border-indigo-100 bg-white px-5 py-4 dark:border-white/10 dark:bg-slate-900">
                  <LoaderCircle
                    size={18}
                    className="animate-spin text-indigo-600 dark:text-indigo-300"
                  />

                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {isIndexing
                      ? "Indexing PDF documents..."
                      : "Searching documents and generating answer..."}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="border-t border-indigo-100 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/70 sm:p-5"
        >
          <div className="mx-auto max-w-4xl">
            <div className="flex items-end gap-3 rounded-3xl border border-indigo-100 bg-white p-3 shadow-lg shadow-indigo-100/60 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100 dark:border-white/10 dark:bg-slate-950 dark:shadow-slate-950/30 dark:focus-within:border-indigo-400 dark:focus-within:ring-indigo-500/10">
              <textarea
                ref={textareaRef}
                value={question}
                rows={1}
                maxLength={2000}
                placeholder={
                  hasReadyDocuments
                    ? "Ask something about your PDF documents..."
                    : "Upload a PDF before asking questions..."
                }
                onChange={(event) => {
                  setQuestion(event.target.value);
                  resizeTextarea();
                }}
                onKeyDown={handleTextareaKeyDown}
                disabled={isBusy || !hasReadyDocuments}
                className="min-h-11 max-h-36 flex-1 resize-none bg-transparent px-2 py-2.5 leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-white dark:placeholder:text-slate-600"
              />

              <button
                type="submit"
                disabled={!question.trim() || isBusy || !hasReadyDocuments}
                className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 dark:bg-indigo-500 dark:shadow-indigo-950/40 dark:hover:bg-indigo-400"
                aria-label="Send message"
              >
                {isBusy ? (
                  <LoaderCircle size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>

            <div className="mt-3 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p>Enter to send · Shift + Enter for a new line</p>

              <p className="inline-flex items-center gap-1.5">
                <Sparkles size={13} />
                Answers are grounded in uploaded PDFs
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
