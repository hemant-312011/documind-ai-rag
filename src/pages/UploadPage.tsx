import {
  AlertCircle,
  CheckCircle2,
  FileText,
  FileUp,
  LoaderCircle,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

import { useDocuments } from "../hooks/useDocuments";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 5;

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [deletingDocumentName, setDeletingDocumentName] =
    useState<string | null>(null);

  const {
    documents,
    uploadDocuments,
    removeDocument,
    isUploading,
    error,
    clearError,
  } = useDocuments();

  function showToast(toastData: ToastState) {
    setToast(toastData);

    window.setTimeout(() => {
      setToast(null);
    }, 3500);
  }

  async function validateAndUploadFiles(
    selectedFiles: File[],
  ) {
    if (selectedFiles.length === 0) {
      return;
    }

    if (selectedFiles.length > MAX_FILES_PER_UPLOAD) {
      showToast({
        type: "error",
        message: "You can upload a maximum of 5 PDFs at one time.",
      });

      return;
    }

    const validFiles: File[] = [];

    let invalidTypeCount = 0;
    let oversizedCount = 0;
    let duplicateCount = 0;

    selectedFiles.forEach((file) => {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        invalidTypeCount += 1;
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        oversizedCount += 1;
        return;
      }

      const alreadyUploaded = documents.some(
        (document) =>
          document.name === file.name &&
          document.size === file.size,
      );

      const alreadySelected = validFiles.some(
        (validFile) =>
          validFile.name === file.name &&
          validFile.size === file.size,
      );

      if (alreadyUploaded || alreadySelected) {
        duplicateCount += 1;
        return;
      }

      validFiles.push(file);
    });

    if (invalidTypeCount > 0) {
      showToast({
        type: "error",
        message: "Only PDF files are allowed.",
      });

      return;
    }

    if (oversizedCount > 0) {
      showToast({
        type: "error",
        message: "Each PDF must be smaller than 10 MB.",
      });

      return;
    }

    if (duplicateCount > 0 && validFiles.length === 0) {
      showToast({
        type: "error",
        message: "Selected PDF is already uploaded.",
      });

      return;
    }

    if (validFiles.length === 0) {
      return;
    }

    try {
      const uploadedDocuments =
        await uploadDocuments(validFiles);

      showToast({
        type: "success",
        message: `${uploadedDocuments.length} PDF${
          uploadedDocuments.length === 1 ? "" : "s"
        } uploaded successfully.`,
      });
    } catch (uploadError) {
      showToast({
        type: "error",
        message:
          uploadError instanceof Error
            ? uploadError.message
            : "PDF upload failed.",
      });
    }
  }

  function handleFileInputChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFiles = Array.from(
      event.target.files ?? [],
    );

    void validateAndUploadFiles(selectedFiles);

    event.target.value = "";
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (!isUploading) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (isUploading) {
      return;
    }

    const droppedFiles = Array.from(
      event.dataTransfer.files,
    );

    void validateAndUploadFiles(droppedFiles);
  }

  function openFilePicker() {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }

  async function handleRemoveDocument(
    storedName: string,
  ) {
    setDeletingDocumentName(storedName);

    try {
      await removeDocument(storedName);

      showToast({
        type: "success",
        message: "Document deleted successfully.",
      });
    } catch (deleteError) {
      showToast({
        type: "error",
        message:
          deleteError instanceof Error
            ? deleteError.message
            : "Unable to delete document.",
      });
    } finally {
      setDeletingDocumentName(null);
    }
  }

  return (
    <section className="relative px-6 py-14 sm:py-16">
      {toast && (
        <div
          className={[
            "fixed right-5 top-24 z-[60] flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl",
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50/95 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-950/90 dark:text-emerald-100"
              : "border-red-200 bg-red-50/95 text-red-900 dark:border-red-500/20 dark:bg-red-950/90 dark:text-red-100",
          ].join(" ")}
          role="status"
        >
          {toast.type === "success" ? (
            <CheckCircle2
              className="mt-0.5 shrink-0"
              size={20}
            />
          ) : (
            <AlertCircle
              className="mt-0.5 shrink-0"
              size={20}
            />
          )}

          <p className="flex-1 text-sm font-medium">
            {toast.message}
          </p>

          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Close notification"
            className="rounded-lg p-1 transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="font-semibold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">
            Knowledge ingestion
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Build your document knowledge base
          </h1>

          <p className="mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-400">
            Upload one or more PDF documents. Files will be
            stored securely by the DocuMind API and prepared for
            the RAG pipeline.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

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

        <div className="glass-panel mt-10 rounded-[2rem] p-4 sm:p-7">
          <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={[
              "flex min-h-80 flex-col items-center justify-center rounded-[1.6rem] border-2 border-dashed px-6 text-center transition duration-200",
              isDragging
                ? "scale-[1.01] border-indigo-500 bg-indigo-100/80 shadow-xl shadow-indigo-100 dark:border-indigo-400 dark:bg-indigo-500/15 dark:shadow-indigo-950/30"
                : "border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:border-indigo-400/25 dark:from-indigo-500/10 dark:via-slate-900/50 dark:to-sky-500/5",
              isUploading
                ? "cursor-not-allowed opacity-75"
                : "",
            ].join(" ")}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              multiple
              disabled={isUploading}
              className="hidden"
              onChange={handleFileInputChange}
            />

            <span className="flex size-20 items-center justify-center rounded-[1.7rem] bg-white text-indigo-600 shadow-xl shadow-indigo-100 ring-1 ring-indigo-100 transition dark:bg-slate-900 dark:text-indigo-300 dark:shadow-slate-950/50 dark:ring-white/10">
              {isUploading ? (
                <LoaderCircle
                  size={38}
                  className="animate-spin"
                />
              ) : (
                <UploadCloud size={38} />
              )}
            </span>

            <h2 className="mt-7 text-2xl font-bold text-slate-950 dark:text-white">
              {isUploading
                ? "Uploading your PDFs"
                : isDragging
                  ? "Drop your PDFs here"
                  : "Drag and drop PDF files"}
            </h2>

            <p className="mt-3 max-w-md leading-7 text-slate-600 dark:text-slate-400">
              Select up to five PDF files. Each file must be
              smaller than 10 MB.
            </p>

            <button
              type="button"
              onClick={openFilePicker}
              disabled={isUploading}
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:bg-indigo-500 dark:shadow-indigo-950/40 dark:hover:bg-indigo-400"
            >
              {isUploading ? (
                <>
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                  Uploading PDFs...
                </>
              ) : (
                <>
                  <FileUp size={19} />
                  Browse PDFs
                </>
              )}
            </button>

            <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-500">
              PDF only · Maximum 5 files · 10 MB per file
            </p>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
                Document queue
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                Uploaded documents
              </h2>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {documents.length} document
              {documents.length === 1 ? "" : "s"}
            </p>
          </div>

          {documents.length === 0 ? (
            <div className="glass-panel mt-6 flex min-h-56 flex-col items-center justify-center rounded-3xl p-8 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                <FileText size={28} />
              </span>

              <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                No PDFs uploaded yet
              </h3>

              <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">
                Uploaded PDF documents will appear here and will
                remain available after refreshing the browser.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {documents.map((document) => {
                const isDeleting =
                  deletingDocumentName ===
                  document.storedName;

                return (
                  <article
                    key={document.id}
                    className="glass-panel rounded-3xl p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20">
                        <FileText size={27} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <h3
                              className="truncate font-semibold text-slate-900 dark:text-white"
                              title={document.name}
                            >
                              {document.name}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {formatFileSize(document.size)}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                              <CheckCircle2 size={14} />
                              Ready
                            </span>

                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => {
                                void handleRemoveDocument(
                                  document.storedName,
                                );
                              }}
                              className="flex size-9 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-500/10"
                              aria-label={`Remove ${document.name}`}
                              title="Remove document"
                            >
                              {isDeleting ? (
                                <LoaderCircle
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between text-xs font-medium">
                            <span className="text-slate-500 dark:text-slate-400">
                              Stored by DocuMind API
                            </span>

                            <span className="text-indigo-600 dark:text-indigo-300">
                              100%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-indigo-100 dark:bg-white/10">
                            <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-600 to-sky-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}