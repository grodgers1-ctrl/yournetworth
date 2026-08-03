import type { Account } from "@/lib/calc/networth";

export const usRegion = {
  id: "us" as const,
  currency: "USD",
  currencySymbol: "$",
  locale: "en-US",
  retirementAccountLabel: "IRA",
  taxShelterLabel: "Roth IRA",
  premiumBondLabel: "I Bonds",
  mortgageTerminology: "30-year fixed amortisation",
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
    { id: "hysa", name: "High-Yield Savings", category: "cash" as const, currency: "USD" },
    { id: "i-bonds", name: "I Bonds", category: "cash" as const, currency: "USD" },
    { id: "checking", name: "Checking Account", category: "cash" as const, currency: "USD" },
    { id: "main-residence", name: "Main Residence", category: "valuable_liability" as const, currency: "USD" },
    { id: "mortgage", name: "Mortgage", category: "debt" as const, currency: "USD" },
    { id: "credit-cards", name: "Credit Cards", category: "debt" as const, currency: "USD" },
    { id: "student-loans", name: "Student Loans", category: "debt" as const, currency: "USD" },
  ] satisfies Omit<Account, "snapshots">[],
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
