export type Debt = {
  id: string;
  name: string;
  balance: number;
  /** Annual percentage rate as a decimal, e.g. 0.249 for 24.9% APR. */
  apr: number;
  /** Contractual minimum monthly payment. */
  minPayment: number;
};

export type DebtInputs = {
  debts: Debt[];
  /** Total amount available for debt payments each month. Must be >= sum of minimum payments. */
  monthlyBudget: number;
};

export type PayoffEvent = {
  id: string;
  name: string;
  month: number;
};

export type DebtStrategyResult = {
  strategy: "snowball" | "avalanche" | "minimums";
  monthsToDebtFree: number;
  totalInterest: number;
  /** False when the budget cannot clear the debts within the month cap (e.g. payments below interest). */
  payable: boolean;
  payoffOrder: PayoffEvent[];
  series: { month: number; totalRemaining: number }[];
};

export type DebtOutputs = {
  snowball: DebtStrategyResult;
  avalanche: DebtStrategyResult;
  /** Baseline "do nothing extra" plan: every debt gets only its fixed minimum payment. */
  minimumsOnly: DebtStrategyResult;
  totalBalance: number;
  totalMinimums: number;
  /** False when monthlyBudget is below the sum of minimum payments. */
  budgetValid: boolean;
  /** Months by which the faster strategy beats the slower one (0 when equal or not payable). */
  monthsSavedByBest: number;
  /** Interest saved by choosing the cheaper strategy (avalanche minus snowball when positive). */
  interestSavedByBest: number;
  /** Months the best strategy saves versus paying only the minimums (0 when not payable). */
  monthsSavedVsMinimums: number;
  /** Interest the best strategy saves versus paying only the minimums (0 when not payable). */
  interestSavedVsMinimums: number;
  /** Which strategy clears the debts cheapest. */
  bestStrategy: "snowball" | "avalanche";
};

/** Hard cap so pathological inputs (payments below monthly interest) terminate. */
const MAX_MONTHS = 600;

type SimDebt = {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
};

function monthlyRate(apr: number): number {
  return apr / 12;
}

/**
 * Simulate one payoff strategy month by month.
 *
 * Each month: interest accrues on every active balance, then the monthly budget
 * is distributed as minimum payments on every active debt, with the remaining
 * extra applied to the priority debt. When the priority debt clears mid-month,
 * the unused portion of its payment rolls to the next debt in priority order.
 * Freed minimum payments join next month's extra automatically because the
 * cleared debt no longer draws a minimum.
 */
function simulate(debts: Debt[], monthlyBudget: number, strategy: "snowball" | "avalanche" | "minimums"): DebtStrategyResult {
  const active: SimDebt[] = debts
    .filter((d) => d.balance > 0)
    .map((d) => ({ id: d.id, name: d.name, balance: d.balance, apr: Math.max(0, d.apr), minPayment: Math.max(0, d.minPayment) }));

  // Priority order only matters when there is spare budget to direct; the
  // minimums-only baseline never has any, so its ordering is arbitrary.
  const priority = (list: SimDebt[]): SimDebt[] =>
    [...list].sort((a, b) => {
      if (strategy === "snowball") {
        // Smallest balance first; ties broken by APR descending.
        if (a.balance !== b.balance) return a.balance - b.balance;
        return b.apr - a.apr;
      }
      // Highest APR first; ties broken by balance ascending.
      if (a.apr !== b.apr) return b.apr - a.apr;
      return a.balance - b.balance;
    });

  const series: { month: number; totalRemaining: number }[] = [
    { month: 0, totalRemaining: active.reduce((sum, d) => sum + d.balance, 0) },
  ];
  const payoffOrder: PayoffEvent[] = [];
  let totalInterest = 0;
  let month = 0;
  let payable = true;

  while (active.some((d) => d.balance > 0)) {
    month += 1;
    if (month > MAX_MONTHS) {
      payable = false;
      break;
    }

    for (const debt of active) {
      if (debt.balance <= 0) continue;
      const interest = debt.balance * monthlyRate(debt.apr);
      debt.balance += interest;
      totalInterest += interest;
    }

    // Two-pass rule:
    // 1. Every active debt receives its minimum (capped at the balance).
    // 2. Leftover budget goes to priority debts in order, capped at the balance.
    let available = monthlyBudget;
    for (const debt of active) {
      if (debt.balance <= 0 || available <= 0) continue;
      const min = Math.min(debt.minPayment, debt.balance, available);
      debt.balance -= min;
      available -= min;
      if (debt.balance <= 0.005) {
        debt.balance = 0;
        payoffOrder.push({ id: debt.id, name: debt.name, month });
      }
    }
    for (const debt of priority(active.filter((d) => d.balance > 0))) {
      if (available <= 0) break;
      const extra = Math.min(debt.balance, available);
      debt.balance -= extra;
      available -= extra;
      if (debt.balance <= 0.005) {
        debt.balance = 0;
        payoffOrder.push({ id: debt.id, name: debt.name, month });
      }
    }

    series.push({
      month,
      totalRemaining: Math.max(0, active.reduce((sum, d) => sum + d.balance, 0)),
    });
  }

  return {
    strategy,
    monthsToDebtFree: payable ? month : MAX_MONTHS,
    totalInterest,
    payable,
    payoffOrder,
    series,
  };
}

