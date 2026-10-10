# 🧭 Module 08 — Routing

> A multi-page React Router example covering route definitions, navigation links, URL parameters, nested routes, and a not-found route.

---

## 📚 Overview

This module uses **React Router** to render different components based on the current URL. It includes ordinary routes, dynamic user URLs, nested dashboard pages, link-based navigation, and programmatic navigation.

```text
BrowserRouter
     ↓
Routes
     ├── /             → Home
     ├── /about        → About
     ├── /projects     → Projects
     ├── /users/:id    → User details
     ├── /dashboard    → Dashboard layout
     │                    ├── profile
     │                    └── settings
     └── *              → Not Found
```

---

## 🧠 Concepts Covered

- 🧭 `BrowserRouter` as the routing context
- 🛣️ `Routes` and `Route` for URL-to-component mapping
- 🔗 `Link` for navigation without a full page reload
- 📍 `NavLink` and active-link styling
- 🧩 Dynamic route segments and `useParams()`
- 🖱️ Programmatic navigation with `useNavigate()`
- 🪆 Nested routes and `Outlet`
- 🚫 Catch-all routes for unknown paths

---

## 🗂️ Module Structure

```text
08-Routing/
└── Module08.jsx
```

The example pages and navigation components are defined within `Module08.jsx`.

---

## 🛣️ Route Summary

| Path | Component / behavior |
|---|---|
| `/` | Home page |
| `/about` | About page |
| `/projects` | Projects page |
| `/users/:id` | User details using the dynamic `id` parameter |
| `/dashboard` | Dashboard parent layout |
| `/dashboard/profile` | Nested profile page |
| `/dashboard/settings` | Nested settings page |
| `*` | 404 page for unmatched paths |

---

## 🔗 Navigation Components

### `Link`

The dashboard uses `Link` to navigate between its profile and settings pages. The Home page uses `useNavigate()` to navigate to `/projects` when its button is clicked.

### `NavLink`

The navigation bar uses `NavLink` for the main pages. Its `className` callback applies the `active` class when a link matches the current route.

### `useParams()`

The `User` component reads `id` from the `/users/:id` route and displays it as the user ID. The example link points to `/users/101`.

---

## 🪆 Nested Routing & `Outlet`

The `/dashboard` route renders the `Dashboard` layout. Its child routes use relative paths, `profile` and `settings`. The parent component's `<Outlet />` marks where the matching child route is rendered.

This allows the dashboard navigation and shared layout to remain visible while the nested page changes.

---

## 🚫 Not-Found Handling

The catch-all route (`path="*"`) renders the `NotFound` component for URLs that do not match another route in this router.

---

## 📌 Implementation Notes

- `Module08` creates its own `BrowserRouter`; avoid nesting it inside another `BrowserRouter` when integrating this module into a larger app.
- The module demonstrates client-side navigation; it does not fetch page data from a server.
- `NavLink` active styling depends on the `active` CSS class being styled elsewhere if a visual style is desired.

---

## 🧭 Position in the Learning Path

Module 07 focused on composing UI from reusable components. This module adds URL-based page selection and navigation between those components.

---

## 🏁 Module Summary

**Module 08: Routing** demonstrates how a React application can organize multiple views around URLs, including dynamic and nested routes.
