function App() {
  return (
    <main className="page">
      <section className="app-shell">
        <div className="intro">
          <p className="eyebrow">Sprint 4 Project</p>
          <h1>Cover Letter Generator</h1>
          <p>
            Enter candidate details and generate a professional cover letter for
            a job application.
          </p>
        </div>

        <div className="work-area">
          <section className="card">
            <h2>Candidate Details</h2>
            <p className="muted">The form will be added here.</p>
          </section>

          <section className="card">
            <h2>Generated Letter</h2>
            <p className="muted">
              No cover letter generated yet. Fill the form and click Generate.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

export default App;