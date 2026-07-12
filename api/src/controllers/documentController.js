import fs from "node:fs/promises";
import path from "node:path";

import { clearRagStore } from "../rag/ragStore.js";

const uploadsDirectory = path.resolve("uploads");

function getOriginalName(storedFileName) {
  const uuidPrefixLength = 37;

  if (storedFileName.length <= uuidPrefixLength) {
    return storedFileName;
  }

  return storedFileName.slice(uuidPrefixLength);
}

export async function uploadDocumentsController(request, response) {
  const uploadedFiles = request.files ?? [];

  if (uploadedFiles.length === 0) {
    response.status(400).json({
      success: false,
      message: "Please select at least one PDF file.",
    });

    return;
  }

  /*
   * Nayi PDF upload hone ke baad purana vector index stale
   * ho jata hai, isliye memory index clear kar rahe hain.
   */
  clearRagStore();

  const uploadedAt = new Date().toISOString();

  const documents = uploadedFiles.map((file) => ({
    id: file.filename,
    name: file.originalname,
    storedName: file.filename,
    size: file.size,
    mimeType: file.mimetype,
    uploadedAt,
    status: "ready",
  }));

  response.status(201).json({
    success: true,
    message: `${documents.length} PDF${
      documents.length === 1 ? "" : "s"
    } uploaded successfully.`,
    documents,
  });
}

export async function getDocumentsController(request, response) {
  const storedFiles = await fs.readdir(uploadsDirectory);

  const pdfFiles = storedFiles.filter((fileName) =>
    fileName.toLowerCase().endsWith(".pdf"),
  );

  const documents = await Promise.all(
    pdfFiles.map(async (storedName) => {
      const filePath = path.join(uploadsDirectory, storedName);

      const fileStats = await fs.stat(filePath);

      return {
        id: storedName,
        name: getOriginalName(storedName),
        storedName,
        size: fileStats.size,
        mimeType: "application/pdf",
        uploadedAt: fileStats.birthtime.toISOString(),
        status: "ready",
      };
    }),
  );

  documents.sort(
    (firstDocument, secondDocument) =>
      new Date(secondDocument.uploadedAt).getTime() -
      new Date(firstDocument.uploadedAt).getTime(),
  );

  response.status(200).json({
    success: true,
    count: documents.length,
    documents,
  });
}

export async function deleteDocumentController(request, response) {
  const { storedName } = request.params;

  const safeFileName = path.basename(storedName);

  if (
    safeFileName !== storedName ||
    !safeFileName.toLowerCase().endsWith(".pdf")
  ) {
    response.status(400).json({
      success: false,
      message: "Invalid document name.",
    });

    return;
  }

  const filePath = path.join(uploadsDirectory, safeFileName);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      response.status(404).json({
        success: false,
        message: "Document not found.",
      });

      return;
    }

    throw error;
  }

  clearRagStore();

  response.status(200).json({
    success: true,
    message: "Document deleted successfully.",
    documentId: safeFileName,
  });
}

export async function clearDocumentsController(request, response) {
  const storedFiles = await fs.readdir(uploadsDirectory);

  const pdfFiles = storedFiles.filter((fileName) =>
    fileName.toLowerCase().endsWith(".pdf"),
  );

  await Promise.all(
    pdfFiles.map((fileName) =>
      fs.unlink(path.join(uploadsDirectory, fileName)),
    ),
  );

  clearRagStore();

  response.status(200).json({
    success: true,
    message: "All documents deleted successfully.",
    deletedCount: pdfFiles.length,
  });
}
