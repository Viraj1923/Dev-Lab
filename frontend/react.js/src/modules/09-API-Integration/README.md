# 🌐 Module 09 — API Integration

> A user-management interface that connects a React component to a REST-style API and handles loading, validation, search, create, update, and delete workflows.

---

## 📚 Overview

This module integrates the Fetch API with React state. It loads users from JSONPlaceholder, filters the displayed list, and provides a form for creating or editing a user and deleting records from the current interface.

```text
Component mounts
      ↓
GET users
      ↓
Loading / Error / User list
      ↓
Search + Add / Edit / Delete
      ↓
Fetch request
      ↓
Update local React state and show feedback
```

---

## 🧠 Concepts Covered

- 🌐 Fetching API data inside `useEffect`
- 🔄 `async` / `await` and response checks with `res.ok`
- ⏳ Loading and submitting states
- ⚠️ Request errors and user-facing feedback
- 📝 Controlled forms and field validation
- ➕ POST requests to create a user
- ✏️ PATCH requests to update a user
- 🗑️ DELETE requests to remove a user
- 🔍 Client-side search and derived data
- 🧹 Resetting forms and clearing action feedback

---

## 🗂️ Module Structure

```text
09-API-Integration/
└── Module09.jsx
```

The request logic, form state, validation, filtering, and UI are currently contained in `Module09.jsx`.

---

## 🌐 API Endpoint

The module uses JSONPlaceholder's users endpoint:

```text
https://jsonplaceholder.typicode.com/users
```

| Operation | HTTP method | URL pattern |
|---|---|---|
| Load users | `GET` | `/users` |
| Add user | `POST` | `/users` |
| Update user | `PATCH` | `/users/{id}` |
| Delete user | `DELETE` | `/users/{id}` |

The full base URL is `https://jsonplaceholder.typicode.com`.

---

## ⏳ Loading & Error States

On mount, `useEffect` calls `fetchData()`. The component checks the HTTP response with `res.ok`, parses JSON on success, stores any error message, and ends loading in `finally`.

- `loading` controls the initial loading message.
- `error` holds a load failure message.
- `actionMessage` displays successful create, update, or delete feedback.
- `actionError` displays an action failure.
- `submitting` disables form actions while a create or update request is pending.

---

## 📝 Form & Validation

The form stores `name` and `email` in `formData`. `validateForm()` requires both fields and checks the email against a basic pattern. `handleChange()` updates the changed field and clears that field's existing validation message.

The form is shared between create and edit modes:

- **Create mode:** the submit button says “Add User” and sends a `POST` request.
- **Edit mode:** selecting Edit fills the form with the selected user's data; submit sends a `PATCH` request.
- **Cancel edit:** clears the selected user and resets the form.

---

## ➕ Create, Update & Delete Flow

### Create

`addUser()` sends the form data as JSON. When the response succeeds, the returned user is appended to the local `users` array, the form is reset, and success feedback is displayed.

### Update

`updateUser()` sends a `PATCH` request to the selected user's endpoint. The returned data is merged into the matching local record using `.map()`.

### Delete

`deleteUser(id)` sends a `DELETE` request and removes the matching user from local state using `.filter()` after a successful response.

---

## 🔍 Search & Rendering

Search is performed on the client by matching the lowercased user name against the lowercased search input. The filtered array is derived from `users` and `search` and is not stored as separate state.

Each rendered user uses `user.id` as its React key and provides Edit and Delete actions.

---

## ⚠️ Important Scope Notes

- JSONPlaceholder is a demonstration API. Its write endpoints simulate mutations; changes are not a persistent user database.
- The component updates local state after successful write responses so the interface reflects the action during the current session.
- Validation is client-side and does not replace server-side validation.
- The current loading and submitting flags primarily cover initial loading and form create/update requests; delete requests do not have a separate per-user pending state.

---

## 🧭 Position in the Learning Path

Module 06 introduced a data-fetching effect. This module expands that idea into a more complete interface with form validation, search, multiple HTTP methods, and action feedback.

---

## 🏁 Module Summary

**Module 09: API Integration** demonstrates the main frontend responsibilities around API communication: request data, handle failures, validate input, and keep the displayed state synchronized with the result of each action.
