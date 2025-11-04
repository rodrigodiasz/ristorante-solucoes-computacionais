import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import { router } from "./routes";
import {
  checkEnvironmentVariables,
  checkDirectories,
} from "./config/production";

dotenv.config();

checkEnvironmentVariables();
checkDirectories();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.USER_APP_URL].filter(
      (url): url is string => url !== undefined
    ),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200,
  })
);

app.use("/api", router);

app.use("/files", express.static(path.resolve(__dirname, "..", "tmp")));
app.use(
  "/files/uploads",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
