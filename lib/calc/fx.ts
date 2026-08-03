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
  rates?: Record<string, number>;
};

export type FxFlow = { source: string; target: string; value: number };

export type FxOutputs = {
  totalIncome: number;
  totalExpenses: number;
  net: number;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  byCategory: Record<string, number>;
  flows: FxFlow[];
  currenciesUsed: string[];
};

// Representative mid-market rates against USD as a common anchor.
// These are static fallbacks. The UI can fetch live rates and override them.
export const DEFAULT_FX_RATES: Record<string, number> = {
  USD: 1,
  GBP: 1.31,
  EUR: 1.09,
  JPY: 0.0067,
  CAD: 0.72,
  AUD: 0.64,
  CHF: 1.18,
  SEK: 0.092,
  NZD: 0.58,
  NOK: 0.089,
  DKK: 0.145,
  PLN: 0.25,
  SGD: 0.75,
  HKD: 0.128,
  CZK: 0.043,
  HUF: 0.0028,
  MXN: 0.055,
  TRY: 0.029,
  ZAR: 0.055,
  BRL: 0.18,
  INR: 0.012,
  CNY: 0.138,
  KRW: 0.00072,
  AED: 0.272,
  THB: 0.029,
  ILS: 0.27,
};

export const COMMON_CURRENCIES = [
  "GBP",
  "USD",
  "EUR",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "SEK",
  "NZD",
  "NOK",
  "SGD",
  "HKD",
  "AED",
  "CNY",
];

export function getFxRates(overrides?: Record<string, number>): Record<string, number> {
  return { ...DEFAULT_FX_RATES, ...overrides };
}

export function convertToBase(
  amount: number,
  fromCurrency: string,
  baseCurrency: string,
  rates: Record<string, number> = DEFAULT_FX_RATES
): number {
  const fromRate = rates[fromCurrency];
  const baseRate = rates[baseCurrency];
  if (fromRate == null || baseRate == null || baseRate === 0) {
    return amount;
  }
  return (amount * fromRate) / baseRate;
}

export function calculateMultiCurrency(inputs: FxInputs): FxOutputs {
  const rates = getFxRates(inputs.rates);
  const baseCurrency = inputs.baseCurrency || "USD";
  const lines = inputs.lines || [];

  const currenciesUsed = Array.from(new Set(lines.map((l) => l.currency)));

  const incomeByCategory: Record<string, number> = {};
  const expensesByCategory: Record<string, number> = {};
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const line of lines) {
    const baseValue = convertToBase(line.amount, line.currency, baseCurrency, rates);
    if (line.kind === "income") {
      incomeByCategory[line.category] = (incomeByCategory[line.category] || 0) + baseValue;
      totalIncome += baseValue;
    } else {
      expensesByCategory[line.category] = (expensesByCategory[line.category] || 0) + baseValue;
      totalExpenses += baseValue;
    }
  }

  const byCategory: Record<string, number> = {};
  for (const [category, value] of Object.entries(incomeByCategory)) {
    byCategory[category] = (byCategory[category] || 0) + value;
  }
  for (const [category, value] of Object.entries(expensesByCategory)) {
    byCategory[category] = (byCategory[category] || 0) - value;
  }

  const net = totalIncome - totalExpenses;

  const flows: FxFlow[] = [];

  for (const [category, value] of Object.entries(incomeByCategory)) {
    flows.push({ source: category, target: "Total income", value });
  }

  for (const [category, value] of Object.entries(expensesByCategory)) {
    flows.push({ source: "Total income", target: category, value });
  }

  if (net > 0.0001) {
    flows.push({ source: "Total income", target: "Surplus", value: net });
  } else if (net < -0.0001) {
    flows.push({ source: "Deficit", target: "Total income", value: -net });
  }

  return {
    totalIncome,
    totalExpenses,
    net,
    incomeByCategory,
    expensesByCategory,
    byCategory,
    flows,
    currenciesUsed,
  };
}

export function formatFxRate(
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number> = DEFAULT_FX_RATES
): string {
  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];
  if (fromRate == null || toRate == null || toRate === 0) {
    return "-";
  }
  const rate = fromRate / toRate;
  return `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
}
