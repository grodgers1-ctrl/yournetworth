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

export type SolveMode = "fv" | "principal" | "monthly" | "rate" | "years";

export type CompoundSolveInputs = {
  solveFor: SolveMode;
  principal?: number;
  monthly?: number;
  rate?: number;
  years?: number;
  futureValue?: number;
  frequency?: number;
};

export type CompoundSolveResult = {
  /** The solved value (the variable that was selected as the unknown). */
  result: number;
  /** The fully determined inputs for the calculation, including the solved value. */
  inputs: CompoundInputs;
  outputs: CompoundOutputs;
  series: CompoundOutputs["series"];
};

const DEFAULT_FREQUENCY = 12;
const MAX_RATE = 2; // 200% annual, used as a solver ceiling only.
const MAX_YEARS = 200; // solver ceiling only.
const BISECTION_ITERATIONS = 80;

function normalizeFrequency(frequency?: number): number {
  return typeof frequency === "number" && Number.isFinite(frequency) && frequency > 0 ? frequency : DEFAULT_FREQUENCY;
}

export function calculateCompound(inputs: CompoundInputs): CompoundOutputs {
  const frequency = normalizeFrequency(inputs.frequency);
  const principal = inputs.principal;
  const monthly = inputs.monthly;
  const rate = inputs.rate;
  const years = inputs.years;
  const futureValue = computeFutureValue(principal, monthly, rate, years, frequency);
  const series = buildSeries({ principal, monthly, rate, years, frequency });
  return { futureValue, series };
}

function computeFutureValue(principal: number, monthly: number, rate: number, years: number, frequency: number): number {
  const n = years * frequency;
  const pmtPerPeriod = monthly * (12 / frequency);
  if (rate === 0 || n === 0) return principal + pmtPerPeriod * n;
  const r = rate / frequency;
  const factor = Math.pow(1 + r, n);
  return principal * factor + pmtPerPeriod * ((factor - 1) / r);
}

function buildSeries(inputs: CompoundInputs): CompoundOutputs["series"] {
  const { principal, monthly, rate, years } = inputs;
  const frequency = normalizeFrequency(inputs.frequency);
  const series: CompoundOutputs["series"] = [];
  for (let year = 0; year <= years; year++) {
    const periodN = year * frequency;
    const pmtPerPeriod = monthly * (12 / frequency);
    let value: number;
    if (rate === 0 || periodN === 0) {
      value = principal + pmtPerPeriod * periodN;
    } else {
      const r = rate / frequency;
      const factor = Math.pow(1 + r, periodN);
      value = principal * factor + pmtPerPeriod * ((factor - 1) / r);
    }
    const contributions = principal + pmtPerPeriod * periodN;
    series.push({ year, contributions, value });
  }
  return series;
}

function solveForPrincipal(monthly: number, rate: number, years: number, futureValue: number, frequency: number): number {
  if (years <= 0) return futureValue;
  const n = years * frequency;
  const pmtPerPeriod = monthly * (12 / frequency);
  if (rate === 0) return futureValue - pmtPerPeriod * n;
  const r = rate / frequency;
  const factor = Math.pow(1 + r, n);
  const growth = pmtPerPeriod * ((factor - 1) / r);
  return (futureValue - growth) / factor;
}

function solveForMonthly(principal: number, rate: number, years: number, futureValue: number, frequency: number): number {
  if (years <= 0) return 0;
  const n = years * frequency;
  const pmtPerPeriod = solveForPmtPerPeriod(principal, rate, frequency, n, futureValue);
  return pmtPerPeriod * (frequency / 12);
}

function solveForPmtPerPeriod(principal: number, rate: number, frequency: number, periods: number, futureValue: number): number {
  if (periods <= 0) return 0;
  if (rate === 0) return (futureValue - principal) / periods;
  const r = rate / frequency;
  const factor = Math.pow(1 + r, periods);
  const growthPerPmt = (factor - 1) / r;
  return (futureValue - principal * factor) / growthPerPmt;
}

