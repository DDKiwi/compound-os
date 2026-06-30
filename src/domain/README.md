# Domain

## Purpose

`src/domain` contains the core business logic for Compound OS.

This layer models the investment domain independently from presentation, persistence and integration details. It is responsible for turning portfolio inputs and an investment policy into a deterministic `InvestmentAnalysisReport`.

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

The investment analysis pipeline is coordinated by `InvestmentAnalysisEngine.analyze`.

```ts
Portfolio
  -> InvestmentAnalysisEngine
  -> InvestmentAnalysisReport
```

The pipeline is intentionally explicit:

1. Raw portfolio input is normalized into domain objects.
2. Derived portfolio metrics are calculated.
3. The investment policy, snapshot, allocation and metrics are combined into an internal `InvestmentContext`.
4. Rules evaluate the context and return objective results.
5. Rule results are summarized.
6. Recommendations are built from rule results when a rule supports them.
7. Insights are built from the dividend forecast, rule summary and rule results.
8. The final `InvestmentAnalysisReport` is returned to callers.

Each step should remain deterministic and testable. The same input should always produce the same output.

`InvestmentAnalysisReport` is the primary public contract exposed by the Domain layer. React UI, dashboards, reports, CLIs, Azure Functions, MCP servers and assistants should consume this report instead of depending on the internal pipeline shape.

When callers need metadata around a single run, `InvestmentAnalysisEngine.createSession` returns an `InvestmentAnalysisSession` containing the portfolio, policy and generated report. It does not persist the session.

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

### InvestmentHealth

`InvestmentHealth` is a portfolio-level health concept built from an `InvestmentAnalysisSummary`.

The first version uses the existing rule score as the health score and maps it to deterministic statuses: excellent, good, fair or poor.

### InvestmentDiagnosis

`InvestmentDiagnosis` summarizes why the portfolio looks the way it does by grouping existing insights into strengths and weaknesses, while carrying existing recommendations as opportunities.

The first version uses the insight identifiers already produced by `InsightBuilder` and does not introduce a new classification model.

### InvestmentImpact

`InvestmentImpact` describes the expected portfolio effect of a recommendation.

The first version returns a valid impact object with unset change fields because recommendation-level simulation is not implemented yet.

### InvestmentDecision

`InvestmentDecision` composes the key decision inputs from an analysis: investment health, the top recommendation, diagnosis and optional impact.

It reuses existing builders and accepts existing insights and recommendations when callers have the full analysis data available.

### InvestmentSimulationInput

`InvestmentSimulationInput` describes a future what-if simulation request by combining a portfolio, policy and intended action such as buy, sell, deposit or withdraw.

### RecommendationBuilder

`RecommendationBuilder` converts rule results into actionable recommendations when the corresponding rule provides recommendation logic.

It does not invent recommendations on its own. Recommendations remain tied to rule outcomes so the user can understand what triggered them and why they matter.

### TopRecommendationBuilder

`TopRecommendationBuilder` selects the recommendation that should be shown first in compact analysis summaries.

It ranks recommendations by existing fields: severity first, then confidence. If recommendations have the same priority, it preserves their original order.

### InsightBuilder

`InsightBuilder` converts analysis facts into observations that help users understand the portfolio.

Insights are not rules and they are not recommendations. They should remain deterministic and should not call AI, APIs or persistence.

### InvestmentAnalysisReport

`InvestmentAnalysisReport` represents the final output of the Domain engine.

It contains the generated timestamp, portfolio snapshot, allocation, metrics, optional dividend forecast, rule summary, rule results, recommendations and insights. Consumers should treat the report as immutable and serializable, with `Date` as the only non-plain JSON value.

### InvestmentAnalysisSession

`InvestmentAnalysisSession` represents a single savable analysis run.

It connects the analyzed portfolio, investment policy and resulting `InvestmentAnalysisReport` with session metadata such as id, creation time and version. Session objects are created by `InvestmentAnalysisSessionBuilder`; persistence and UI behavior belong outside this type.

`InvestmentAnalysisSummary` is a UI-friendly overview built from a session report. Dashboards can use it for high-level values, investment health, rule status, recommendations and insight counts without depending on the full `InvestmentAnalysisReport` shape.

### InvestmentAnalysisEngine

`InvestmentAnalysisEngine` coordinates the full domain pipeline.

Its `analyze` method calls builders for the snapshot, allocation, metrics, rule summary, recommendations and insights, creates the internal `InvestmentContext`, evaluates rules and returns a complete `InvestmentAnalysisReport` for the application layer to consume.

Its `createSession` method runs the same analysis and wraps the portfolio, policy and report in an `InvestmentAnalysisSession` through `InvestmentAnalysisSessionBuilder`.

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
