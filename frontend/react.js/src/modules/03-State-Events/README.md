# ⚡ Module 03 — State & Events

> A practical introduction to React state and event-driven UI updates, using a small task list to connect user actions with rendered output.

---

## 📚 Overview

This module introduces **`useState`** and shows how a component can store changing data, respond to user actions, and update the interface without manually manipulating the DOM.

The example keeps the task collection in `Module03` and delegates input and list presentation to reusable components.

```text
User enters a task
        ↓
TaskInput calls onAddTask
        ↓
Module03.addTask()
        ↓
useState updates the task array
        ↓
TaskList renders the updated tasks
```

---

## 🧠 Concepts Covered

- ⚛️ `useState` for component state
- 🖱️ Event handlers and callback props
- 🔄 Functional state updates with the previous state
- ➕ Adding an item without mutating the existing array
- 🗑️ Removing an item with `filter()`
- 🧩 Parent-to-child data flow and child-to-parent event callbacks
- 🛡️ Ignoring blank task input

---

## 🗂️ Module Structure

```text
03-State-Events/
└── Module03.jsx
```

`Module03.jsx` imports the shared `TaskInput` and `TaskList` components from `src/components/`.

---

## ⚙️ State & Event Flow

### 🧺 Task state

```jsx
const [tasks, setTasks] = useState([]);
```

The initial state is an empty array. React provides the current `tasks` value and the `setTasks` function used to request an update.

### ➕ Adding tasks

`addTask()` ignores input that contains only whitespace, then appends a task using a functional state update:

```jsx
setTasks((prevTasks) => [...prevTasks, task]);
```

The spread syntax creates a new array rather than modifying the previous state directly.

### 🗑️ Removing tasks

`removeTask()` filters out the item at the selected index:

```jsx
setTasks((prevTasks) =>
  prevTasks.filter((_, index) => index !== indexToDelete)
);
```

The updated array causes React to render the list again.

---

## 🔗 Component Communication

| Component | Responsibility |
|---|---|
| `Module03` | Owns the task state and add/remove logic |
| `TaskInput` | Collects text and calls `onAddTask` |
| `TaskList` | Displays tasks and calls `onRemoveTask` when a task is removed |

The parent passes data and callbacks through props. The child components do not own the task collection.

---

## 📌 Important Implementation Details

- State updates create new arrays instead of mutating the existing array.
- Functional updates use the latest previous state.
- Blank tasks are ignored after trimming whitespace.
- Removal currently identifies tasks by their array index; this matches the current example's string-based task data.

---

## 🧭 Position in the Learning Path

Module 02 introduced components and props. This module builds on that foundation by showing how state changes and event callbacks connect those components into an interactive interface.

---

## 🏁 Module Summary

**Module 03: State & Events** demonstrates the core React update cycle: user interaction triggers a handler, the handler updates state, and React renders the new state.
