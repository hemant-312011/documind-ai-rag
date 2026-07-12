import crypto from "node:crypto";
import path from "node:path";

import multer from "multer";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

const uploadsDirectory = path.resolve("uploads");

function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

const storage = multer.diskStorage({
  destination(request, file, callback) {
    callback(null, uploadsDirectory);
  },

  filename(request, file, callback) {
    const safeOriginalName = sanitizeFileName(file.originalname);

    const uniqueFileName = `${crypto.randomUUID()}-${safeOriginalName}`;

    callback(null, uniqueFileName);
  },
});

function pdfFileFilter(request, file, callback) {
  const hasPdfMimeType = file.mimetype === "application/pdf";

  const hasPdfExtension =
    path.extname(file.originalname).toLowerCase() === ".pdf";

  if (!hasPdfMimeType || !hasPdfExtension) {
    const error = new Error("Only PDF files are allowed.");

    error.statusCode = 400;

    callback(error);
    return;
  }

  callback(null, true);
}

export const uploadDocuments = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
}).array("documents", MAX_FILES);
