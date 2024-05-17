import { Router } from "express";

import { signup, login } from "../controllers/authController.js";
import {
  attachDbClient,
  releaseDbClient,
} from "../middlewares/dbMiddleware.js";

const authRouter = Router();

authRouter.post("/signup", attachDbClient, signup, releaseDbClient);
authRouter.post("/login", attachDbClient, login, releaseDbClient);

export default authRouter;
