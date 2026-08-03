export const ukRegion = {
  id: "uk" as const,
  currency: "GBP",
  currencySymbol: "£",
  locale: "en-GB",
  retirementAccountLabel: "SIPP",
  taxShelterLabel: "ISA",
  premiumBondLabel: "Premium Bonds",
  mortgageTerminology: "fixed-rate period and SVR revert",
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
