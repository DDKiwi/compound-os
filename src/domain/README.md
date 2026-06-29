# Domain

## Purpose

`src/domain` contains the core business logic for Compound OS.

This layer models the investment domain independently from presentation, persistence and integration details. It is responsible for turning portfolio inputs and an investment policy into deterministic analysis results, summaries and recommendations.

The domain exists so that long-term investment decisions can be evaluated in one place, using consistent concepts and rules.

It must not depend on:

* React
* API clients
* databases
* routing
* state management
* browser-specific behavior

Any dependency should point into the domain layer, not from the domain layer into the application shell.

---

## Pipeline

The investment analysis pipeline is coordinated by `analyzeInvestment`.

```ts
input
  -> PortfolioSnapshotBuilder
  -> PortfolioAllocationBuilder
  -> PortfolioMetricsBuilder
  -> InvestmentContext
  -> RuleEngine
  -> RuleSummaryBuilder
  -> RecommendationBuilder
  -> InvestmentAnalysisResult
```

The pipeline is intentionally explicit:

1. Raw portfolio input is normalized into domain objects.
2. Derived portfolio metrics are calculated.
3. The investment policy, snapshot, allocation and metrics are combined into an `InvestmentContext`.
4. Rules evaluate the context and return objective results.
5. Rule results are summarized.
6. Recommendations are built from rule results when a rule supports them.
7. The final analysis result is returned to callers.

Each step should remain deterministic and testable. The same input should always produce the same output.

---

## Responsibilities

### PortfolioSnapshot

`PortfolioSnapshot` represents the high-level state of a portfolio at a point in time.

It currently contains total value, cash value and cash weight. It is built from raw snapshot input and validates basic portfolio invariants, such as preventing negative values and preventing cash from exceeding total portfolio value.

Use it for portfolio-level facts that are needed by rules and metrics.

### PortfolioAllocation

`PortfolioAllocation` describes how the portfolio is distributed across meaningful dimensions.

It groups allocation weights for holdings, sectors, countries, currencies and asset classes. Rules use this structure to evaluate concentration, diversification and policy alignment.

Allocation entries should represent domain facts, not UI formatting.

### PortfolioMetrics

`PortfolioMetrics` contains derived measurements calculated from portfolio state.

Metrics should be computed from domain objects rather than duplicated across callers. This keeps rule evaluation consistent and avoids spreading calculation logic into the UI or application layer.

### Builders

Builders live in `src/domain/builders`.

They build deterministic domain objects from explicit inputs. They should remain pure, testable and free from orchestration concerns.

### InvestmentContext

`InvestmentContext` is the shared input passed to investment rules.

It combines:

* `InvestmentPolicy`
* `PortfolioSnapshot`
* `PortfolioAllocation`
* `PortfolioMetrics`

Rules should read from the context and return results. They should not fetch data, mutate application state or reach into UI concerns.

### RuleEngine

`RuleEngine` evaluates a list of investment rules against an `InvestmentContext`.

Its responsibility is orchestration only: it calls each rule and collects the returned `RuleResult` values. Rule-specific decisions belong inside individual rules.

### RuleSummary

`RuleSummary` aggregates rule results into a compact overview.

It tracks totals for passed, warning and failed rules, calculates an overall score and exposes summary fields that higher layers can display without reimplementing scoring logic.

### RecommendationBuilder

`RecommendationBuilder` converts rule results into actionable recommendations when the corresponding rule provides recommendation logic.

It does not invent recommendations on its own. Recommendations remain tied to rule outcomes so the user can understand what triggered them and why they matter.

### InvestmentAnalysisEngine

`InvestmentAnalysisEngine` coordinates the full domain pipeline.

It calls builders for the snapshot, allocation, metrics, rule summary and recommendations, creates the `InvestmentContext`, evaluates rules and returns a complete `InvestmentAnalysisResult` for the application layer to consume.

This engine is the main entry point for investment analysis.

---

## Boundary Rules

The domain layer should stay pure, deterministic and framework independent.

Allowed in `src/domain`:

* domain types
* pure calculation functions
* validation of domain invariants
* investment rules
* domain engines
* deterministic builders
* mock domain data used for development and tests

Avoid in `src/domain`:

* React components or hooks
* API calls
* database access
* local storage
* global state stores
* routing
* formatting that only exists for presentation

Application code may call the domain. The domain must not call application code.
