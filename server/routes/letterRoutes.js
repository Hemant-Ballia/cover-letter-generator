import express from "express";

const router = express.Router();

router.post("/generate-letter", (req, res) => {
  res.status(200).json({
    message: "Letter route is working",
  });
});

export default router;