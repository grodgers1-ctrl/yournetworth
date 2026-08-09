import { convertToBase } from "./fx";

export type AccountCategory =
  | "asset"
  | "liability"
  | "freedom_fund"
  | "valuable_liability"
  | "cash"
  | "debt";

export type Snapshot = {
  id?: string;
  date: string;
  value: number;
};

export type Account = {
  id: string;
  /** Id of the preset this account was created from, if any. */
  presetId?: string;
  name: string;
  category: AccountCategory;
  currency: string;
  units?: number;
  snapshots: Snapshot[];
};

export type NetWorthPreset = Omit<Account, "snapshots" | "presetId"> & {
  /** Short label for compact UI such as preset chips. */
  shortName?: string;
};

export type NetWorthExampleAccount = {
  presetId: string;
  /** Monthly balances, oldest to newest, ending this month. */
  values: number[];
};

export type NetWorthMode = "standard" | "freedom_framework";

export type NetWorthState = {
  mode: NetWorthMode;
  baseCurrency: string;
  region: "uk" | "us";
  accounts: Account[];
};

export type NetWorthPoint = {
  date: string;
  netWorth: number;
  totals: Record<string, number>;
  positives: { key: string; y0: number; y1: number }[];
  negatives: { key: string; y0: number; y1: number }[];
};

export type NetWorthOutputs = {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  freedomFundTotal: number;
  annual4PctCoverage: number;
  dates: string[];
  series: NetWorthPoint[];
  accountSeries: {
    id: string;
    name: string;
    category: AccountCategory;
    values: { date: string; value: number }[];
  }[];
  categoryKeys: string[];
};

export function categoryIsNegative(category: AccountCategory): boolean {
  return category === "liability" || category === "debt";
}

export function categorySign(category: AccountCategory): number {
  return categoryIsNegative(category) ? -1 : 1;
}

function sortedSnapshots(snapshots: Snapshot[]): Snapshot[] {
  return [...snapshots].sort((a, b) => a.date.localeCompare(b.date));
}

export function accountValueAt(account: Account, date: string): number {
  const snapshots = sortedSnapshots(account.snapshots).filter((s) => s.date <= date);
  if (snapshots.length === 0) return 0;
  return snapshots[snapshots.length - 1].value;
}

export function accountValueToday(account: Account): number {
  const today = new Date().toISOString().slice(0, 10);
  return accountValueAt(account, today);
}

function uniqueDates(accounts: Account[]): string[] {
  const set = new Set<string>();
  for (const account of accounts) {
    for (const snapshot of sortedSnapshots(account.snapshots)) {
      set.add(snapshot.date);
    }
  }
  return Array.from(set).sort();
}

function valueWithUnits(account: Account, rawValue: number): number {
  if (account.units && account.units > 0) {
    return account.units * rawValue;
  }
  return rawValue;
}

export function calculateNetWorth(
  state: NetWorthState,
  rates: Record<string, number> = {}
): NetWorthOutputs {
  const { accounts, baseCurrency, mode } = state;
  const dates = uniqueDates(accounts);
  const today = new Date().toISOString().slice(0, 10);
  const latestDate = dates.length > 0 ? dates[dates.length - 1] : today;

  const categoryOrder: Record<NetWorthMode, AccountCategory[]> = {
    standard: ["asset", "liability"],
    freedom_framework: ["freedom_fund", "valuable_liability", "cash", "debt"],
  };

  const keys = categoryOrder[mode];

  const series: NetWorthPoint[] = dates.map((date) => {
    const totals: Record<string, number> = {};
    for (const key of keys) {
      totals[key] = 0;
    }

    for (const account of accounts) {
      const raw = accountValueAt(account, date);
      const value = valueWithUnits(account, raw);
      const baseValue = convertToBase(value, account.currency, baseCurrency, rates);
      if (totals[account.category] !== undefined) {
        totals[account.category] += baseValue * categorySign(account.category);
      }
    }

    const positives: { key: string; y0: number; y1: number }[] = [];
    const negatives: { key: string; y0: number; y1: number }[] = [];

    let positiveStack = 0;
    for (const key of keys) {
      const value = totals[key];
      if (value >= 0) {
        positives.push({ key, y0: positiveStack, y1: positiveStack + value });
        positiveStack += value;
      }
    }

    let negativeStack = 0;
    for (const key of keys) {
      const value = totals[key];
      if (value < 0) {
        negatives.push({ key, y0: negativeStack, y1: negativeStack + value });
        negativeStack += value;
      }
    }

    const netWorth = positiveStack + negativeStack;

    return { date, netWorth, totals, positives, negatives };
  });

  const accountSeries = accounts.map((account) => ({
    id: account.id,
    name: account.name,
    category: account.category,
    values: dates.map((date) => ({
      date,
      value: convertToBase(
        valueWithUnits(account, accountValueAt(account, date)),
        account.currency,
        baseCurrency,
        rates
      ) * categorySign(account.category),
    })),
  }));

  const currentTotals: Record<string, number> = {};
  for (const key of keys) {
    currentTotals[key] = 0;
  }
  for (const account of accounts) {
    const raw = accountValueAt(account, latestDate);
    const value = valueWithUnits(account, raw);
    const baseValue = convertToBase(value, account.currency, baseCurrency, rates);
    if (currentTotals[account.category] !== undefined) {
      currentTotals[account.category] += baseValue * categorySign(account.category);
    }
  }

  let totalAssets = 0;
  let totalLiabilities = 0;

  if (mode === "standard") {
    totalAssets = Math.max(0, currentTotals.asset);
    totalLiabilities = Math.max(0, currentTotals.liability);
  } else {
    totalAssets = Math.max(0, currentTotals.freedom_fund + currentTotals.valuable_liability + currentTotals.cash);
    totalLiabilities = Math.max(0, currentTotals.debt);
  }

  const netWorth = totalAssets - totalLiabilities;

  const freedomFundTotal = mode === "freedom_framework" ? Math.max(0, currentTotals.freedom_fund) : 0;
  const annual4PctCoverage = freedomFundTotal * 0.04;

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    freedomFundTotal,
    annual4PctCoverage,
    dates,
    series,
    accountSeries,
    categoryKeys: keys,
  };
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function categoryLabel(category: AccountCategory): string {
  switch (category) {
    case "asset":
      return "Assets";
    case "liability":
      return "Liabilities";
    case "freedom_fund":
      return "Investments";
    case "valuable_liability":
      return "Property";
    case "cash":
      return "Cash";
    case "debt":
      return "Debts";
  }
}

export function categoryHint(category: AccountCategory): string | undefined {
  if (categoryIsNegative(category)) {
    return "Enter the amount you owe, as a positive number.";
  }
  return undefined;
}

export const COMMON_CURRENCIES = [
  "GBP",
  "USD",
  "EUR",
];
