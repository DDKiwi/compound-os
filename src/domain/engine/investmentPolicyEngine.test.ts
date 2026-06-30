import { describe, expect, it } from "vitest";
import type { Holding, InvestmentPolicy, Portfolio } from "../types";
import { evaluateInvestmentPolicy } from "./investmentPolicyEngine";

const baseHolding: Holding = {
  id: "base",
  name: "Base Holding",
  ticker: "BASE",
  accountType: "ISK",
  marketValue: 100_000,
  monthlyContribution: 0,
  assetType: "Stock",
  classification: "SuperCompounder",
  portfolioRole: "Growth",
  moatScore: 4,
  countryExposure: "USA",
  currency: "USD",
  expectedDividendYield: 1,
  expectedDividendGrowth: 5,
  isWatchlist: false,
  isSpeculative: false,
  notes: "",
};

function createHolding(holding: Partial<Holding>): Holding {
  return {
    ...baseHolding,
    ...holding,
  };
}

function createPortfolio(holdings: Holding[]): Portfolio {
  return {
    id: "portfolio-1",
    holdings,
    cashBalance: 0,
    watchlist: [],
    journalEntries: [],
    dividendProjection: [],
  };
}

function createPolicy(
  policy: Partial<InvestmentPolicy> = {},
): InvestmentPolicy {
  return {
    id: "long-term-policy",
    name: "Long-term policy",
    philosophy: {
      text: "Own durable compounders and rebalance with discipline.",
    },
    riskTolerance: "balanced",
    allocationRules: [
      {
        id: "asset-target",
        name: "Asset allocation target",
        allocationType: "asset",
        targets: [
          { name: "Fund", targetWeight: 0.5 },
          { name: "Stock", targetWeight: 0.5 },
        ],
      },
    ],
    positionRule: {
      id: "max-position-size",
      maxWeight: 0.6,
    },
    exposureRule: {
      id: "max-sector-exposure",
      exposureType: "sector",
      maxWeight: 0.6,
    },
    dividendPolicy: {
      preference: "growth",
      notes: "Prefer dividend growth over current yield.",
    },
    rebalancingRule: {
      id: "rebalancing-threshold",
      driftThreshold: 0.1,
    },
    ...policy,
  };
}

