import { GoogleGenAI } from "@google/genai";
import { makePrompt } from "../helpers/makePrompt.js";

const MODEL_NAME = "gemini-3.1-flash-lite";

function cleanText(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function makeFallbackLetter(data) {
  return `Dear Hiring Manager,

I am writing to apply for the ${data.role} position at ${data.company}. My key skills include ${data.skills}.

I am interested in using these skills to contribute to the requirements of the role. I would welcome the opportunity to discuss how my current skills align with the position and how I can contribute to your team.

Thank you for considering my application.

Sincerely,
${data.name}`;
}

function sendFallback(res, letter, message) {
  return res.status(200).json({
    letter,
    source: "template",
    message,
  });
}

export async function generateLetter(req, res) {
  const formData = {
    name: cleanText(req.body?.name, 80),
    role: cleanText(req.body?.role, 100),
    company: cleanText(req.body?.company, 100),
    skills: cleanText(req.body?.skills, 500),
    jobDescription: cleanText(
      req.body?.jobDescription,
      4000,
    ),
  };

  const requiredFields = [
    "name",
    "role",
    "company",
    "skills",
  ];

  const missingFields = requiredFields.filter(
    (field) => !formData[field],
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Please fill in all required fields.",
      fields: missingFields,
    });
  }

  const fallbackLetter = makeFallbackLetter(formData);
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return sendFallback(
      res,
      fallbackLetter,
      "AI service is unavailable. A template letter was generated instead.",
    );
  }

  const startTime = Date.now();

  try {
    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: makePrompt(formData),
      config: {
        maxOutputTokens: 450,
      },
    });

    const responseTime = Date.now() - startTime;

    console.log(`Gemini response time: ${responseTime}ms`);

    const letter =
      typeof response?.text === "string"
        ? response.text.trim()
        : "";

    if (!letter) {
      return sendFallback(
        res,
        fallbackLetter,
        "The AI returned an empty response. A template letter was generated instead.",
      );
    }

    return res.status(200).json({
      letter,
      source: "gemini",
    });
  } catch (error) {
    const status = Number(
      error?.status ||
        error?.code ||
        error?.response?.status,
    );

    const errorMessage = String(error?.message || "");
    const isRateLimit =
      status === 429 || errorMessage.includes("429");

    console.error("Gemini API request failed:", {
      status: status || "unknown",
      message: errorMessage,
    });

    if (isRateLimit) {
      return sendFallback(
        res,
        fallbackLetter,
        "The AI request limit was reached. A template letter was generated instead.",
      );
    }

    if (
      status === 400 ||
      status === 401 ||
      status === 403
    ) {
      return sendFallback(
        res,
        fallbackLetter,
        "The AI service could not be configured. A template letter was generated instead.",
      );
    }

    return sendFallback(
      res,
      fallbackLetter,
      "The AI service is temporarily unavailable. A template letter was generated instead.",
    );
  }
}