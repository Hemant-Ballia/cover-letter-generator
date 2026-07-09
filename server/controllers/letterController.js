import { GoogleGenerativeAI } from "@google/generative-ai";
import { makePrompt } from "../helpers/makePrompt.js";

function makeFallbackLetter(data) {
  return `Dear Hiring Manager at ${data.company},

I am ${data.name}, and I am interested in applying for the ${data.role} position at ${data.company}. My key skills include ${data.skills}, and I am eager to contribute with a practical, learning-focused, and responsible approach.

I believe this role will allow me to apply my current skills while continuing to improve through real project work. I would be grateful for the opportunity to discuss how I can contribute to your team.

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
      model: "gemini-1.5-flash",
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