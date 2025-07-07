import express from "express";
import dotenv from "dotenv";
import singup from "./routes/signup";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT!;

app.use("/api/signup", singup);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
