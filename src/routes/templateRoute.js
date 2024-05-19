import { Router } from "express";

import {
  attachDbClient,
  releaseDbClient,
} from "../middlewares/dbMiddleware.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import { create } from "../controllers/templateController.js";
const templateRouter = Router();

templateRouter.post(
  "/create",
  authenticateToken,
  attachDbClient,
  create,
  releaseDbClient
);

export default templateRouter;
