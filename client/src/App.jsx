import { useState } from "react";
import Form from "./components/Form";
import LetterBox from "./components/LetterBox";
import Message from "./components/Message";
import { cleanInput } from "./utils/cleanInput";
import { checkForm } from "./utils/checkForm";

const defaultForm = {
  name: "",
  role: "",
  company: "",
  skills: "",
};

function App() {
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [letter, setLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "info",
    text: "No cover letter generated yet. Fill the form and click Generate.",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanedData = {
      name: cleanInput(formData.name),
      role: cleanInput(formData.role),
      company: cleanInput(formData.company),
      skills: cleanInput(formData.skills),
    };

    const formErrors = checkForm(cleanedData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setMessage({
        type: "error",
        text: "Please fill all required fields correctly.",
      });
      return;
    }

    setIsLoading(true);
    setLetter("");
    setMessage({
      type: "loading",
      text: "Generating your cover letter...",
    });

    try {
      const response = await fetch("http://localhost:5000/api/generate-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to generate cover letter.");
      }

      if (!data.letter) {
        setMessage({
          type: "error",
          text: "No cover letter was generated. Please try again.",
        });
        return;
      }

      setLetter(data.letter);
      setMessage({
        type: "success",
        text: "Cover letter generated successfully.",
      });

      console.log("[Analytics] User generated a cover letter");
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong. Please check the server and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!letter) return;

    try {
      await navigator.clipboard.writeText(letter);

      setMessage({
        type: "success",
        text: "Cover letter copied to clipboard.",
      });

      console.log("[Analytics] User copied cover letter");
    } catch {
      setMessage({
        type: "error",
        text: "Could not copy the letter. Please copy it manually.",
      });
    }
  }

  return (
    <main className="page">
      <section className="app-shell">
        <div className="intro">
          <h1>Cover Letter Generator</h1>
          <p>
            Enter candidate details and generate a professional cover letter for
            a job application.
          </p>
        </div>

        <Message message={message} />

        <div className="work-area">
          <Form
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

          <LetterBox
            letter={letter}
            isLoading={isLoading}
            onCopy={handleCopy}
          />
        </div>
      </section>
    </main>
  );
}

export default App;