export type CompoundInputs = {
  principal: number;
  monthly: number;
  rate: number;
  years: number;
  /** Compounding periods per year (12 monthly, 365 daily, 1 annual). */
  frequency?: number;
  /** Contribution periods per year (52 weekly, 12 monthly, 4 quarterly, 1 annual). Defaults to frequency. */
  contributionFrequency?: number;
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
  contributionFrequency?: number;
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

function normalizeContributionFrequency(contributionFrequency?: number, fallback?: number): number {
  if (typeof contributionFrequency === "number" && Number.isFinite(contributionFrequency) && contributionFrequency > 0) {
    return contributionFrequency;
  }
  return fallback ?? DEFAULT_FREQUENCY;
}

export function calculateCompound(inputs: CompoundInputs): CompoundOutputs {
  const frequency = normalizeFrequency(inputs.frequency);
  const contributionFrequency = normalizeContributionFrequency(inputs.contributionFrequency, frequency);
  const principal = inputs.principal;
  const monthly = inputs.monthly;
  const rate = inputs.rate;
  const years = inputs.years;
  const futureValue = computeFutureValue(principal, monthly, rate, years, frequency, contributionFrequency);
  const series = buildSeries({ principal, monthly, rate, years, frequency, contributionFrequency });
  return { futureValue, series };
}

function computeFutureValue(
  principal: number,
  monthly: number,
  rate: number,
  years: number,
  frequency: number,
  contributionFrequency: number
): number {
  const periods = years * contributionFrequency;
  const pmtPerPeriod = monthly * (12 / contributionFrequency);
  if (rate === 0 || periods === 0) return principal + pmtPerPeriod * periods;
  const periodicRate = effectivePeriodicRate(rate, frequency, contributionFrequency);
  const factor = Math.pow(1 + periodicRate, periods);
  return principal * factor + pmtPerPeriod * ((factor - 1) / periodicRate);
}

function effectivePeriodicRate(annualRate: number, compoundingFrequency: number, contributionFrequency: number): number {
  if (annualRate === 0 || compoundingFrequency === contributionFrequency) return annualRate / compoundingFrequency;
  return Math.pow(1 + annualRate / compoundingFrequency, compoundingFrequency / contributionFrequency) - 1;
}

function buildSeries(inputs: CompoundInputs): CompoundOutputs["series"] {
  const frequency = normalizeFrequency(inputs.frequency);
  const contributionFrequency = normalizeContributionFrequency(inputs.contributionFrequency, frequency);
  const { principal, monthly, rate, years } = inputs;
  const series: CompoundOutputs["series"] = [];
  for (let year = 0; year <= years; year++) {
    const value = computeFutureValue(principal, monthly, rate, year, frequency, contributionFrequency);
    const contributions = principal + monthly * 12 * year;
    series.push({ year, contributions, value });
  }
  return series;
}

function solveForPrincipal(
  monthly: number,
  rate: number,
  years: number,
  futureValue: number,
  frequency: number,
  contributionFrequency: number
): number {
  if (years <= 0) return futureValue;
  const periods = years * contributionFrequency;
  const pmtPerPeriod = monthly * (12 / contributionFrequency);
  if (rate === 0) return futureValue - pmtPerPeriod * periods;
  const periodicRate = effectivePeriodicRate(rate, frequency, contributionFrequency);
  const factor = Math.pow(1 + periodicRate, periods);
  const growth = pmtPerPeriod * ((factor - 1) / periodicRate);
  return (futureValue - growth) / factor;
}

function solveForMonthly(
  principal: number,
  rate: number,
  years: number,
  futureValue: number,
  frequency: number,
  contributionFrequency: number
): number {
  if (years <= 0) return 0;
  const periods = years * contributionFrequency;
  const pmtPerPeriod = solveForPmtPerPeriod(principal, rate, frequency, contributionFrequency, periods, futureValue);
  return pmtPerPeriod * (contributionFrequency / 12);
}

function solveForPmtPerPeriod(
  principal: number,
  rate: number,
  frequency: number,
  contributionFrequency: number,
  periods: number,
  futureValue: number
): number {
  if (periods <= 0) return 0;
  if (rate === 0) return (futureValue - principal) / periods;
  const periodicRate = effectivePeriodicRate(rate, frequency, contributionFrequency);
  const factor = Math.pow(1 + periodicRate, periods);
  const growthPerPmt = (factor - 1) / periodicRate;
  return (futureValue - principal * factor) / growthPerPmt;
}

function solveForYears(
  principal: number,
  monthly: number,
  rate: number,
  futureValue: number,
  frequency: number,
  contributionFrequency: number
): number {
  if (futureValue <= principal && monthly <= 0) return 0;
  const n = yearsFromFutureValue(futureValue, principal, monthly, rate, frequency, contributionFrequency);
  if (Number.isFinite(n) && n >= 0 && n <= MAX_YEARS) return n;
  return bisectYears(principal, monthly, rate, futureValue, frequency, contributionFrequency);
}

function yearsFromFutureValue(
  futureValue: number,
  principal: number,
  monthly: number,
  rate: number,
  frequency: number,
  contributionFrequency: number
): number {
  const pmtPerPeriod = monthly * (12 / contributionFrequency);
  if (rate === 0) {
    if (pmtPerPeriod === 0) return principal === 0 ? 0 : Infinity;
    return (futureValue - principal) / (pmtPerPeriod * contributionFrequency);
  }
  const periodicRate = effectivePeriodicRate(rate, frequency, contributionFrequency);
  if (pmtPerPeriod === 0) {
    if (principal <= 0 || futureValue <= 0) return Infinity;
    return Math.log(futureValue / principal) / (contributionFrequency * Math.log(1 + periodicRate));
  }
  // FV = P*A + PMT*(A-1)/r where A = (1+r)^(periods)
  // A = (FV + PMT/r) / (P + PMT/r)
  const a = (futureValue + pmtPerPeriod / periodicRate) / (principal + pmtPerPeriod / periodicRate);
  if (a <= 0) return Infinity;
  return Math.log(a) / (contributionFrequency * Math.log(1 + periodicRate));
}

function bisectYears(
  principal: number,
  monthly: number,
  rate: number,
  futureValue: number,
  frequency: number,
  contributionFrequency: number
): number {
  let lo = 0;
  let hi = MAX_YEARS;
  if (computeFutureValue(principal, monthly, rate, hi, frequency, contributionFrequency) < futureValue) return hi;
  for (let i = 0; i < BISECTION_ITERATIONS; i++) {
    const mid = (lo + hi) / 2;
    const fMid = computeFutureValue(principal, monthly, rate, mid, frequency, contributionFrequency);
    if (fMid < futureValue) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function solveForRate(
  principal: number,
  monthly: number,
  years: number,
  futureValue: number,
  frequency: number,
  contributionFrequency: number
): number {
  if (years <= 0) return 0;
  const fZero = computeFutureValue(principal, monthly, 0, years, frequency, contributionFrequency);
  if (futureValue <= fZero) return 0;
  let lo = 0;
  let hi = MAX_RATE;
  if (computeFutureValue(principal, monthly, hi, years, frequency, contributionFrequency) < futureValue) return hi;
  for (let i = 0; i < BISECTION_ITERATIONS; i++) {
    const mid = (lo + hi) / 2;
    const fMid = computeFutureValue(principal, monthly, mid, years, frequency, contributionFrequency);
    if (fMid < futureValue) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function solveCompound(raw: CompoundSolveInputs): CompoundSolveResult {
  const frequency = normalizeFrequency(raw.frequency);
  const contributionFrequency = normalizeContributionFrequency(raw.contributionFrequency, frequency);
  const solveFor = raw.solveFor;

  const principal = raw.principal ?? 0;
  const monthly = raw.monthly ?? 0;
  const rate = raw.rate ?? 0;
  const years = raw.years ?? 0;
  const futureValue = raw.futureValue ?? 0;

  let result = 0;
  let inputs: CompoundInputs;

  if (solveFor === "fv") {
    inputs = { principal, monthly, rate, years, frequency, contributionFrequency };
    result = computeFutureValue(principal, monthly, rate, years, frequency, contributionFrequency);
  } else if (solveFor === "principal") {
    result = solveForPrincipal(monthly, rate, years, futureValue, frequency, contributionFrequency);
    inputs = { principal: result, monthly, rate, years, frequency, contributionFrequency };
  } else if (solveFor === "monthly") {
    result = solveForMonthly(principal, rate, years, futureValue, frequency, contributionFrequency);
    inputs = { principal, monthly: result, rate, years, frequency, contributionFrequency };
  } else if (solveFor === "rate") {
    result = solveForRate(principal, monthly, years, futureValue, frequency, contributionFrequency);
    inputs = { principal, monthly, rate: result, years, frequency, contributionFrequency };
  } else {
    // years
    result = solveForYears(principal, monthly, rate, futureValue, frequency, contributionFrequency);
    inputs = { principal, monthly, rate, years: result, frequency, contributionFrequency };
  }

  const outputs = calculateCompound(inputs);
  return { result, inputs, outputs, series: outputs.series };
}
