# Decisions

## Purpose

This document records important architectural and product decisions.

The goal is to preserve the reasoning behind decisions, not just the outcome.

Each decision should remain concise and easy to understand.

---

# Decision Template

## Decision XXXX

### Title

A short descriptive title.

### Status

* Proposed
* Accepted
* Superseded
* Deprecated

### Context

Describe the problem or situation.

### Decision

Describe the chosen solution.

### Rationale

Explain why this solution was selected.

### Consequences

List the expected effects, trade-offs and limitations.

---

# Decision 0001

## Title

Investment Policy is the central domain object.

### Status

Accepted

### Context

Every engine requires a common understanding of the investor's philosophy.

### Decision

All domain engines evaluate portfolios against a shared Investment Policy.

### Rationale

This creates a consistent and extensible domain model.

### Consequences

* All engines share a common language.
* UI edits a single policy.
* Future AI features interpret the policy instead of replacing it.

---

# Decision 0002

## Title

Assets are generic.

### Status

Accepted

### Context

The platform should support more than stocks.

### Decision

The domain is built around Assets rather than Stocks.

### Rationale

New asset classes can be introduced without redesigning the core domain.

### Consequences

The domain remains extensible.

---

# Decision 0003

## Title

Business logic belongs in the Domain layer.

### Status

Accepted

### Context

Frameworks evolve faster than business rules.

### Decision

Business logic must remain independent of React and infrastructure.

### Rationale

This improves maintainability, testing and long-term flexibility.

### Consequences

UI remains focused on presentation.
