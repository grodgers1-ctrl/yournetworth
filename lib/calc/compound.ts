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

export function calculateCompound(inputs: CompoundInputs): CompoundOutputs {
  const principal = inputs.principal;
  const monthly = inputs.monthly;
  const rate = inputs.rate;
  const years = inputs.years;
  const frequency = inputs.frequency ?? 12;
  const n = years * frequency;
  const pmtPerPeriod = monthly * (12 / frequency);

  if (rate === 0) {
    const value = principal + pmtPerPeriod * n;
    const series = [];
    for (let year = 0; year <= years; year++) {
      const periodN = year * frequency;
      series.push({
        year,
        contributions: principal + pmtPerPeriod * periodN,
        value: principal + pmtPerPeriod * periodN,
      });
    }
    return { futureValue: value, series };
  }

  const r = rate / frequency;
  const factor = Math.pow(1 + r, n);
  const futureValue = principal * factor + pmtPerPeriod * ((factor - 1) / r);

  const series = [];
  for (let year = 0; year <= years; year++) {
    const periodN = year * frequency;
    const periodFactor = Math.pow(1 + r, periodN);
    const value = principal * periodFactor + pmtPerPeriod * ((periodFactor - 1) / r);
    const contributions = principal + pmtPerPeriod * periodN;
    series.push({ year, contributions, value });
  }

  return { futureValue, series };
}
