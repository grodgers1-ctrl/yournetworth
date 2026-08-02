export type AccountSnapshot = { date: string; value: number };

export type Account = {
  id: string;
  name: string;
  category: "freedom_fund" | "valuable_liability" | "cash" | "debt" | "asset" | "liability";
  currency: string;
  units?: number;
  snapshots: AccountSnapshot[];
};

export type NetWorthMode = "standard" | "freedom_framework";

export type NetWorthState = {
  mode: NetWorthMode;
  baseCurrency: string;
  region: "uk" | "us";
  accounts: Account[];
};

export type NetWorthOutputs = {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  freedomFundTotal?: number;
  annual4PctCoverage?: number;
  series: { date: string; assets: number; liabilities: number; netWorth: number }[];
};

export function calculateNetWorth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _state: NetWorthState
): NetWorthOutputs {
  // TODO: aggregate accounts by snapshot date, apply FX, and produce the stacked-area series.
  return {
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    series: [],
  };
}
