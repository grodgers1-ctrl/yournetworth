export type FireInputs = {
  annualSpend: number;
  withdrawalRate: number;
  currentSavings: number;
  monthlyContribution: number;
  currentAge: number;
  targetAge: number;
  endAge: number;
};

export type FireOutputs = {
  fireNumber: number;
  coastNumber: number;
  series: { year: number; p10: number; p25: number; p50: number; p75: number; p90: number }[];
};

export function calculateFire(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _inputs: FireInputs
): FireOutputs {
  // TODO: implement FIRE number, Coast FIRE, and Monte Carlo percentile bands.
  return { fireNumber: 0, coastNumber: 0, series: [] };
}
