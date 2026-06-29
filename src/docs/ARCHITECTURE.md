# Architecture.md

# Compound OS Architecture

## Goal

Compound OS is built around a layered architecture where business rules remain independent of frameworks and user interface technology.

The architecture should allow the application to evolve without large rewrites.

---

## Layers

### Domain

Contains business rules and core investment concepts.

Examples:

* Portfolio
* Holding
* Dividend
* Risk
* Investment Policy
* Recommendation

The domain layer must never depend on React, browser APIs or external services.

---

### Application

Coordinates workflows between the domain and infrastructure.

Responsible for:

* orchestration
* commands
* queries
* use cases

---

### Infrastructure

Contains implementations for:

* APIs
* persistence
* local storage
* import/export
* third-party services

Infrastructure depends on the domain—not the other way around.

---

### UI

Responsible only for presentation.

Responsibilities include:

* rendering
* layout
* user interaction
* state presentation

Business decisions should never originate from UI components.

---

## Dependency Rule

Dependencies always point inward.

UI → Application → Domain

Infrastructure → Domain

The Domain layer must remain framework-independent.

---

## Testing

Priority:

1. Domain
2. Application
3. UI

Business rules should always be testable without rendering React.
