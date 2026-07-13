import { Router } from "express";

import {
  getIndexStatusController,
  indexDocumentsController,
  testRetrievalController,
} from "../controllers/ragController.js";

const ragRouter = Router();

ragRouter.get("/status", getIndexStatusController);

ragRouter.post("/index", indexDocumentsController);

ragRouter.post("/retrieve", testRetrievalController);

export default ragRouter;
