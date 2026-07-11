function LetterBox({ letter, isLoading, onCopy }) {
  const letterText =
    typeof letter === "string" ? letter.trim() : "";

  const paragraphs = letterText
    ? letterText
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];

  return (
    <section
      className="card letter-card"
      aria-labelledby="generated-letter-title"
      aria-busy={isLoading}
    >
      <div className="card-heading">
        <h2 id="generated-letter-title">Generated Letter</h2>
        <p>
          {letterText
            ? "Review your cover letter and copy it when ready."
            : "Your generated cover letter will appear here."}
        </p>
      </div>

      <div className="letter-box" aria-live="polite">
        {isLoading && (
          <p className="muted">
            Generating your cover letter...
          </p>
        )}

        {!isLoading && !letterText && (
          <p className="muted">
            No cover letter generated yet. Fill the form and
            click Generate.
          </p>
        )}

        {!isLoading &&
          paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
      </div>

      {letterText && (
        <button
          type="button"
          className="secondary-btn"
          onClick={onCopy}
          disabled={isLoading}
        >
          Copy to Clipboard
        </button>
      )}
    </section>
  );
}

export default LetterBox;