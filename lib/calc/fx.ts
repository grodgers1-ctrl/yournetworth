export type BudgetLine = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  kind: "income" | "expense";
  category: string;
};

export type FxInputs = {
  lines: BudgetLine[];
  baseCurrency: string;
};

export type FxOutputs = {
  totalIncome: number;
  totalExpenses: number;
  net: number;
  byCategory: Record<string, number>;
  flows: { source: string; target: string; value: number }[];
};

export function calculateMultiCurrency(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _inputs: FxInputs
): FxOutputs {
  // TODO: fetch live FX rates, convert, and return Sankey-ready flows.
  return {
    totalIncome: 0,
    totalExpenses: 0,
    net: 0,
    byCategory: {},
    flows: [],
  };
}
