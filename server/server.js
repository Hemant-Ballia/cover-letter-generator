import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import letterRoutes from "./routes/letterRoutes.js";

dotenv.config({ path: "../.env" });

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.send("Cover Letter Generator API is running");
});

app.use("/api", letterRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});