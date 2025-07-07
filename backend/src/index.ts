import express from "express";
import dotenv from "dotenv";
import singup from "./routes/signup";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:8081",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

const PORT = process.env.PORT!;

app.use("/api/signup", singup);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
