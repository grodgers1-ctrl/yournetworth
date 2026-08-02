export const usRegion = {
  id: "us" as const,
  currency: "USD",
  currencySymbol: "$",
  locale: "en-US",
  retirementAccountLabel: "IRA",
  taxShelterLabel: "Roth IRA",
  premiumBondLabel: "I Bonds",
  mortgageTerminology: "30-year fixed amortisation",
};

export type USRegion = typeof usRegion;
