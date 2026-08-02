export type Debt = {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
};

export type DebtInputs = {
  debts: Debt[];
  monthlyBudget: number;
};

export type DebtOutputs = {
  snowball: { monthsToDebtFree: number; totalInterest: number };
  avalanche: { monthsToDebtFree: number; totalInterest: number };
};

export function calculateDebtPayoff(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _inputs: DebtInputs
): DebtOutputs {
  // TODO: implement snowball and avalanche payoff schedules.
  return {
    snowball: { monthsToDebtFree: 0, totalInterest: 0 },
    avalanche: { monthsToDebtFree: 0, totalInterest: 0 },
  };
}
