# Compound OS Roadmap

## Product Vision

Compound OS is an Investment Operating System.

It is **not**:

* a portfolio tracker
* a trading platform
* a stock screener

It helps investors understand their portfolio, evaluate decisions and explore future scenarios.

---

## Current Status

Current phase:

**Phase 4 — Scenario Experience**

Completed phases:

* ✅ Phase 1 — Domain Foundation
* ✅ Phase 2 — Analysis Experience
* ✅ Phase 3 — Simulation & Planning

The current domain architecture is considered stable.

### Current objective

Build the first dashboard-ready scenario experience by exposing the existing domain pipeline through a clean, UI-friendly scenario model.

### Current direction

* Build the first dashboard-consumable scenario result.
* Add the first visual scenario summary.
* Reuse existing engines and builders.
* Keep the current domain folder structure.
* Continue with small, focused commits.
* Avoid large refactorings unless they significantly improve the domain model.

### Next immediate step

Add the first dashboard-ready scenario result.

---

## Working Principles

* Domain computes.
* Builders compose.
* UI presents.
* Formatters control presentation.
* One focused commit per change.
* Reuse existing domain models whenever possible.
* Prefer explicit domain models over loosely shaped objects.
* Optimize for long-term domain clarity over short-term implementation speed.

---

## Foundation

Establish the domain model, investment policy concepts, portfolio facts, deterministic rules and the core investment analysis pipeline.

**Status:** ✅ Complete

---

## Core

Build the fundamental investment operating system around portfolios, holdings, policies, transactions and reusable domain engines.

**Status:** ✅ Complete

---

## Analysis Experience

Build the analysis experience around investment health, diagnosis, recommendations, impacts and summaries that can be consumed consistently by dashboards and assistants.

**Status:** ✅ Complete

---

## Simulation & Planning

Introduce deterministic investment simulation, portfolio transactions, scenario execution and reusable simulation outputs built on top of the existing domain model.

**Status:** ✅ Complete

---

## Scenario Experience

Expose simulation results through dashboard-friendly domain models and create visual decision support for investors.

Planned work includes:

* Dashboard scenario summary
* Scenario cards
* Scenario comparison
* Timeline visualization
* Future decision support

**Status:** 🚧 In Progress

---

## Intelligence

Introduce higher-level interpretation, prioritization and AI-assisted workflows on top of the domain outputs without moving business logic into the UI.

Future capabilities may include:

* Goal-driven planning
* FIRE planning
* AI-assisted investment reasoning
* Recommendation refinement
* Long-term portfolio coaching

---

## Automation

Support repeatable workflows, scheduled evaluations, portfolio synchronization and assistant-driven actions while keeping persistence and integrations outside the domain layer.

---

## Future

Continue expanding Compound OS into a complete Investment Operating System where the same domain model powers:

* Analysis
* Simulation
* Scenario planning
* Decision support
* Automation
* AI-assisted investing

Every new capability should extend the existing domain model rather than introduce parallel concepts.
