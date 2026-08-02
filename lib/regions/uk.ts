export const ukRegion = {
  id: "uk" as const,
  currency: "GBP",
  currencySymbol: "£",
  locale: "en-GB",
  retirementAccountLabel: "SIPP",
  taxShelterLabel: "ISA",
  premiumBondLabel: "Premium Bonds",
  mortgageTerminology: "fixed-rate period and SVR revert",
};

export type UKRegion = typeof ukRegion;
