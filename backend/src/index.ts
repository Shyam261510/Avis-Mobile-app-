import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import singupRouter from "./routes/signup";
import loginRouter from "./routes/login";
import createMessageRouter from "./routes/createMessage";
import getMessagesRoute from "./routes/getMessages";
import getUserInfo from "./routes/getUserInfo";
import imageKitAuthRouter from "./routes/imagekit_auth";
import uploadDocumentRouter from "./routes/uploadDocument";
import getDocumentRouter from "./routes/getUploadedDocument";
import createProfileRouter from "./routes/create-profile";
import getProfileInfoRouter from "./routes/get-profile-info";

import { isUserExists } from "./middleware/isUserExit";

import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.API_URL!,
    credentials: true,
  })
);

const PORT = process.env.PORT!;

app.use("/api/signup", singupRouter);

app.use("/api/login", loginRouter);

app.use("/api/createMessage", isUserExists, createMessageRouter);

app.use("/api/getMessages", isUserExists, getMessagesRoute);

app.use("/api/getUserInfo", getUserInfo);

app.use("/api/imageKitAuth", imageKitAuthRouter);

app.use("/api/uploadDocument", isUserExists, uploadDocumentRouter);

app.use("/api/getDocuments", isUserExists, getDocumentRouter);

app.use("/api/create-profile", isUserExists, createProfileRouter);

app.use("/api/get-profile-info", isUserExists, getProfileInfoRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Internal server error ", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
