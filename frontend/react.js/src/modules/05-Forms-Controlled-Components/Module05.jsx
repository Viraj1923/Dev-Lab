import { useState } from "react";

const initialFormData = {
  name: "",
  email: "",
  role: "",
  agreeToTerms: false,
  experience: ""
};

function Module05() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, type, value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function validate() {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (formData.role === "") {
      newErrors.role = "Please select a role";
    }

    if (formData.experience === "") {
      newErrors.experience = "Please select your experience";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    console.log("Form submitted successfully:", formData);

    setFormData(initialFormData);
    setErrors({});
  }

  return (
    <div>
      <h2>Module 05 — Forms & Controlled Components</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          {errors.name && <p>{errors.name}</p>}
        </div>

        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          {errors.email && <p>{errors.email}</p>}
        </div>

        <div>
          <label>
            Role:
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select role</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
            </select>
          </label>
          {errors.role && <p>{errors.role}</p>}
        </div>

        <fieldset>
          <legend>Experience:</legend>

          <label>
            <input
              type="radio"
              name="experience"
              value="Fresher"
              checked={formData.experience === "Fresher"}
              onChange={handleChange}
            />
            Fresher
          </label>

          <label>
            <input
              type="radio"
              name="experience"
              value="1-2 Years"
              checked={formData.experience === "1-2 Years"}
              onChange={handleChange}
            />
            1-2 Years
          </label>

          <label>
            <input
              type="radio"
              name="experience"
              value="3+ Years"
              checked={formData.experience === "3+ Years"}
              onChange={handleChange}
            />
            3+ Years
          </label>

          {errors.experience && <p>{errors.experience}</p>}
        </fieldset>

        <div>
          <label>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            I agree to the terms
          </label>

          {errors.agreeToTerms && <p>{errors.agreeToTerms}</p>}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Module05;
