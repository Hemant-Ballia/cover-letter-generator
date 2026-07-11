import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import letterRoutes from "./routes/letterRoutes.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.disable("x-powered-by");

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const requestOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(requestOrigin)) {
        return callback(null, true);
      }

      const error = new Error("Request origin is not allowed.");
      error.status = 403;

      return callback(error);
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json({ limit: "100kb" }));

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

app.get("/", (_req, res) => {
  return res.status(200).json({
    message: "Cover Letter Generator API is running.",
  });
});

app.use("/api", letterRoutes);

app.use((_req, res) => {
  return res.status(404).json({
    message: "Route not found.",
  });
});

app.use((error, _req, res, _next) => {
  console.error("Server error:", error.message);

  if (error instanceof SyntaxError) {
    return res.status(400).json({
      message: "Invalid JSON data.",
    });
  }

  if (error.status === 403) {
    return res.status(403).json({
      message: "Request origin is not allowed.",
    });
  }

  return res.status(500).json({
    message: "Internal server error.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  if (!process.env.GEMINI_API_KEY?.trim()) {
    console.warn(
      "GEMINI_API_KEY is missing. Template fallback will be used.",
    );
  }
});