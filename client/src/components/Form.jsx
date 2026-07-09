function Form({ formData, errors, isLoading, onChange, onSubmit }) {
  return (
    <form className="card form-card" onSubmit={onSubmit} noValidate>
      <div className="card-heading">
        <h2>Candidate Details</h2>
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
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder="Enter candidate name"
        />
        {errors.name && (
          <small id="name-error" className="error-text">
            {errors.name}
          </small>
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
          aria-invalid={errors.role ? "true" : "false"}
          aria-describedby={errors.role ? "role-error" : undefined}
          placeholder="Frontend Developer"
        />
        {errors.role && (
          <small id="role-error" className="error-text">
            {errors.role}
          </small>
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
          aria-invalid={errors.company ? "true" : "false"}
          aria-describedby={errors.company ? "company-error" : undefined}
          placeholder="Company name"
        />
        {errors.company && (
          <small id="company-error" className="error-text">
            {errors.company}
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="skills">Key Skills</label>
        <textarea
          id="skills"
          name="skills"
          rows="4"
          value={formData.skills}
          onChange={onChange}
          className={errors.skills ? "field-error" : ""}
          aria-invalid={errors.skills ? "true" : "false"}
          aria-describedby={errors.skills ? "skills-error" : undefined}
          placeholder="React, JavaScript, Node.js, CSS"
        />
        {errors.skills && (
          <small id="skills-error" className="error-text">
            {errors.skills}
          </small>
        )}
      </div>

      <button type="submit" className="primary-btn" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Cover Letter"}
      </button>
    </form>
  );
}

export default Form;