function Form({
  formData,
  errors,
  isLoading,
  onChange,
  onSubmit,
}) {
  return (
    <form
      className="card form-card"
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="candidate-form-title"
      aria-busy={isLoading}
    >
      <div className="card-heading">
        <h2 id="candidate-form-title">Candidate Details</h2>
        <p>Fill the required details to generate a cover letter.</p>
      </div>

      <div className="form-group">
        <label htmlFor="name">Candidate Name</label>

        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={onChange}
          className={errors.name ? "field-error" : ""}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder="Enter candidate name"
          maxLength={80}
          autoComplete="name"
          disabled={isLoading}
          required
        />

        {errors.name && (
          <p
            id="name-error"
            className="error-text"
            role="alert"
          >
            {errors.name}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="role">Job Role</label>

        <input
          id="role"
          name="role"
          type="text"
          value={formData.role}
          onChange={onChange}
          className={errors.role ? "field-error" : ""}
          aria-invalid={Boolean(errors.role)}
          aria-describedby={errors.role ? "role-error" : undefined}
          placeholder="Frontend Developer"
          maxLength={100}
          autoComplete="organization-title"
          disabled={isLoading}
          required
        />

        {errors.role && (
          <p
            id="role-error"
            className="error-text"
            role="alert"
          >
            {errors.role}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="company">Target Company</label>

        <input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={onChange}
          className={errors.company ? "field-error" : ""}
          aria-invalid={Boolean(errors.company)}
          aria-describedby={
            errors.company ? "company-error" : undefined
          }
          placeholder="Company name"
          maxLength={100}
          autoComplete="organization"
          disabled={isLoading}
          required
        />

        {errors.company && (
          <p
            id="company-error"
            className="error-text"
            role="alert"
          >
            {errors.company}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="skills">Key Skills</label>

        <textarea
          id="skills"
          name="skills"
          rows={4}
          value={formData.skills}
          onChange={onChange}
          className={errors.skills ? "field-error" : ""}
          aria-invalid={Boolean(errors.skills)}
          aria-describedby={
            errors.skills ? "skills-error" : undefined
          }
          placeholder="React, JavaScript, Node.js, CSS"
          maxLength={500}
          disabled={isLoading}
          required
        />

        {errors.skills && (
          <p
            id="skills-error"
            className="error-text"
            role="alert"
          >
            {errors.skills}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="jobDescription">
          Job Description <span className="optional-text">(Optional)</span>
        </label>

        <textarea
          id="jobDescription"
          name="jobDescription"
          rows={5}
          value={formData.jobDescription}
          onChange={onChange}
          placeholder="Paste the main job responsibilities or requirements"
          maxLength={4000}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className="primary-btn"
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Cover Letter"}
      </button>
    </form>
  );
}

export default Form;