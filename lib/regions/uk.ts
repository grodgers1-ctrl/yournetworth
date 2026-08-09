import type { NetWorthExampleAccount, NetWorthPreset } from "@/lib/calc/networth";

export const ukRegion = {
  id: "uk" as const,
  currency: "GBP",
  currencySymbol: "£",
  locale: "en-GB",
  retirementAccountLabel: "SIPP",
  taxShelterLabel: "ISA",
  premiumBondLabel: "Premium Bonds",
  /** Used by the net worth chart's "Today's prices" toggle. */
  assumedInflationRate: 0.025,
  mortgageTerminology: "fixed-rate period and SVR revert",
  mortgageDefaults: {
    defaultTermYears: 25,
    defaultFixedPeriodYears: 5,
    defaultSvrRate: 0.07,
    defaultInvestRate: 0.06,
  },
  fireTerminology: {
    retirementAccount: "SIPP",
    taxShelter: "ISA",
    statePension: "State Pension",
    pensionAge: "55 to 57",
    currency: "pounds",
  },
  lifeTableSource: "Office for National Statistics (ONS) 2020-2022 national life tables",
  lifeTableUrl: "https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/lifeexpectancies",
  survivalProbability(age: number, currentAge: number): number {
    if (age <= currentAge) return 1;
    // Simplified Gompertz-Makeham curve calibrated to ONS male cohort survival.
    const a = 0.000063;
    const b = 0.085;
    const hazard = (a / b) * (Math.exp(b * (age - 30)) - Math.exp(b * (currentAge - 30)));
    return Math.max(0, Math.min(1, Math.exp(-hazard)));
  },
  netWorthPresets: [
    { id: "stocks-isa", name: "Stocks & Shares ISA", shortName: "S&S ISA", category: "freedom_fund" as const, currency: "GBP" },
    { id: "sipp", name: "SIPP", category: "freedom_fund" as const, currency: "GBP" },
    { id: "gia", name: "General Investment Account", shortName: "GIA", category: "freedom_fund" as const, currency: "GBP" },
    { id: "premium-bonds", name: "Premium Bonds", category: "cash" as const, currency: "GBP" },
    { id: "cash-isa", name: "Cash ISA", category: "cash" as const, currency: "GBP" },
    { id: "current-account", name: "Current Account", category: "cash" as const, currency: "GBP" },
    { id: "main-residence", name: "Main Residence", category: "valuable_liability" as const, currency: "GBP" },
    { id: "mortgage", name: "Mortgage", category: "debt" as const, currency: "GBP" },
    { id: "credit-cards", name: "Credit Cards", category: "debt" as const, currency: "GBP" },
    { id: "student-loan", name: "Student Loan", category: "debt" as const, currency: "GBP" },
  ] satisfies NetWorthPreset[],
  netWorthExample: [
    { presetId: "current-account", values: [7200, 7500, 7100, 7800, 8000, 7650, 8200, 8000] },
    { presetId: "stocks-isa", values: [38500, 39200, 37800, 40100, 40900, 41500, 41800, 42000] },
    { presetId: "sipp", values: [16200, 16600, 16100, 17000, 17350, 17600, 17850, 18000] },
    { presetId: "main-residence", values: [258000, 259500, 261000, 261500, 262000, 263500, 264000, 265000] },
    { presetId: "mortgage", values: [216200, 215600, 215000, 214300, 213600, 212800, 212000, 210000] },
  ] satisfies NetWorthExampleAccount[],
  formatValue(value: number): string {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  },
  formatCompact(value: number): string {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 1,
      notation: "compact",
    }).format(value);
  },
};

export type UKRegion = typeof ukRegion;
