import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/", (request, response) => {
  response.status(200).json({
    success: true,
    message: "DocuMind RAG API is running.",
    timestamp: new Date().toISOString(),
  });
});

export default healthRouter;