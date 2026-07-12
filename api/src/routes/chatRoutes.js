import { Router } from "express";

import { askQuestionController } from "../controllers/chatController.js";

const chatRouter = Router();

chatRouter.post("/ask", askQuestionController);

export default chatRouter;
