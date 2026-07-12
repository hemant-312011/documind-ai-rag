import {
  AlertCircle,
  CheckCircle2,
  FileSearch,
  FileText,
  Files,
  LoaderCircle,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useDocuments } from "../hooks/useDocuments";

function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatUploadDate(dateString: string): string {
  const uploadDate = new Date(dateString);

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(uploadDate);
}

export default function DocumentsPage() {
  const {
    documents,
    removeDocument,
    clearDocuments,
    refreshDocuments,
    isLoading,
    error,
    clearError,
  } = useDocuments();

  const [searchQuery, setSearchQuery] = useState("");
  const [isClearing, setIsClearing] = useState(false);
  const [deletingDocumentName, setDeletingDocumentName] = useState<
    string | null
  >(null);

  const filteredDocuments = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    if (!normalizedSearchQuery) {
      return documents;
    }

    return documents.filter((document) =>
      document.name.toLowerCase().includes(normalizedSearchQuery),
    );
  }, [documents, searchQuery]);

  const readyDocumentsCount = documents.filter(
    (document) => document.status === "ready",
  ).length;

  const totalStorageSize = documents.reduce(
    (totalSize, document) => totalSize + document.size,
    0,
  );

  async function handleDeleteDocument(storedName: string) {
    setDeletingDocumentName(storedName);

    try {
      await removeDocument(storedName);
    } catch {
      // Error DocumentsContext me save ho jayega.
    } finally {
      setDeletingDocumentName(null);
    }
  }

  async function handleClearAllDocuments() {
    const shouldClear = window.confirm(
      "Are you sure you want to permanently remove all documents?",
    );

    if (!shouldClear) {
      return;
    }

    setIsClearing(true);

    try {
      await clearDocuments();
      setSearchQuery("");
    } catch {
      // Error DocumentsContext me save ho jayega.
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <section className="px-6 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-semibold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">
              Document library
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Manage your knowledge base
            </h1>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              View, search and permanently manage PDF files stored by the
              DocuMind backend API.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                void refreshDocuments();
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-white px-5 py-3 font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-400/20 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
            >
              <RefreshCw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            {documents.length > 0 && (
              <button
                type="button"
                disabled={isClearing}
                onClick={() => {
                  void handleClearAllDocuments();
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-500/10"
              >
                {isClearing ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}

                {isClearing ? "Clearing..." : "Clear all"}
              </button>
            )}

            <Link
              to="/upload"
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 dark:bg-indigo-500 dark:shadow-indigo-950/40 dark:hover:bg-indigo-400"
            >
              <FileText size={18} />
              Upload PDFs
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />

              <p className="text-sm font-medium">{error}</p>
            </div>

            <button
              type="button"
              onClick={clearError}
              aria-label="Close error"
              className="rounded-lg p-1 transition hover:bg-red-100 dark:hover:bg-red-500/10"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <article className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                <Files size={24} />
              </span>

              <span className="text-3xl font-bold text-slate-950 dark:text-white">
                {documents.length}
              </span>
            </div>

            <p className="mt-5 font-semibold text-slate-900 dark:text-white">
              Total documents
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              PDFs stored by the backend
            </p>
          </article>

          <article className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CheckCircle2 size={24} />
              </span>

              <span className="text-3xl font-bold text-slate-950 dark:text-white">
                {readyDocumentsCount}
              </span>
            </div>

            <p className="mt-5 font-semibold text-slate-900 dark:text-white">
              Ready documents
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Available for RAG indexing
            </p>
          </article>

          <article className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
                <FileText size={24} />
              </span>

              <span className="text-2xl font-bold text-slate-950 dark:text-white">
                {formatFileSize(totalStorageSize)}
              </span>
            </div>

            <p className="mt-5 font-semibold text-slate-900 dark:text-white">
              Storage used
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Total PDF file size
            </p>
          </article>
        </div>

        <div className="glass-panel mt-8 rounded-3xl p-4 sm:p-5">
          <div className="relative">
            <Search
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search documents by file name..."
              className="w-full rounded-2xl border border-indigo-100 bg-white py-3.5 pl-12 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/10"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {isLoading && documents.length === 0 ? (
          <div className="glass-panel mt-8 flex min-h-96 flex-col items-center justify-center rounded-[2rem] p-8 text-center">
            <LoaderCircle
              size={42}
              className="animate-spin text-indigo-600 dark:text-indigo-300"
            />

            <h2 className="mt-6 text-xl font-bold text-slate-950 dark:text-white">
              Loading documents
            </h2>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Fetching your document library from the backend.
            </p>
          </div>
        ) : documents.length === 0 ? (
          <div className="glass-panel mt-8 flex min-h-96 flex-col items-center justify-center rounded-[2rem] p-8 text-center">
            <span className="flex size-20 items-center justify-center rounded-[1.7rem] bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Files size={38} />
            </span>

            <h2 className="mt-7 text-2xl font-bold text-slate-950 dark:text-white">
              Your document library is empty
            </h2>

            <p className="mt-3 max-w-lg leading-7 text-slate-600 dark:text-slate-400">
              Upload PDF documents to create a persistent and searchable
              knowledge base.
            </p>

            <Link
              to="/upload"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 dark:bg-indigo-500 dark:shadow-indigo-950/40 dark:hover:bg-indigo-400"
            >
              <FileText size={19} />
              Upload your first PDF
            </Link>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="glass-panel mt-8 flex min-h-72 flex-col items-center justify-center rounded-3xl p-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300">
              <FileSearch size={31} />
            </span>

            <h2 className="mt-6 text-xl font-bold text-slate-950 dark:text-white">
              No matching documents
            </h2>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Try searching with a different PDF file name.
            </p>

            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-6 rounded-2xl border border-indigo-200 bg-white px-5 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-400/20 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {filteredDocuments.map((document) => {
              const isDeleting = deletingDocumentName === document.storedName;

              return (
                <article
                  key={document.id}
                  className="glass-panel rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-400/40 sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20">
                      <FileText size={27} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2
                            className="truncate font-semibold text-slate-950 dark:text-white"
                            title={document.name}
                          >
                            {document.name}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {formatFileSize(document.size)}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => {
                            void handleDeleteDocument(document.storedName);
                          }}
                          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-500/10"
                          aria-label={`Delete ${document.name}`}
                          title="Delete document"
                        >
                          {isDeleting ? (
                            <LoaderCircle size={17} className="animate-spin" />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <CheckCircle2 size={14} />
                          Ready
                        </span>

                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                          PDF
                        </span>
                      </div>

                      <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                        Uploaded {formatUploadDate(document.uploadedAt)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
