# Components

## Purpose

This document defines the component library and UI conventions used throughout Compound OS.

Design decisions belong in Design.md.

Implementation belongs in the codebase.

This document connects the two.

---

# Design Principles

Components should be:

* Predictable
* Reusable
* Accessible
* Consistent
* Calm

Components should never exist solely for decoration.

---

# Design Tokens

Every visual value should come from shared design tokens.

Avoid hard-coded:

* colors
* spacing
* radius
* shadows
* typography

If a new token is needed, define it before using it.

---

# Layout

Use composition instead of deeply nested containers.

Prefer:

AppShell

→ Sidebar

→ Header

→ Workspace

→ Panels

Panels should be the primary layout building block.

---

# Panel

Panels display related information.

Panels should:

* have a visible border
* use subtle elevation
* contain consistent padding
* never use decorative backgrounds

Panels should feel like physical workspaces rather than cards.

---

# Typography

Use a single monospace font family throughout the application.

Typography hierarchy should primarily use:

* size
* weight
* spacing

Avoid mixing multiple font families.

---

# Buttons

Buttons communicate actions.

Primary buttons should be used sparingly.

Secondary buttons should be the default.

Danger buttons should only represent destructive actions.

Avoid oversized buttons.

---

# Inputs

Forms should prioritize speed and readability.

Labels should always be visible.

Avoid placeholder-only labels.

Validation should appear close to the field.

---

# Tables

Tables are first-class citizens.

Prefer tables over cards when presenting structured financial data.

Support:

* sorting
* filtering
* alignment
* keyboard navigation

Numbers should be right-aligned.

---

# Status

Status is communicated primarily through:

* text
* icons
* subtle color

Never rely on color alone.

---

# Icons

Icons support text.

Icons should rarely replace text.

Use a consistent icon family throughout the application.

---

# Motion

Motion should communicate:

* loading
* expansion
* focus
* completion

Avoid decorative animation.

Transitions should be short and subtle.

---

# Empty States

Every empty state should explain:

* what the user is seeing
* why it is empty
* what they can do next

---

# Responsive Design

Compound OS is desktop-first.

Large screens are the primary target.

Responsive behavior should preserve information density whenever possible.

---

# Consistency Rule

When introducing a new component, ask:

Can an existing component solve this problem?

If yes, extend it instead of creating a new one.

---

# Component Lifecycle

Before creating a new component:

1. Look for an existing one.
2. Extend it if appropriate.
3. Create a new component only if the responsibility is unique.

Avoid component duplication.