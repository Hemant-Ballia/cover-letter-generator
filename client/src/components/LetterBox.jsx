function LetterBox({ letter, isLoading, onCopy }) {
  const paragraphs = letter
    ? letter.split("\n").filter((line) => line.trim() !== "")
    : [];

  return (
    <section className="card letter-card">
      <div className="card-heading">
        <h2>Generated Letter</h2>
        <p>Generated cover letter will appear here.</p>
      </div>

      <div className="letter-box">
        {isLoading && <p className="muted">Generating your cover letter...</p>}

        {!isLoading && !letter && (
          <p className="muted">
            No cover letter generated yet. Fill the form and click Generate.
          </p>
        )}

        {!isLoading &&
          paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>

      <button
        type="button"
        className="secondary-btn"
        onClick={onCopy}
        disabled={!letter || isLoading}
      >
        Copy to Clipboard
      </button>
    </section>
  );
}

export default LetterBox;