# 📝 Module 05 — Forms & Controlled Components

> A controlled registration form that stores field values in React state and displays validation feedback before accepting a submission.

---

## 📚 Overview

This module demonstrates how form controls can be driven by React state. It includes text inputs, a select field, radio buttons, a checkbox, field-level validation, and submit handling.

```text
User changes a field
        ↓
handleChange()
        ↓
formData state updates
        ↓
Input value reflects state

Form submit → validate() → show errors OR handle successful submission
```

---

## 🧠 Concepts Covered

- 🎛️ Controlled inputs using `value` or `checked`
- 🧺 Grouping related form fields in one state object
- 🔄 Updating one property without losing other properties
- ☑️ Handling checkboxes separately from text-like inputs
- 🔘 Radio groups controlled by a shared field
- ⚠️ Field-level validation and error state
- 📨 Preventing the browser's default form submission
- 🧹 Resetting form values after successful validation

---

## 🗂️ Module Structure

```text
05-Forms-Controlled-Components/
└── Module05.jsx
```

All form state, validation, submission logic, and markup are contained in `Module05.jsx`.

---

## 🧾 Form Fields

| Field | Control | Validation |
|---|---|---|
| `name` | Text input | Must not be blank after trimming |
| `email` | Email input | Required and checked against an email pattern |
| `role` | Select | A role must be selected |
| `experience` | Radio group | One experience option must be selected |
| `agreeToTerms` | Checkbox | Must be checked |

The initial values are defined in `initialFormData`, which is also used when resetting the form.

---

## 🎛️ Controlled Form State

The `formData` object stores the values of all fields. Each input receives its current value from state and calls `handleChange()` when changed.

```jsx
setFormData((prev) => ({
  ...prev,
  [name]: type === "checkbox" ? checked : value
}));
```

The computed property name updates the field identified by the input's `name` attribute. Checkbox controls use `checked`; other controls use `value`.

---

## ⚠️ Validation & Error Handling

`validate()` builds and returns a `newErrors` object. It checks the required fields and validates the email format. `handleSubmit()` prevents the browser's default submission, stores the errors, and stops if any errors exist.

Errors are rendered next to their corresponding controls only when that field has an error entry.

### Validation flow

```text
Submit form
    ↓
Prevent default browser submit
    ↓
Run validate()
    ↓
Any errors?
  ↙       ↘
 Yes       No
  ↓         ↓
Show errors Log successful form data
            ↓
         Reset values and errors
```

---

## ✅ Successful Submission Behavior

When validation passes, the current `formData` is logged to the console. The form then resets to `initialFormData` and clears the error object.

**Important:** this is a frontend learning example. It does not send the registration data to a backend API or create an account.

---

## 📌 Implementation Notes

- The email pattern provides basic client-side validation, not complete email verification.
- Radio buttons use the same `name` and compare their value with `formData.experience`.
- The checkbox is represented as a boolean.
- The form uses React state as the source of truth for its fields.

---

## 🧭 Position in the Learning Path

Module 04 focused on conditional list output. This module applies the same state-driven approach to forms, where values, validation messages, and submission behavior all depend on React state.

---

## 🏁 Module Summary

**Module 05: Forms & Controlled Components** shows how to manage multiple field types and validate user input using a single, consistent React state model.
