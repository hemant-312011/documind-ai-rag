import { Router } from "express";

import { uploadDocuments } from "../config/upload.js";

import {
  clearDocumentsController,
  deleteDocumentController,
  getDocumentsController,
  uploadDocumentsController,
} from "../controllers/documentController.js";

const documentRouter = Router();

// Saare uploaded documents lao
documentRouter.get("/", getDocumentsController);

// PDFs upload karo
documentRouter.post("/upload", uploadDocuments, uploadDocumentsController);

// Saare documents delete karo
documentRouter.delete("/", clearDocumentsController);

// Ek document delete karo
documentRouter.delete("/:storedName", deleteDocumentController);

export default documentRouter;
