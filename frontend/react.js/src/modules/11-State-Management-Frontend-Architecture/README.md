# 🏗️ Module 11 — State Management & Frontend Architecture

> A small task manager that uses `useReducer` to centralize state transitions and separates input, list, statistics, and reducer logic into focused files.

---

## 📚 Overview

This module introduces reducer-based state management. Instead of calling multiple state setters for each task action, the UI dispatches an action describing what happened. The reducer returns the next task array.

```text
TaskInput
   ↓ onAddTask(newTask)
TaskSection
   ↓ dispatch({ type, payload })
taskReducer
   ↓ next tasks state
TaskStats + TaskList
```

---

## 🧠 Concepts Covered

- ⚛️ `useReducer` for state transitions
- 📣 Dispatching actions with a `type` and `payload`
- 🧮 Writing a reducer that returns the next state
- ➕ Adding records immutably
- 🗑️ Deleting records with `filter()`
- 🧩 Separating UI into focused components
- 📦 Passing data and event callbacks through props
- 🆔 Creating task IDs with `crypto.randomUUID()`
- 🔢 Deriving simple statistics from state

---

## 🗂️ Module Structure

```text
11-State-Management-Frontend-Architecture/
├── Module11.jsx
├── TaskSection.jsx
├── TaskInput.jsx
├── TaskList.jsx
├── TaskStats.jsx
├── UseReducer.jsx
└── taskReducer.js
```

---

## 🧩 Component Responsibilities

| File / component | Responsibility |
|---|---|
| `Module11.jsx` | Renders the Task Manager heading and `TaskSection` |
| `TaskSection.jsx` | Owns task state through `useReducer` and dispatches add/delete actions |
| `TaskInput.jsx` | Manages the current input value and sends a new task to its parent |
| `TaskList.jsx` | Renders task items and calls the supplied delete callback |
| `TaskStats.jsx` | Calculates and displays the total number of tasks |
| `taskReducer.js` | Handles `ADD_TASK` and `DELETE_TASK` actions |
| `UseReducer.jsx` | Contains a separate counter example using a reducer |

---

## ⚙️ Task State & Reducer

`TaskSection` initializes the reducer with an empty array:

```jsx
const [tasks, dispatch] = useReducer(taskReducer, []);
```

It dispatches two action types:

| Action | Payload | Result |
|---|---|---|
| `ADD_TASK` | New task object | Appends the task to the array |
| `DELETE_TASK` | Task ID | Removes the task whose ID matches the payload |

The reducer uses array spread for addition and `.filter()` for deletion. If an action type is not recognized, it returns the existing state unchanged.

---

## ➕ Adding & Removing Tasks

`TaskInput` stores the text being typed in local component state. On submission, it trims the text and ignores an empty value. It then calls `onAddTask()` with an object containing a unique ID and the task text, and clears the input.

`TaskSection` converts this callback into an `ADD_TASK` dispatch. For deletion, `TaskList` calls `onDeleteTask(task.id)`, and `TaskSection` dispatches `DELETE_TASK` with that ID.

---

## 📊 Derived Statistics

`TaskStats` receives the task array and calculates:

```js
const totalTasks = tasks.length;
```

The total is derived from current state rather than maintained as a separate value. This avoids needing to update both the list and a separate count whenever a task changes.

---

## 🔢 Separate Counter Example

`UseReducer.jsx` contains a small counter using a reducer and the actions `increment` and `decrement`. It demonstrates the same pattern with a number instead of an array:

- `increment` returns `count + 1`.
- `decrement` returns `count - 1`.
- Unknown actions return the current count.

This counter is a separate example and is not rendered by `Module11.jsx` in the current module entry component.

---

## 📌 Architecture Notes

- Task data is owned by `TaskSection`, the component coordinating the task workflow.
- `TaskInput` has local state only for the text currently being typed.
- The reducer contains task state-transition logic separately from presentation.
- `TaskList` and `TaskStats` receive the same source of truth through props.
- The task list is held in memory and is not saved to an API or browser storage.

---

## 🧭 Position in the Learning Path

Earlier modules used `useState` for individual state values and form objects. This module introduces `useReducer` for action-based updates and demonstrates how a feature can be split across components and a dedicated reducer.

---

## 🏁 Module Summary

**Module 11: State Management & Frontend Architecture** brings together reducer-based updates, reusable components, callback props, and derived UI state in a compact task manager.