describe("investmentPolicyEngine", () => {
  it("passes a portfolio that complies with the policy", () => {
    const portfolio = createPortfolio([
      createHolding({
        id: "global-index",
        name: "Global Index",
        ticker: "GLBL",
        sector: "Index",
        marketValue: 50_000,
        assetType: "Fund",
        classification: "GlobalIndex",
        portfolioRole: "Core",
      }),
      createHolding({
        id: "compounder",
        name: "Compounder",
        ticker: "CMP",
        sector: "Industrials",
        marketValue: 50_000,
        classification: "SuperCompounder",
      }),
    ]);

    const evaluation = evaluateInvestmentPolicy(portfolio, createPolicy());

    expect(evaluation.portfolioId).toBe("portfolio-1");
    expect(evaluation.policyId).toBe("long-term-policy");
    expect(evaluation).not.toHaveProperty("portfolio");
    expect(evaluation).not.toHaveProperty("investmentPolicy");
    expect(evaluation.violations).toEqual([]);
    expect(evaluation.warnings).toEqual([]);
    expect(evaluation.suggestedActions).toEqual([]);
    expect(evaluation.passedRules.map((rule) => rule.ruleId)).toEqual([
      "max-position-size",
      "max-sector-exposure",
      "rebalancing-threshold",
    ]);
  });

  it("violates policy when a holding exceeds max position size", () => {
    const portfolio = createPortfolio([
      createHolding({
        id: "oversized",
        name: "Oversized Holding",
        ticker: "BIG",
        sector: "Technology",
        marketValue: 70_000,
        classification: "SuperCompounder",
      }),
      createHolding({
        id: "global-index",
        name: "Global Index",
        ticker: "GLBL",
        sector: "Index",
        marketValue: 30_000,
        assetType: "Fund",
        classification: "GlobalIndex",
      }),
    ]);

    const evaluation = evaluateInvestmentPolicy(portfolio, createPolicy());

    expect(evaluation.violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: "max-position-size",
          actualWeight: 0.7,
          limitWeight: 0.6,
        }),
      ]),
    );
    expect(evaluation.suggestedActions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "max-position-size-1",
          ruleId: "max-position-size",
          type: "sell",
          priority: "high",
        }),
      ]),
    );
  });

  it("violates policy when a sector exceeds max exposure", () => {
    const portfolio = createPortfolio([
      createHolding({
        id: "tech-one",
        name: "Tech One",
        ticker: "T1",
        sector: "Technology",
        marketValue: 35_000,
        classification: "GlobalIndex",
      }),
      createHolding({
        id: "tech-two",
        name: "Tech Two",
        ticker: "T2",
        sector: "Technology",
        marketValue: 35_000,
        classification: "SuperCompounder",
      }),
      createHolding({
        id: "industrial",
        name: "Industrial",
        ticker: "IND",
        sector: "Industrials",
        marketValue: 30_000,
        classification: "SuperCompounder",
      }),
    ]);

    const evaluation = evaluateInvestmentPolicy(portfolio, createPolicy());

    expect(evaluation.violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: "max-sector-exposure",
          actualWeight: 0.7,
          limitWeight: 0.6,
        }),
      ]),
    );
  });

  it("warns when allocation drift exceeds the rebalancing threshold", () => {
    const portfolio = createPortfolio([
      createHolding({
        id: "global-index",
        name: "Global Index",
        ticker: "GLBL",
        sector: "Index",
        marketValue: 80_000,
        assetType: "Fund",
        classification: "GlobalIndex",
      }),
      createHolding({
        id: "compounder",
        name: "Compounder",
        ticker: "CMP",
        sector: "Industrials",
        marketValue: 20_000,
        classification: "SuperCompounder",
      }),
    ]);

    const evaluation = evaluateInvestmentPolicy(portfolio, createPolicy());

    const warning = evaluation.warnings.find(
      (policyWarning) =>
        policyWarning.ruleId === "rebalancing-threshold" &&
        policyWarning.actualWeight === 0.8,
    );

    expect(warning).toEqual(
      expect.objectContaining({
        ruleId: "rebalancing-threshold",
        actualWeight: 0.8,
        targetWeight: 0.5,
      }),
    );
    expect(warning?.driftWeight).toBeCloseTo(0.3);
    expect(evaluation.suggestedActions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: "rebalancing-threshold",
          type: "rebalance",
          priority: "medium",
        }),
      ]),
    );
  });

  it("preserves philosophy text", () => {
    const philosophyText =
      "Buy quality assets when valuation and durability align.";
    const portfolio = createPortfolio([
      createHolding({
        id: "global-index",
        name: "Global Index",
        ticker: "GLBL",
        sector: "Index",
        marketValue: 50_000,
        assetType: "Fund",
        classification: "GlobalIndex",
      }),
      createHolding({
        id: "compounder",
        name: "Compounder",
        ticker: "CMP",
        sector: "Industrials",
        marketValue: 50_000,
        classification: "SuperCompounder",
      }),
    ]);

    const evaluation = evaluateInvestmentPolicy(
      portfolio,
      createPolicy({
        philosophy: {
          text: philosophyText,
        },
      }),
    );

    expect(evaluation.policyId).toBe("long-term-policy");
    expect(evaluation).not.toHaveProperty("investmentPolicy");
    expect(
      createPolicy({ philosophy: { text: philosophyText } }).philosophy.text,
    ).toBe(philosophyText);
  });

  it("preserves dividend preference", () => {
    const portfolio = createPortfolio([
      createHolding({
        id: "global-index",
        name: "Global Index",
        ticker: "GLBL",
        sector: "Index",
        marketValue: 50_000,
        assetType: "Fund",
        classification: "GlobalIndex",
      }),
      createHolding({
        id: "compounder",
        name: "Compounder",
        ticker: "CMP",
        sector: "Industrials",
        marketValue: 50_000,
        classification: "SuperCompounder",
      }),
    ]);

    const evaluation = evaluateInvestmentPolicy(
      portfolio,
      createPolicy({
        dividendPolicy: {
          preference: "income",
          notes: "Current income is preferred.",
        },
      }),
    );

    expect(evaluation.policyId).toBe("long-term-policy");
    expect(evaluation).not.toHaveProperty("investmentPolicy");
    expect(
      createPolicy({
        dividendPolicy: {
          preference: "income",
          notes: "Current income is preferred.",
        },
      }).dividendPolicy,
    ).toEqual({
      preference: "income",
      notes: "Current income is preferred.",
    });
  });
});
