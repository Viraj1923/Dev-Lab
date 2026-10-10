# 🔐 Module 10 — Authentication & Protected Routes

> A small React Router example that introduces authentication context, login/logout state, and restricting a profile route to authenticated users.

---

## 📚 Overview

This module demonstrates how authentication-related state can be shared across a component tree using React Context. `AuthProvider` owns the current user and authentication flag, while the route setup places the profile page behind a `ProtectedRoute` wrapper.

```text
AuthProvider
   ↓ exposes context
Router
   ├── /        → Home
   ├── /login   → Login
   └── /profile → ProtectedRoute → Profile
```

---

## 🧠 Concepts Covered

- 🔑 `createContext()` for shared authentication state
- 🧩 Context provider and provider `value`
- ⚛️ `useContext()` to consume authentication state
- 👤 Current user data and authentication flag
- 🔓 Login and logout state transitions
- 🛡️ Protected route composition
- 🧭 React Router's `Navigate` for redirect behavior
- 🔗 Navigation using `NavLink`

---

## 🗂️ Module Structure

```text
10-Authentication-Protected-Routes/
├── AuthContext.jsx
└── Module10.jsx
```

### `AuthContext.jsx`

Creates `AuthContext` and exports `AuthProvider`. The provider stores `user` and `isAuthenticated`, exposes `login()` and `logout()`, and makes these values available to descendants.

### `Module10.jsx`

Wraps the router in `AuthProvider` and declares the Home, Login, and Profile routes. The Profile element is wrapped in `ProtectedRoute`.

---

## 👤 Authentication Context

The context currently exposes:

| Value | Purpose |
|---|---|
| `user` | The current sample user object, or `null` after logout |
| `isAuthenticated` | Boolean flag indicating the sample login state |
| `login()` | Sets a hard-coded sample user and marks the session authenticated |
| `logout()` | Clears the user and marks the session unauthenticated |

The sample login data uses a name and email. It is deliberately simple to focus on sharing state rather than implementing a real authentication service.

---

## 🛡️ Protected Route Concept

The `/profile` route wraps `Profile` in `ProtectedRoute`. A protected-route component typically reads the authentication state and either renders its children or redirects unauthenticated visitors to the login page using `Navigate`.

The route configuration demonstrates this composition pattern. This module is a frontend learning example and does not itself authenticate credentials against a backend.

---

## ⚠️ Security & Scope

- The `login()` function sets a hard-coded user; it does not verify a password.
- The context state is held in memory and is not persisted across page reloads.
- No API request, JWT validation, secure session cookie, or server-side authorization is implemented in this module.
- Client-side protected routes control the UI only. A real application must enforce authorization on the backend as well.

---

## 🧭 Position in the Learning Path

Module 08 introduced routing, and Module 09 introduced API requests. This module combines route structure with shared authentication state to demonstrate how access-dependent UI is organized.

---

## 🏁 Module Summary

**Module 10: Authentication & Protected Routes** introduces the structure of an authentication context and the protected-route pattern without presenting the mock login as production security.
