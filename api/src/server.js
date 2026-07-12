import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";

import cors from "cors";
import express from "express";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import documentRouter from "./routes/documentRoutes.js";
import healthRouter from "./routes/healthRoute.js";
import ragRouter from "./routes/ragRoutes.js";
import chatRouter from "./routes/chatRoutes.js";

const app = express();

const port = Number(process.env.PORT) || 5000;

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const uploadsDirectory = path.resolve("uploads");

// Upload folder available na ho to automatically banao
await fs.mkdir(uploadsDirectory, {
  recursive: true,
});

// React frontend ko API access do
app.use(
  cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "DELETE"],
  }),
);

// JSON body read karo
app.use(
  express.json({
    limit: "1mb",
  }),
);

// Main route
app.get("/", (request, response) => {
  response.status(200).json({
    success: true,
    name: "DocuMind RAG API",
    version: "1.0.0",
  });
});

// API routes
app.use("/api/health", healthRouter);

app.use("/api/documents", documentRouter);

app.use("/api/rag", ragRouter);

app.use("/api/chat", chatRouter);

// Unknown route handler
app.use(notFoundHandler);

// Error handler hamesha last me
app.use(errorHandler);

app.listen(port, () => {
  console.log("----------------------------------------");
  console.log("DocuMind RAG API started");
  console.log(`Server: http://localhost:${port}`);
  console.log(`Health: http://localhost:${port}/api/health`);
  console.log(`Documents: http://localhost:${port}/api/documents`);
  console.log(`Frontend allowed: ${frontendUrl}`);
  console.log("----------------------------------------");
});
