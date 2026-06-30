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
* Domain models expose raw values, not formatted strings.
* Presentation formatting belongs to shared UI formatters.
* Prefer builders for assembling complex domain objects.
* Engines perform calculations and orchestration.
* Builders compose objects.
* Prefer pure functions.
* Strong typing is required.
* Avoid duplicated logic.
* Keep components small and composable.
* Avoid unnecessary dependencies.
* Write tests for domain logic.
* Prefer a single source of truth for shared logic.

---

# UI

Always follow Design.md.

Do not introduce visual patterns that conflict with the design philosophy.

When implementing UI components, follow Components.md.

The UI should never duplicate formatting logic.

Use shared formatters for:
- currency
- percentages
- dates
- numbers
- scores

Technical metadata should not be exposed to users unless it provides user value.

Do not expose technical identifiers or implementation details to users unless they provide user value.

---

# Working Process

When implementing a feature:

1. Understand the problem.
2. Verify that it aligns with the product vision.
3. Design the domain model.
4. Implement the business logic.
5. Implement the UI.
6. Add or update tests.
7. Verify:
   - npm test -- --run
   - npm run check
   - npm run build
8. Refactor if necessary.

Never implement UI first.

---

## Formatting

The project uses Prettier for formatting.

Do not manually change formatting.

Do not reformat unrelated files.

Keep diffs focused on the requested task.

---

# Domain Boundaries

The domain is the source of truth.

The domain should expose:
- entities
- value objects
- reports
- summaries
- recommendations
- insights

The domain must never:
- format values
- contain UI concerns
- contain presentation text
- depend on UI components

Presentation concerns belong to the UI layer.

---

# Small Commits

Prefer small, focused changes.

Each commit should ideally introduce one architectural improvement or one user-facing feature.

Avoid mixing refactoring, new functionality and UI changes in the same commit.

---

# Architecture

Maintain clear separation of responsibilities.

- Domain computes.
- Builders compose.
- UI presents.
- Formatters control presentation.

---

# If Unsure

Choose the simplest solution that preserves a clean architecture.
