export function checkForm(formData) {
  const errors = {};

  if (!formData.name) {
    errors.name = "Candidate name is required";
  }

  if (!formData.role) {
    errors.role = "Job role is required";
  }

  if (!formData.company) {
    errors.company = "Target company is required";
  }

  if (!formData.skills) {
    errors.skills = "Key skills are required";
  }

  return errors;
}