export type CompoundInputs = {
  principal: number;
  monthly: number;
  rate: number;
  years: number;
  frequency?: number;
};

export type CompoundOutputs = {
  futureValue: number;
  series: { year: number; contributions: number; value: number }[];
};

export function calculateCompound(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _inputs: CompoundInputs
): CompoundOutputs {
  // TODO: implement compound-interest formula and yearly series.
  return { futureValue: 0, series: [] };
}
