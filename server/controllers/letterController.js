import { GoogleGenerativeAI } from "@google/generative-ai";
import { makePrompt } from "../helpers/makePrompt.js";

function makeFallbackLetter(data) {
  return `Dear Hiring Manager at ${data.company},

I am ${data.name}, and I am interested in applying for the ${data.role} position at ${data.company}. My key skills include ${data.skills}, and I am ready to use them in a practical work environment.

I am looking forward to learning from real projects and contributing to the team with a responsible approach.

Thank you for considering my application.

Sincerely,
${data.name}`;
}

function isMissing(value) {
  return !value || String(value).trim() === "";
}

export async function generateLetter(req, res) {
  const { name, role, company, skills } = req.body;

  if (
    isMissing(name) ||
    isMissing(role) ||
    isMissing(company) ||
    isMissing(skills)
  ) {
    return res.status(400).json({
      message: "Name, role, company, and skills are required.",
    });
  }

  const formData = {
    name: String(name).trim(),
    role: String(role).trim(),
    company: String(company).trim(),
    skills: String(skills).trim(),
  };

  const fallbackLetter = makeFallbackLetter(formData);

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({
      letter: fallbackLetter,
      source: "template",
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(makePrompt(formData));
    const response = result.response;
    const letter = response.text().trim();

    if (!letter) {
      return res.status(200).json({
        letter: fallbackLetter,
        source: "template",
      });
    }

    return res.status(200).json({
      letter,
      source: "gemini",
    });
  } catch (error) {
    console.error("Error generating letter:", error.message);

    return res.status(200).json({
      letter: fallbackLetter,
      source: "template",
    });
  }
}