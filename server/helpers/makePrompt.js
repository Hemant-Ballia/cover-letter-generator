export function makePrompt(data) {
  return `
Write a professional cover letter using the details below.

Candidate Name: ${data.name}
Job Role: ${data.role}
Target Company: ${data.company}
Key Skills: ${data.skills}

Guidelines:
- Keep the tone professional and natural.
- Write for an internship or junior developer job application.
- Do not add fake achievements.
- Do not use overly dramatic language.
- Keep it clear and concise.
- Return only the cover letter text in clean paragraphs.
`;
}