function solveForYears(principal: number, monthly: number, rate: number, futureValue: number, frequency: number): number {
  if (futureValue <= principal && monthly <= 0) return 0;
  const n = yearsFromFutureValue(futureValue, principal, monthly, rate, frequency);
  if (Number.isFinite(n) && n >= 0 && n <= MAX_YEARS) return n;
  return bisectYears(principal, monthly, rate, futureValue, frequency);
}

function yearsFromFutureValue(
  futureValue: number,
  principal: number,
  monthly: number,
  rate: number,
  frequency: number
): number {
  const pmtPerPeriod = monthly * (12 / frequency);
  if (rate === 0 || futureValue === principal + pmtPerPeriod * 0) {
    if (pmtPerPeriod === 0) return principal === 0 ? 0 : Infinity;
    return (futureValue - principal) / (pmtPerPeriod * frequency);
  }
  const r = rate / frequency;
  if (pmtPerPeriod === 0) {
    if (principal <= 0 || futureValue <= 0) return Infinity;
    return Math.log(futureValue / principal) / (frequency * Math.log(1 + r));
  }
  const a = (futureValue + pmtPerPeriod / r) / (principal + pmtPerPeriod / r);
  if (a <= 0) return Infinity;
  return Math.log(a) / (frequency * Math.log(1 + r));
}

function bisectYears(principal: number, monthly: number, rate: number, futureValue: number, frequency: number): number {
  let lo = 0;
  let hi = MAX_YEARS;
  if (computeFutureValue(principal, monthly, rate, hi, frequency) < futureValue) return hi;
  for (let i = 0; i < BISECTION_ITERATIONS; i++) {
    const mid = (lo + hi) / 2;
    const fMid = computeFutureValue(principal, monthly, rate, mid, frequency);
    if (fMid < futureValue) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function solveForRate(principal: number, monthly: number, years: number, futureValue: number, frequency: number): number {
  if (years <= 0) return 0;
  const fZero = computeFutureValue(principal, monthly, 0, years, frequency);
  if (futureValue <= fZero) return 0;
  const fMax = computeFutureValue(principal, monthly, MAX_RATE, years, frequency);
  if (futureValue >= fMax) return MAX_RATE;
  let lo = 0;
  let hi = MAX_RATE;
  for (let i = 0; i < BISECTION_ITERATIONS; i++) {
    const mid = (lo + hi) / 2;
    const fMid = computeFutureValue(principal, monthly, mid, years, frequency);
    if (fMid < futureValue) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function solveCompound(raw: CompoundSolveInputs): CompoundSolveResult {
  const frequency = normalizeFrequency(raw.frequency);
  const solveFor = raw.solveFor;

  const principal = raw.principal ?? 0;
  const monthly = raw.monthly ?? 0;
  const rate = raw.rate ?? 0;
  const years = raw.years ?? 0;
  const futureValue = raw.futureValue ?? 0;

  let result = 0;
  let inputs: CompoundInputs;

  if (solveFor === "fv") {
    inputs = { principal, monthly, rate, years, frequency };
    result = computeFutureValue(principal, monthly, rate, years, frequency);
  } else if (solveFor === "principal") {
    result = solveForPrincipal(monthly, rate, years, futureValue, frequency);
    inputs = { principal: result, monthly, rate, years, frequency };
  } else if (solveFor === "monthly") {
    result = solveForMonthly(principal, rate, years, futureValue, frequency);
    inputs = { principal, monthly: result, rate, years, frequency };
  } else if (solveFor === "rate") {
    result = solveForRate(principal, monthly, years, futureValue, frequency);
    inputs = { principal, monthly, rate: result, years, frequency };
  } else {
    // years
    result = solveForYears(principal, monthly, rate, futureValue, frequency);
    inputs = { principal, monthly, rate, years: result, frequency };
  }

  const outputs = calculateCompound(inputs);
  return { result, inputs, outputs, series: outputs.series };
}
