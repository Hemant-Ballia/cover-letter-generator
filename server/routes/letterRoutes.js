import express from "express";
import { generateLetter } from "../controllers/letterController.js";

const router = express.Router();

router.post("/generate-letter", generateLetter);

export default router;