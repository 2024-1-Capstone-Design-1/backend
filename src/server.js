import dotenv from 'dotenv';
dotenv.config();

console.log('Database configuration:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_PORT:', process.env.DB_PORT);

// 나머지 코드...




import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import logger from "./utils/logger.js";
import specs from "./swagger/swagger.js";
import { initDatabase } from "./configs/db.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import blogRouter from "./routes/blogRoute.js";
import templateRouter from "./routes/templateRoute.js";
import commentRouter from "./routes/commentRoute.js"; // 댓글 라우터 추가

const app = express();
const port = 3001;

app.use(morgan("dev"));

app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.use("/template", templateRouter);
app.use("/comments", commentRouter); // 댓글 라우터 사용

app.get("/", (req, res) => {
  res.send("Hello World!");
});

await initDatabase();

app.listen(port, () => {
  logger.info(`App listening on http://localhost:${port}`);
});
