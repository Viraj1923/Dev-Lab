# 🔎 Module 04 — Conditional Rendering & Lists

> A searchable user list demonstrating controlled input, array filtering, conditional UI, and stable React keys.

---

## 📚 Overview

This module renders a small user dataset and lets the user filter it by name or show only active users. The displayed list is derived from the source data and current UI state.

```text
User data
   +
Search text
   +
Active-only toggle
   ↓
Array filter
   ↓
Filtered user list OR empty state
```

---

## 🧠 Concepts Covered

- 📋 Rendering arrays with `.map()`
- 🔑 Supplying a stable `key` for each rendered list item
- 🔍 Case-insensitive search using `toLowerCase()` and `includes()`
- 🎚️ Controlled text input with `value` and `onChange`
- 🔀 Conditional rendering with the ternary operator
- 🧮 Combining search and status filters
- 🈳 Showing an empty state when no records match

---

## 🗂️ Module Structure

```text
04-Conditional-Rendering-Lists/
└── Module04.jsx
```

The user records are defined in the module as a local array. Each record includes `id`, `name`, `role`, and `active`.

---

## 👥 Source Data

The example contains four sample users with frontend, backend, full-stack, and UI/UX roles. The `active` property determines whether a user is included when the active-only filter is enabled.

This is static example data; the module does not fetch users from an API.

---

## 🔍 Filtering Logic

### Search by name

The name comparison is case-insensitive:

```js
user.name.toLowerCase().includes(search.toLowerCase())
```

### Active-only filter

```js
const matchesActive = showActiveOnly ? user.active : true;
```

When the toggle is off, every user's status passes this part of the filter. When it is on, only users whose `active` value is `true` pass.

Both conditions must match for a user to appear.

---

## 🔀 Conditional UI

The module checks `filteredUsers.length` before rendering the list:

- If the filtered array is empty, it displays **“No users found.”**
- Otherwise, it renders each matching user with their name, role, and active status.

The button label also changes with the current toggle state: **“Show Active Users Only”** or **“Show All Users.”**

---

## 🧩 State Model

| State | Purpose |
|---|---|
| `search` | Stores the current name-search text |
| `showActiveOnly` | Determines whether inactive users should be excluded |
| `filteredUsers` | Derived from the static data and the two state values; it is not stored separately |

Keeping the filtered result derived avoids maintaining duplicate state that could become inconsistent.

---

## 📌 Important Implementation Details

- Each list item uses `user.id` as its React key.
- Search and status filtering are combined in one `.filter()` call.
- The source array remains unchanged; filtering creates a new array.
- The dataset is local to the module and is not persisted.

---

## 🧭 Position in the Learning Path

Module 03 introduced state updates through events. This module applies state to list filtering and demonstrates how React conditionally renders different UI based on current data.

---

## 🏁 Module Summary

**Module 04: Conditional Rendering & Lists** connects array rendering, controlled inputs, derived data, and conditional output in one small user-directory example.
