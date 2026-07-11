import { useState } from "react";
import Form from "./components/Form";
import LetterBox from "./components/LetterBox";
import Message from "./components/Message";
import { cleanInput } from "./utils/cleanInput";
import { checkForm } from "./utils/checkForm";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const REQUEST_TIMEOUT = 30000;

const initialFormData = {
  name: "",
  role: "",
  company: "",
  skills: "",
  jobDescription: "",
};

function App() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [letter, setLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "info",
    text: "No cover letter generated yet. Fill the form and click Generate.",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: "",
      }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const cleanedData = {
      name: cleanInput(formData.name),
      role: cleanInput(formData.role),
      company: cleanInput(formData.company),
      skills: cleanInput(formData.skills),
      jobDescription: cleanInput(formData.jobDescription),
    };

    const formErrors = checkForm(cleanedData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setMessage({
        type: "error",
        text: "Please fill in all required fields correctly.",
      });
      return;
    }

    setErrors({});
    setLetter("");
    setIsLoading(true);
    setMessage({
      type: "loading",
      text: "Generating your cover letter...",
    });

    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT);

    try {
      const response = await fetch(
        `${API_URL}/api/generate-letter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanedData),
          signal: controller.signal,
        },
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : {};

      if (!response.ok) {
        if (Array.isArray(data.fields)) {
          const serverErrors = {};

          data.fields.forEach((field) => {
            serverErrors[field] = "This field is required.";
          });

          setErrors(serverErrors);
        }

        setMessage({
          type: "error",
          text:
            data.message ||
            "Unable to generate the cover letter.",
        });
        return;
      }

      const generatedLetter =
        typeof data.letter === "string"
          ? data.letter.trim()
          : "";

      if (!generatedLetter) {
        setMessage({
          type: "error",
          text: "No cover letter was generated. Please try again.",
        });
        return;
      }

      setLetter(generatedLetter);

      if (data.source === "gemini") {
        setMessage({
          type: "success",
          text: "Cover letter generated successfully.",
        });
      } else {
        setMessage({
          type: "info",
          text:
            data.message ||
            "A template cover letter was generated.",
        });
      }
    } catch (error) {
      const isTimeout = error.name === "AbortError";

      setMessage({
        type: "error",
        text: isTimeout
          ? "The AI service is taking longer than expected. Please try again."
          : "Could not connect to the server. Please try again.",
      });
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!letter) {
      return;
    }

    try {
      await navigator.clipboard.writeText(letter);

      setMessage({
        type: "success",
        text: "Cover letter copied to clipboard.",
      });
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
        <header className="intro">
          <h1>Cover Letter Generator</h1>
          <p>
            Enter candidate details and generate a professional
            cover letter for a job application.
          </p>
        </header>

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