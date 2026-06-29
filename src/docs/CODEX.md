# Codex.md

# Compound OS – AI Development Guide

## Purpose

This document defines how AI assistants (Codex, ChatGPT and similar tools) should work within the Compound OS project.

It exists to ensure that every change follows the same architectural principles, coding standards and product vision.

Before implementing any feature, read this document.

---

# Core Principles

Compound OS is an investment operating system.

It is **not**:

* a trading platform
* a portfolio tracker
* a stock screener
* a finance dashboard

Every feature should help users make better long-term investment decisions.

When proposing new functionality, prefer simplicity over feature count.

---

# Development Philosophy

Always prioritize:

1. Architecture
2. Domain model
3. User experience
4. Implementation details

Never sacrifice a clean architecture for short-term convenience.

---

# Coding Principles

* Business logic belongs in the domain layer.
* UI components should remain presentation-only.
* Prefer pure functions.
* Strong typing is required.
* Avoid duplicated logic.
* Keep components small and composable.
* Avoid unnecessary dependencies.
* Write tests for domain logic.

---

# UI

Always follow Design.md.

Do not introduce visual patterns that conflict with the design philosophy.

When implementing UI components, follow Components.md.

---

# Working Process

When implementing a feature:

1. Understand the problem.
2. Verify that it aligns with the product vision.
3. Design the domain model.
4. Implement the business logic.
5. Implement the UI.
6. Add tests.
7. Refactor if necessary.

Never implement UI first.

---

## Formatting

The project uses Prettier for formatting.

Do not manually change formatting.

Do not reformat unrelated files.

Keep diffs focused on the requested task.

---

# If Unsure

Choose the simplest solution that preserves a clean architecture.
