# Compound OS Project State

## Current Phase

**Phase 4 — Scenario Experience**

Compound OS is moving from simulation infrastructure toward the first visual scenario experience.

The immediate goal is to expose scenario results in a dashboard-friendly shape without changing the existing architecture.

---

## Architecture Status

The current architecture is stable.

Keep the existing domain structure for now:

* `src/domain/types`
* `src/domain/builders`
* `src/domain/engine`
* `src/domain/simulation`

Do **not** introduce a new `domain/scenario` module structure yet.

---

## Completed Foundation

The following major areas are complete enough to build on:

* Investment policy model
* Rule engine
* Investment analysis engine
* Investment analysis report
* Investment analysis summary
* Top recommendation builder
* Dashboard-consuming domain models
* Shared UI formatters
* Investment simulation input/result models
* Simulation context, steps, timeline and projections
* Portfolio transactions
* Portfolio engine
* Portfolio transaction handlers
* Portfolio transaction factory
* Scenario model
* Scenario input builder
* Scenario engine
* Scenario result
* First scenario card view model
* First ScenarioCard component

---

## Recent Architectural Decisions

* `InvestmentScenario` is the entry point for future planning.
* `InvestmentScenarioEngine` orchestrates scenario execution.
* `InvestmentSimulationEngine` runs simulation inputs.
* `PortfolioTransactionFactory` creates transactions from simulation steps.
* `PortfolioEngine` owns all portfolio mutations.
* Simulation actions should not contain portfolio mutation logic.
* UI should consume scenario-facing result models, not internal simulation details.
* Builders should create dashboard-ready shapes.
* Current folder structure should remain unchanged until there is a strong architectural reason to modularize.

---

## Current Focus

Build the first dashboard experience for scenarios.

The next immediate slice should be:

```text
domain pipeline
  -> scenario result
  -> dashboard-ready scenario summary
  -> first visual UI block
```

The first UI-facing model should be thin, explicit and derived from existing domain outputs.

---

## Not Now

Do not introduce yet:

* New domain module structure
* Scenario comparison
* Goal-driven scenario planning
* Timeline engine
* Persistence
* Broker integrations
* Advanced what-if editing
* Large dashboard redesign
* Major refactoring

---

## Working Style

Use small, focused Codex prompts.

Each task should produce one commit.

Each prompt should include:

* Goal
* Steps
* Important constraints
* Verification commands
* Suggested Conventional Commit message

Preferred commit style:

```text
feat(domain): ...
feat(scenario): ...
feat(simulation): ...
feat(builders): ...
feat(ui): ...
refactor(domain): ...
refactor(builders): ...
fix(ui): ...
docs(project): ...
```

---

## Core Principles

* Domain computes.
* Builders compose.
* UI presents.
* Formatters control presentation.
* One focused commit per change.
* Prefer explicit domain concepts over loosely shaped objects.
* Optimize for long-term domain clarity over short-term implementation speed.
