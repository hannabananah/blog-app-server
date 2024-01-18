import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
const { MONGO_USER, MONGO_PASS, PORT } = process.env;
import cookieParser from "cookie-parser";

import boardRouter from "./src/routes/boards";
import CustomError from "./src/utils/CustomError";

import userController from "./src/controllers/users.controller";

const app = express();

mongoose.connect(
  `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.tucprjn.mongodb.net/?retryWrites=true&w=majority`
);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.post("/login", userController.login);
app.get("/accesstoken", userController.accessToken);
app.get("/refreshtoken", userController.refreshToken);
app.get("/login/success", userController.loginSuccess);
app.post("/logout", userController.logout);

app.use("/api/boards", boardRouter);
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode);
  res.json({
    status: "error",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
