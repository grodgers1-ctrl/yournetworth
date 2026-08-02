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
  yearsToFire: number | null;
  successRate: number;
  series: { year: number; p10: number; p25: number; p50: number; p75: number; p90: number }[];
};

const RUNS = 1000;
const MEAN_RETURN = 0.06;
const STD_RETURN = 0.15;
const COAST_RETURN = 0.06;

function hashInputs(inputs: FireInputs): number {
  const str = `${inputs.annualSpend}|${inputs.withdrawalRate}|${inputs.currentSavings}|${inputs.monthlyContribution}|${inputs.currentAge}|${inputs.targetAge}|${inputs.endAge}`;
  let h = 1779033703;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randomNormal(rng: () => number, mean: number, std: number): number {
  const u = 1 - rng();
  const v = rng();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return z * std + mean;
}

function percentile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const index = (sorted.length - 1) * q;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function calculateFire(inputs: FireInputs): FireOutputs {
  const fireNumber = inputs.annualSpend / inputs.withdrawalRate;
  const coastNumber = fireNumber / Math.pow(1 + COAST_RETURN, inputs.targetAge - inputs.currentAge);

  const years = Math.max(0, inputs.endAge - inputs.currentAge);
  const rng = mulberry32(hashInputs(inputs));

  const paths: number[][] = [];
  let successes = 0;

  for (let i = 0; i < RUNS; i++) {
    const path: number[] = [inputs.currentSavings];
    let value = inputs.currentSavings;
    let alive = true;
    for (let y = 1; y <= years; y++) {
      const age = inputs.currentAge + y;
      const working = age < inputs.targetAge;
      const r = randomNormal(rng, MEAN_RETURN, STD_RETURN);
      value = value * (1 + r);
      if (working) {
        value += inputs.monthlyContribution * 12;
      } else if (alive) {
        value -= inputs.annualSpend;
      }
      if (value < 0) {
        value = 0;
        alive = false;
      }
      path.push(value);
    }
    if (alive) successes += 1;
    paths.push(path);
  }

  const series: FireOutputs["series"] = [];
  for (let y = 0; y <= years; y++) {
    const values = paths.map((p) => p[y]).sort((a, b) => a - b);
    series.push({
      year: inputs.currentAge + y,
      p10: percentile(values, 0.1),
      p25: percentile(values, 0.25),
      p50: percentile(values, 0.5),
      p75: percentile(values, 0.75),
      p90: percentile(values, 0.9),
    });
  }

  let yearsToFire: number | null = null;
  for (let i = 0; i < series.length; i++) {
    if (series[i].p50 >= fireNumber) {
      yearsToFire = series[i].year - inputs.currentAge;
      break;
    }
  }

  return {
    fireNumber,
    coastNumber,
    yearsToFire,
    successRate: successes / RUNS,
    series,
  };
}
