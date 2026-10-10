# 🔄 Module 06 — `useEffect` & Component Lifecycle

> A user-search view that fetches remote data, tracks loading and error states, and cleans up a delayed request timer.

---

## 📚 Overview

This module introduces the `useEffect` hook for synchronizing a component with an external system. It requests user data from JSONPlaceholder after the component mounts, then lets the user search the fetched results by name.

```text
Component mounts
      ↓
useEffect runs once
      ↓
500 ms timer
      ↓
Fetch JSONPlaceholder users
      ↓
Success → store users
Failure → store error
      ↓
Stop loading and render result
```

---

## 🧠 Concepts Covered

- ⚛️ `useEffect` and its dependency array
- 🌐 Fetching data from an external API
- ⏳ Loading state while data is being requested
- ⚠️ Error handling with `try` / `catch`
- 🧹 `finally` for ending the loading state
- ⏱️ `setTimeout()` and `clearTimeout()` cleanup
- 🔍 Derived search results from fetched data
- 📋 Rendering API data with stable keys

---

## 🗂️ Module Structure

```text
06-UseEffect-Component-Lifecycle/
└── Module06.jsx
```

---

## 🌐 Data Source

The module requests:

```text
https://jsonplaceholder.typicode.com/users
```

The response is parsed as JSON and stored in `users`. The view displays each user's name and email address.

---

## ⚙️ Effect Lifecycle

The effect uses an empty dependency array (`[]`), so the effect is intended to run when the component mounts rather than after every render.

The API call is scheduled with a 500-millisecond timeout. The effect returns a cleanup function that clears that timeout if the component unmounts before the timer fires.

```jsx
return () => {
  clearTimeout(timerId);
};
```

This cleanup cancels the pending timer. It does not abort a network request that has already started.

---

## ⏳ Loading & Error States

| State | Behavior |
|---|---|
| `loading` | Initially `true`; displays “Loading users...” while the request is pending |
| `error` | Stores a message if fetching fails or the response is not successful |
| `users` | Stores the returned user records |
| `search` | Stores the text used to filter names |

The `finally` block sets `loading` to `false` whether the request succeeds or fails. The component renders the loading state first, then the error state, and then the search interface.

---

## 🔍 Search & Derived Data

The filtered array is calculated from `users` and `search`:

```js
users.filter((user) =>
  user.name.toLowerCase().includes(search.toLowerCase())
)
```

The filtered array is derived during rendering instead of being stored in separate state. If no records match, the component displays **“No users found.”**

---

## 📌 Important Implementation Details

- The request checks `res.ok` before parsing the response as successful data.
- The API call is wrapped in `try` / `catch` / `finally`.
- The effect's cleanup handles the timeout, not an already-running fetch request.
- The module depends on network access to JSONPlaceholder.

---

## 🧭 Position in the Learning Path

Module 05 handled form state and validation. This module extends React state beyond user input and introduces effects for work involving an external API and browser timers.

---

## 🏁 Module Summary

**Module 06: `useEffect` & Component Lifecycle** demonstrates an effect, asynchronous data loading, loading/error UI, cleanup, and client-side search in one example.
