export type MortgageInputs = {
  principal: number;
  annualRate: number;
  termYears: number;
  overpayment: number;
  investRate?: number;
  initialPeriodYears?: number;
  svrRate?: number;
};

export type MortgageOutputs = {
  monthlyPayment: number;
  baselineMonths: number;
  overpaymentMonths: number;
  interestSaved: number;
  investValue: number;
  schedule: { month: number; balance: number; interest: number; principal: number }[];
};

export function calculateMortgage(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _inputs: MortgageInputs
): MortgageOutputs {
  // TODO: implement amortisation, overpayment, and invest-vs-overpay counterfactual.
  return {
    monthlyPayment: 0,
    baselineMonths: 0,
    overpaymentMonths: 0,
    interestSaved: 0,
    investValue: 0,
    schedule: [],
  };
}
