import express from "express";
import dotenv from "dotenv";
import singupRouter from "./routes/signup";
import loginRouter from "./routes/login";
import createMessageRouter from "./routes/createMessage";
import createBotPressUserRouter from "./routes/createBotPressUser";
import getUserInfo from "./routes/getUserInfo";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://192.168.1.13:8081/",
  })
);

const PORT = process.env.PORT!;

app.use("/api/signup", singupRouter);

app.use("/api/login", loginRouter);

app.use("/api/createMessage", createMessageRouter);

app.use("/api/createBotPressUser", createBotPressUserRouter);

app.use("/api/getUserInfo", getUserInfo);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
