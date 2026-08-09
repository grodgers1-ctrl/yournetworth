import type { NetWorthExampleAccount, NetWorthPreset } from "@/lib/calc/networth";

export const usRegion = {
  id: "us" as const,
  currency: "USD",
  currencySymbol: "$",
  locale: "en-US",
  retirementAccountLabel: "IRA",
  taxShelterLabel: "Roth IRA",
  premiumBondLabel: "I Bonds",
  mortgageTerminology: "30-year fixed amortisation",
  mortgageDefaults: {
    defaultTermYears: 30,
    defaultFixedPeriodYears: 30,
    defaultSvrRate: 0.06,
    defaultInvestRate: 0.06,
  },
  fireTerminology: {
    retirementAccount: "IRA",
    taxShelter: "Roth IRA",
    statePension: "Social Security",
    pensionAge: "59.5",
    currency: "dollars",
  },
  lifeTableSource: "US Social Security Administration (SSA) 2020 period life table",
  lifeTableUrl: "https://www.ssa.gov/oact/STATS/table4c6.html",
  survivalProbability(age: number, currentAge: number): number {
    if (age <= currentAge) return 1;
    // Simplified Gompertz-Makeham curve calibrated to SSA male cohort survival.
    const a = 0.00006;
    const b = 0.084;
    const hazard = (a / b) * (Math.exp(b * (age - 30)) - Math.exp(b * (currentAge - 30)));
    return Math.max(0, Math.min(1, Math.exp(-hazard)));
  },
  netWorthPresets: [
    { id: "roth-ira", name: "Roth IRA", category: "freedom_fund" as const, currency: "USD" },
    { id: "401k", name: "401(k)", category: "freedom_fund" as const, currency: "USD" },
    { id: "hsa", name: "HSA", category: "freedom_fund" as const, currency: "USD" },
    { id: "hysa", name: "High-Yield Savings", shortName: "HYSA", category: "cash" as const, currency: "USD" },
    { id: "i-bonds", name: "I Bonds", category: "cash" as const, currency: "USD" },
    { id: "checking", name: "Checking Account", shortName: "Checking", category: "cash" as const, currency: "USD" },
    { id: "main-residence", name: "Main Residence", category: "valuable_liability" as const, currency: "USD" },
    { id: "mortgage", name: "Mortgage", category: "debt" as const, currency: "USD" },
    { id: "credit-cards", name: "Credit Cards", category: "debt" as const, currency: "USD" },
    { id: "student-loans", name: "Student Loans", category: "debt" as const, currency: "USD" },
  ] satisfies NetWorthPreset[],
  netWorthExample: [
    { presetId: "checking", values: [9200, 9600, 9100, 9800, 10200, 9750, 10400, 10000] },
    { presetId: "401k", values: [50500, 51800, 49800, 52600, 53400, 54100, 54900, 55000] },
    { presetId: "roth-ira", values: [20100, 20550, 19800, 21000, 21350, 21650, 21900, 22000] },
    { presetId: "main-residence", values: [298000, 300000, 301500, 303000, 305000, 306500, 308000, 310000] },
    { presetId: "mortgage", values: [252000, 251200, 250400, 249600, 248800, 247900, 247000, 245000] },
  ] satisfies NetWorthExampleAccount[],
  formatValue(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  },
  formatCompact(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 1,
      notation: "compact",
    }).format(value);
  },
};

export type USRegion = typeof usRegion;
