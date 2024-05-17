import { Router } from "express";

import { signup } from "../controllers/authController.js";
import {
  attachDbClient,
  releaseDbClient,
} from "../middlewares/dbMiddleware.js";

const authRouter = Router();

authRouter.post("/signup", attachDbClient, signup, releaseDbClient);
authRouter.post("/login");

export default authRouter;