export function calculateDebtPayoff(inputs: DebtInputs): DebtOutputs {
  const debts = inputs.debts.map((d) => ({
    ...d,
    balance: Math.max(0, d.balance),
    apr: Math.max(0, d.apr),
    minPayment: Math.max(0, d.minPayment),
  }));
  const monthlyBudget = Math.max(0, inputs.monthlyBudget);

  const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinimums = debts.filter((d) => d.balance > 0).reduce((sum, d) => sum + d.minPayment, 0);
  const budgetValid = monthlyBudget >= totalMinimums;

  if (!budgetValid || totalBalance === 0) {
    const empty = (strategy: "snowball" | "avalanche" | "minimums"): DebtStrategyResult => ({
      strategy,
      monthsToDebtFree: 0,
      totalInterest: 0,
      payable: totalBalance === 0,
      payoffOrder: [],
      series: [{ month: 0, totalRemaining: totalBalance }],
    });
    return {
      snowball: empty("snowball"),
      avalanche: empty("avalanche"),
      minimumsOnly: empty("minimums"),
      totalBalance,
      totalMinimums,
      budgetValid,
      monthsSavedByBest: 0,
      interestSavedByBest: 0,
      monthsSavedVsMinimums: 0,
      interestSavedVsMinimums: 0,
      bestStrategy: "avalanche",
    };
  }

  const snowball = simulate(debts, monthlyBudget, "snowball");
  const avalanche = simulate(debts, monthlyBudget, "avalanche");
  const minimumsOnly = simulate(debts, totalMinimums, "minimums");

  const bestStrategy = avalanche.totalInterest <= snowball.totalInterest ? "avalanche" : "snowball";
  const best = bestStrategy === "avalanche" ? avalanche : snowball;
  const monthsSavedByBest =
    snowball.payable && avalanche.payable ? Math.abs(snowball.monthsToDebtFree - avalanche.monthsToDebtFree) : 0;
  const interestSavedByBest = Math.abs(snowball.totalInterest - avalanche.totalInterest);
  const monthsSavedVsMinimums =
    minimumsOnly.payable && best.payable ? minimumsOnly.monthsToDebtFree - best.monthsToDebtFree : 0;
  const interestSavedVsMinimums = minimumsOnly.payable && best.payable ? minimumsOnly.totalInterest - best.totalInterest : 0;

  return {
    snowball,
    avalanche,
    minimumsOnly,
    totalBalance,
    totalMinimums,
    budgetValid,
    monthsSavedByBest,
    interestSavedByBest,
    monthsSavedVsMinimums,
    interestSavedVsMinimums,
    bestStrategy,
  };
}
