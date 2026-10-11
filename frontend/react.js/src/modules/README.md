# ⚛️ React.js Learning Modules

> A structured, hands-on React.js curriculum that progresses from JSX fundamentals to reusable UI, state management, API integration, authentication, and frontend architecture.

---

## 📚 Overview

The `modules/` directory contains **11 focused React.js modules**. Each module isolates a major frontend concept and includes its own `README.md` explaining the module's purpose, concepts, structure, and implementation.

The sequence is designed to build understanding progressively: start by describing UI with JSX, then learn how to split it into components, manage interaction and forms, work with effects and routes, communicate with APIs, handle authentication, and organize more complex state.

## 🧭 Learning Path

```text
01  React Fundamentals & JSX
 ↓
02  Components & Props
 ↓
03  State & Events
 ↓
04  Conditional Rendering & Lists
 ↓
05  Forms & Controlled Components
 ↓
06  useEffect & Component Lifecycle
 ↓
07  Component Composition & Reusability
 ↓
08  Routing
 ↓
09  API Integration
 ↓
10  Authentication & Protected Routes
 ↓
11  State Management & Frontend Architecture
 ↓
🚀 DevBoard — Full-Stack Capstone (outside this modules directory)
```

---

## 🗂️ Module Directory

| # | Module | Main focus | Documentation |
|---|---|---|---|
| 01 | **React Fundamentals & JSX** | JSX syntax, JavaScript expressions, conditional output, and lists | [`01-Fundamentals-JSX/README.md`](./01-Fundamentals-JSX/README.md) |
| 02 | **Components & Props** | Component creation, imports, props, and reusable UI | [`02-Components-Props/README.md`](./02-Components-Props/README.md) |
| 03 | **State & Events** | `useState`, event handlers, and state updates | [`03-State-Events/README.md`](./03-State-Events/README.md) |
| 04 | **Conditional Rendering & Lists** | Conditional UI, rendering collections, searching, and filtering | [`04-Conditional-Rendering-Lists/README.md`](./04-Conditional-Rendering-Lists/README.md) |
| 05 | **Forms & Controlled Components** | Controlled fields, form state, validation, submission, and reset | [`05-Forms-Controlled-Components/README.md`](./05-Forms-Controlled-Components/README.md) |
| 06 | **useEffect & Component Lifecycle** | Effects, asynchronous data loading, loading/error UI, and cleanup | [`06-UseEffect-Component-Lifecycle/README.md`](./06-UseEffect-Component-Lifecycle/README.md) |
| 07 | **Component Composition & Reusability** | `children`, reusable UI pieces, and composition | [`07-Component-Composition-Reusability/README.md`](./07-Component-Composition-Reusability/README.md) |
| 08 | **Routing** | React Router, links, URL parameters, nested routes, and navigation | [`08-Routing/README.md`](./08-Routing/README.md) |
| 09 | **API Integration** | HTTP requests, data loading, search, and API-backed interactions | [`09-API-Integration/README.md`](./09-API-Integration/README.md) |
| 10 | **Authentication & Protected Routes** | Authentication context, login/logout flow, and route protection | [`10-Authentication-Protected-Routes/README.md`](./10-Authentication-Protected-Routes/README.md) |
| 11 | **State Management & Frontend Architecture** | `useReducer`, reducer actions, component boundaries, and state organization | [`11-State-Management-Frontend-Architecture/README.md`](./11-State-Management-Frontend-Architecture/README.md) |

---

## 🧠 What This Curriculum Covers

### 🧱 Building React interfaces

- JSX and rendering JavaScript data
- Creating components and passing props
- Composing larger interfaces from smaller components
- Rendering lists and handling conditional states

### 🔄 Managing interaction and data

- Updating UI with `useState`
- Handling user events
- Building controlled forms and validating input
- Using `useEffect` for side effects and asynchronous work
- Showing loading, error, empty, and success states

### 🌐 Building application flows

- Navigating between pages with React Router
- Reading URL parameters and creating nested routes
- Calling REST endpoints and handling responses
- Introducing authentication context and protected pages
- Using `useReducer` when state transitions benefit from a reducer

---

## 🧩 How the Modules Fit Together

The modules are learning examples, not one single application that must be run all at once. Each directory focuses on a concept and may have its own example components and implementation details.

```text
src/
└── modules/
    ├── README.md                         # Curriculum overview and navigation
    ├── 01-Fundamentals-JSX/
    ├── 02-Components-Props/
    ├── 03-State-Events/
    ├── 04-Conditional-Rendering-Lists/
    ├── 05-Forms-Controlled-Components/
    ├── 06-UseEffect-Component-Lifecycle/
    ├── 07-Component-Composition-Reusability/
    ├── 08-Routing/
    ├── 09-API-Integration/
    ├── 10-Authentication-Protected-Routes/
    └── 11-State-Management-Frontend-Architecture/
```

*The tree above shows the intended module layout. Individual module files and supporting components are documented in each module's README.*

---

## ✅ Recommended Way to Use This Folder

1. **Follow the numbered order.** Later modules build on concepts introduced earlier.
2. **Read the module README first.** It explains what the example demonstrates and where the important pieces live.
3. **Inspect the source code.** Trace how props, state, events, and data move between components.
4. **Run the example through the parent React application** when that module is wired into the app. The modules are not necessarily configured as separate standalone projects.
5. **Keep the capstone separate.** The DevBoard application lives outside this directory and brings many of these concepts together in a fuller frontend/backend workflow.

---

## ⚠️ Scope & Implementation Notes

- These modules demonstrate React concepts at different levels of completeness; they should not automatically be treated as production-ready features.
- The authentication example is a learning implementation with mock authentication, not a replacement for secure server-side authentication.
- API examples may use JSONPlaceholder or other demonstration endpoints. Requests to demo APIs may not persist data in the way a real application backend would.
- State held in React memory is generally reset when the page is refreshed unless persistence is implemented separately.
- Refer to each module's README and source files for the exact behavior and limitations of that example.

---

## 🚀 Next Step

After working through the modules, continue to **DevBoard**, the full-stack capstone in the wider React.js project. It applies frontend concepts in a larger application connected to the FastAPI backend in Dev-Lab.

---

<p align="center">
  <b>⚛️ Learn the pieces. Understand the flow. Build the application. 🚀</b>
</p>
