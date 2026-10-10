# 🧩 Module 07 — Component Composition & Reusability

> A small team dashboard showing how reusable components can be composed to keep repeated UI consistent and easy to maintain.

---

## 📚 Overview

This module builds a team-member list from small components with focused responsibilities. A `Card` provides a wrapper, `TeamMemberCard` presents one member's information, and `StatusBadge` displays the member's status.

```text
Module07
   ↓ maps teamMembers
  Card
   ↓ children
  TeamMemberCard
   ↓ props
  StatusBadge
```

---

## 🧠 Concepts Covered

- 🧱 Breaking a view into smaller components
- 📦 Passing data through props
- 🧩 The special `children` prop
- 🔁 Reusing the same component for multiple records
- 📋 Rendering data arrays with `.map()`
- 🔑 Using stable keys for repeated components
- 🎯 Keeping each component focused on one responsibility

---

## 🗂️ Module Structure

```text
07-Component-Composition-Reusability/
└── Module07.jsx
```

The components are defined in the same module file to keep the composition example easy to follow.

---

## 🧱 Component Responsibilities

| Component | Responsibility |
|---|---|
| `Card` | Wraps its children in a `div` with the `card` class |
| `StatusBadge` | Displays the supplied status text |
| `TeamMemberCard` | Renders a member's name, role, and status component |
| `Module07` | Maps over the team-member data and composes the cards |

### `children` composition

`Card` receives `children` and renders them inside its wrapper. This allows the parent to decide what content belongs inside a card without making `Card` depend on a specific content type.

### Props flow

`Module07` passes each member's `name`, `role`, and `status` into `TeamMemberCard`. The latter forwards `status` to `StatusBadge`.

---

## 👥 Team Data

The static `teamMembers` array contains four sample records. Each has an `id`, `name`, `role`, and `status`. The status values shown in the example are `Active`, `Away`, and `Offline`.

Each record is wrapped in a `Card` keyed by `member.id`.

---

## 📌 Implementation Notes

- The data is local and hard-coded; there is no API request or state management in this module.
- The `Card` class and `team-member-info` class are styling hooks. The component file itself does not define their CSS.
- Composition is used instead of duplicating the same markup for each team member.

---

## 🧭 Position in the Learning Path

Module 02 introduced components and props. Module 07 builds on those fundamentals by showing how components can be nested and combined, including a component that accepts arbitrary content through `children`.

---

## 🏁 Module Summary

**Module 07: Component Composition & Reusability** demonstrates how a parent can assemble small, reusable components into a complete view while keeping data and presentation responsibilities separate.
