# 🚀 Module 01 — Fundamentals & JSX

> The first React module in **Dev-Lab** — a hands-on introduction to JSX, JavaScript expressions inside UI, rendering object properties and arrays, conditional output, and displaying lists with `.map()`.

---

## 📚 Overview

This module introduces the basic connection between **JavaScript data** and **React UI**.

Instead of writing static HTML, the component uses JavaScript variables, an object, and an array to produce its output. It also demonstrates two common ways to render content conditionally and how to turn an array into a list of JSX elements.

The example is intentionally small. The focus is on understanding how the values defined in a component appear in the rendered interface.

---

## 🎯 Learning Objectives

By working through this module, you should understand how to:

- 🧩 Write JSX inside a React component
- 🔤 Insert JavaScript expressions into JSX using `{}`
- 👤 Read values from an object using dot notation
- 📋 Render an array as a list with `.map()`
- 🔑 Provide a `key` for each rendered list item
- ❓ Use a ternary expression for conditional text
- ✅ Use `&&` to render an element only when a condition is true
- 📦 Export a component so it can be imported elsewhere

---

## 🗂️ Module Location

```text
frontend/
└── react.js/
    └── src/
        └── modules/
            └── 01-Fundamentals-JSX/
                ├── Module01.jsx
                └── README.md   ← this documentation
```

`Module01.jsx` contains the example component for this module. The module runs inside the existing Vite React application; it is **not a separate React project** and does not need its own `package.json` or development server.

---

# 🧱 1. Component & JavaScript Values

The module defines a component named `Module01` and creates a few JavaScript values inside it:

```jsx
const name = "Viraj";
const course = "React";

const user = {
  name: "Viraj",
  age: 22,
  isStudent: true,
};

const skills = ["JavaScript", "React", "Node.js"];
```

### 🔍 What these values represent

| Value | Type | Purpose in the example |
|---|---|---|
| `name` | String | Supplies a name for the greeting |
| `course` | String | Supplies the course name for the greeting |
| `user` | Object | Groups a name, age, and student status |
| `skills` | Array | Stores the skills to render as a list |

These values are declared inside the component function. When React renders the component, the JSX can use them to produce the UI.

---

# 🧩 2. JSX & JavaScript Expressions

JSX lets a component describe the UI using HTML-like syntax. Curly braces `{}` allow JavaScript **expressions** to be evaluated and displayed inside that JSX.

The module includes:

```jsx
<p>Hello {name}, Welcome to {course}</p>
```

Because `name` and `course` are JavaScript variables, React inserts their current values into the rendered paragraph.

### 🧠 Remember

- JSX tags describe elements in the UI.
- Text can be written directly between JSX tags.
- Use `{expression}` when you need a JavaScript value or expression inside JSX.
- A JavaScript statement such as `const name = ...` is not placed directly inside JSX braces; define the value in JavaScript and render the expression where needed.

---

# 👤 3. Rendering Object Properties

The `user` object groups related values:

```jsx
const user = {
  name: "Viraj",
  age: 22,
  isStudent: true,
};
```

The component accesses those values using dot notation:

```jsx
<p>Name: {user.name}</p>
<p>Age: {user.age}</p>
```

This is a simple example of using structured JavaScript data to populate a component's UI.

---

# ❓ 4. Conditional Rendering with a Ternary

The module displays student status with a ternary expression:

```jsx
<p>Student: {user.isStudent ? "Yes" : "No"}</p>
```

The expression checks `user.isStudent`:

```text
Condition is true  →  "Yes"
Condition is false →  "No"
```

A ternary is useful when JSX should display one value or another based on a condition.

---

# 📋 5. Rendering Arrays with `.map()`

The `skills` array contains three strings. The component turns each string into a list item:

```jsx
<ul>
  {skills.map((skill) => (
    <li key={skill}>{skill}</li>
  ))}
</ul>
```

### 🔄 How it works

```text
skills array
    ↓ .map()
"JavaScript"  →  <li>JavaScript</li>
"React"       →  <li>React</li>
"Node.js"     →  <li>Node.js</li>
    ↓
React renders the list
```

### 🔑 Why is `key` used?

React uses keys to distinguish items in a rendered list when that list changes. In this example, each skill string is used as its key because the values are distinct.

For lists that can contain duplicate values or whose items can be reordered, use a stable, unique identifier from the data when one is available.

---

# ✅ 6. Conditional Rendering with `&&`

The component also contains:

```jsx
{user.isStudent && <p>Currently studying React.</p>}
```

The paragraph is rendered when `user.isStudent` is truthy. If the condition is false, React does not render that paragraph.

Use this pattern when you want to show an element only when a condition is met, rather than choosing between two different outputs.

---

# 🧭 7. How the Module Fits into Dev-Lab

The React learning modules live inside one Vite application. `Module01.jsx` exports the component:

```jsx
export default Module01;
```

The application decides which screen or route displays the module. The module itself does not start a server or configure routing.

```text
Vite React application
        ↓
Application routing / module selection
        ↓
Module01 component
        ↓
JavaScript values + JSX
        ↓
Rendered greeting, user details, and skills list
```

---

# ▶️ 8. Running the Example

## Prerequisites

- 🟢 Node.js and npm installed
- 📦 Dependencies installed in `frontend/react.js/`

## Start the React application

Open **Windows CMD** and run:

```bat
cd /d D:\SDE\Development\Dev-Lab\frontend\react.js
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

The app's routing determines which page is displayed. If Module 01 is not the current route, navigate to the route or module-selection entry configured in the application rather than starting a second server.

---

# 🧪 9. Practice Exercises

Try these changes in `Module01.jsx` before looking up a solution.

### Exercise 1 — Update the greeting

- Change the `name` variable.
- Change the `course` variable.
- Observe how the greeting changes.

### Exercise 2 — Add an object property

- Add a `city` property to `user`.
- Render the city in a new paragraph using `user.city`.

### Exercise 3 — Add a skill

- Add another string to `skills`.
- Confirm that `.map()` renders another list item without manually writing a new `<li>`.

### Exercise 4 — Test the ternary

- Change `user.isStudent` to `false`.
- Observe the student status text.
- Restore it to `true` and compare the result.

### Exercise 5 — Test `&&`

- Change `user.isStudent` to `false`.
- Confirm that “Currently studying React.” is no longer displayed.

---

# 🧠 Key Takeaways

By the end of this module, you should be able to explain:

- How JavaScript values are inserted into JSX.
- How object properties are accessed and rendered.
- How `.map()` converts array items into JSX elements.
- Why list elements need stable keys.
- The difference between ternary rendering and `&&` conditional rendering.

These fundamentals are used throughout the later modules for props, state, forms, API data, routing, and application architecture.

---

## 📌 Module Status

**Module 01 — Fundamentals & JSX**

- [x] Component and JSX example documented
- [x] Variables, object properties, and array rendering documented
- [x] Ternary and `&&` conditional rendering documented
- [ ] Practice exercises completed independently

> Documentation describes the current `Module01.jsx` example. Mark the practice exercises complete after implementing and testing the changes yourself.

---

### 👨‍💻 Dev-Lab · React.js Learning Journey

**Next module:** `02-Components-Props` — building reusable components and passing data through props.
