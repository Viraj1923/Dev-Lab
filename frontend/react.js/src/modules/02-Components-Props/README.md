# 🧩 Module 02 — Components & Props

> A hands-on React module focused on breaking a user interface into reusable components and passing data between them through **props**.

---

## 📚 Overview

This module builds on the JSX fundamentals from Module 01. Instead of keeping the entire interface inside one component, the UI is assembled from smaller components with clearly defined responsibilities.

The current example renders a page heading, a header, and a profile card. The profile information is stored in a JavaScript object and passed into a component through props.

```text
Module02
   │
   ├── Header
   │
   └── Card
        │
        └── ProfileCard
              └── user data via props
```

The main concepts demonstrated are **function components**, **component imports**, **props**, **object props**, and **the `children` prop**.

---

## 🎯 Learning Objectives

This module demonstrates how to:

- 🧩 Split a UI into smaller React components.
- 📦 Import components and compose them inside another component.
- ➡️ Pass data from a parent component to a child using props.
- 🗂️ Pass an object as a prop and read its properties in the receiving component.
- 🧱 Use `children` to place one component inside another component's wrapper.
- ♻️ Keep UI components reusable instead of duplicating markup.

---

## 🗂️ Module Structure

```text
02-Components-Props/
└── Module02.jsx
```

`Module02.jsx` imports shared components from the surrounding `src` directory:

```text
src/
├── Header
├── ProfileCard
├── Card
└── modules/
    └── 02-Components-Props/
        └── Module02.jsx
```

The imported component files are part of the wider React workspace rather than being defined inside this module folder.

---

## 🧩 Main Component — `Module02.jsx`

The module defines a sample user object and passes it to `ProfileCard`.

```jsx
import Header from "../../Header";
import ProfileCard from "../../ProfileCard";
import Card from "../../Card";

const user = {
  name: "Viraj",
  role: "Frontend Developer",
  isAvailable: true,
  skills: ["JavaScript", "React", "Node.js"]
};

function Module02() {
  return (
    <div>
      <h2>Module 02 — Components & Props</h2>

      <Header title="Viraj's React App" />

      <Card>
        <ProfileCard user={user} />
      </Card>
    </div>
  );
}

export default Module02;
```

### 🔍 What the component does

- **`Header`** receives a `title` prop with the value `Viraj's React App`.
- **`ProfileCard`** receives the complete `user` object through the `user` prop.
- **`Card`** wraps `ProfileCard` as its child content.
- **`Module02`** combines these components into one interface and is exported as the module's default component.

---

## ➡️ Understanding Props

Props are values passed from a parent component to a child component. They let a component display different data without hard-coding that data into its own markup.

### Passing a simple prop

```jsx
<Header title="Viraj's React App" />
```

The parent supplies a `title` value. `Header` can receive that value through its props and render it.

### Passing an object prop

```jsx
const user = {
  name: "Viraj",
  role: "Frontend Developer",
  isAvailable: true,
  skills: ["JavaScript", "React", "Node.js"]
};

<ProfileCard user={user} />
```

The expression `{user}` passes the JavaScript object itself, rather than a string. The receiving component can access the object's properties through the `user` prop.

| Property | Value in this module |
|---|---|
| `name` | `Viraj` |
| `role` | `Frontend Developer` |
| `isAvailable` | `true` |
| `skills` | `JavaScript`, `React`, `Node.js` |

The exact way these values are displayed is handled by `ProfileCard`.

---

## 🧱 Component Composition & `children`

The module places `ProfileCard` inside `Card`:

```jsx
<Card>
  <ProfileCard user={user} />
</Card>
```

In React, content nested between a component's opening and closing tags is made available to that component through the special `children` prop.

This pattern allows a wrapper such as `Card` to provide a shared container while the parent chooses what content appears inside it. The wrapper does not need to know the specific details of the profile component.

```text
Card
 └── children
      └── ProfileCard
```

This is an example of **component composition**: building a larger interface by combining smaller components.

---

## 🔄 Rendering Flow

```text
Module02 renders
       │
       ├── Header receives title
       │
       └── Card receives nested children
                  │
                  └── ProfileCard receives user object
                              │
                              └── Profile information is rendered
```

The parent component provides the data and chooses how components are combined. Each child component is responsible for rendering its own part of the interface.

---

## 🛠️ Concepts & Technologies

| Concept | Role in this module |
|---|---|
| ⚛️ Function components | Define independent parts of the UI |
| 📦 ES module imports | Reuse components from other files |
| ➡️ Props | Pass values from parent to child components |
| 🗂️ Object props | Send structured user data to `ProfileCard` |
| 🧱 `children` | Render nested content inside `Card` |
| ♻️ Composition | Combine small components into a larger interface |
| 🟨 JSX | Describe the UI using JavaScript syntax extensions |

---

## ▶️ Running the Module

From Windows CMD, navigate to the React project directory:

```bat
cd /d D:\SDE\Development\Dev-Lab\frontend\react.js
npm run dev
```

Open the local URL printed by Vite. Use the project's existing navigation or module rendering setup to view **Module 02 — Components & Props**.

---

## 📌 Module Scope

This module focuses on passing data and composing components. It does not introduce component state, event handling, effects, or application-wide state management; those topics are handled in later modules.

---

## 🏁 Status

**Module 02 — Components & Props 📦**

The example demonstrates how a parent component imports reusable components, passes simple and structured props, and composes a wrapper with nested child content.

---

### 👨‍💻 Dev-Lab

Part of the broader **Dev-Lab React.js learning journey** — progressing from JSX fundamentals to reusable components and complete frontend architecture through practical implementation.
