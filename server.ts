import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
const { MONGO_USER, MONGO_PASS } = process.env;
const port = 4500;

import boardRouter from "./src/routes/boards";
import CustomError from "./src/utils/CustomError";

const app = express();

mongoose.connect(
  `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.tucprjn.mongodb.net/?retryWrites=true&w=majority`
);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/boards", boardRouter);
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode);
  res.json({
    status: "error",
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
