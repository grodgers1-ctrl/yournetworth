import { calculateCompound, solveCompound } from "./compound";

function assertClose(actual: number, expected: number, tol: number, label: string) {
  const diff = Math.abs(actual - expected);
  if (diff > tol || !Number.isFinite(actual)) {
    throw new Error(`${label}: expected ${expected}, got ${actual} (diff ${diff})`);
  }
}

function expectedFutureValue(
  principal: number,
  monthly: number,
  annualRate: number,
  years: number,
  frequency: number,
  contributionFrequency: number
): number {
  if (annualRate === 0) return principal + monthly * 12 * years;
  const periodicRate = Math.pow(1 + annualRate / frequency, frequency / contributionFrequency) - 1;
  const periods = years * contributionFrequency;
  const pmtPerPeriod = (monthly * 12) / contributionFrequency;
  const factor = Math.pow(1 + periodicRate, periods);
  return principal * factor + pmtPerPeriod * ((factor - 1) / periodicRate);
}

function runTests() {
  console.log("Running compound-interest math tests...");

  // Monthly compounding + monthly contributions (same frequency).
  const fv = calculateCompound({ principal: 10_000, monthly: 500, rate: 0.07, years: 20, frequency: 12, contributionFrequency: 12 });
  assertClose(fv.futureValue, expectedFutureValue(10_000, 500, 0.07, 20, 12, 12), 1e-3, "FV monthly");
  assertClose(fv.series[0].value, 10_000, 1e-9, "series year 0");
  assertClose(fv.series[20].value, fv.futureValue, 1e-9, "series final");
  console.log("  FV monthly: OK", fv.futureValue);

  // Daily compounding + monthly contributions.
  const fvDaily = calculateCompound({ principal: 10_000, monthly: 500, rate: 0.07, years: 20, frequency: 365, contributionFrequency: 12 });
  assertClose(fvDaily.futureValue, expectedFutureValue(10_000, 500, 0.07, 20, 365, 12), 1e-3, "FV daily+monthly");
  console.log("  FV daily+monthly: OK", fvDaily.futureValue);

  // Annual compounding + monthly contributions.
  const fvAnnual = calculateCompound({ principal: 10_000, monthly: 500, rate: 0.07, years: 20, frequency: 1, contributionFrequency: 12 });
  assertClose(fvAnnual.futureValue, expectedFutureValue(10_000, 500, 0.07, 20, 1, 12), 1e-3, "FV annual+monthly");
  console.log("  FV annual+monthly: OK", fvAnnual.futureValue);

  // Annual compounding + annual contributions.
  const fvAnnualAnnual = calculateCompound({ principal: 10_000, monthly: 500, rate: 0.07, years: 20, frequency: 1, contributionFrequency: 1 });
  assertClose(fvAnnualAnnual.futureValue, expectedFutureValue(10_000, 500, 0.07, 20, 1, 1), 1e-3, "FV annual+annual");
  console.log("  FV annual+annual: OK", fvAnnualAnnual.futureValue);

  // Zero rate.
  const fvZero = calculateCompound({ principal: 5_000, monthly: 200, rate: 0, years: 10, frequency: 12, contributionFrequency: 12 });
  assertClose(fvZero.futureValue, 5_000 + 200 * 12 * 10, 1e-9, "FV zero rate");
  console.log("  FV zero rate: OK", fvZero.futureValue);

  // Solve for principal.
  const sp = solveCompound({ solveFor: "principal", monthly: 500, rate: 0.07, years: 20, futureValue: 250_000, frequency: 12, contributionFrequency: 12 });
  assertClose(sp.outputs.futureValue, 250_000, 1e-3, "solve principal recovers FV");
  console.log("  Solve principal: OK", sp.result);

  // Solve for monthly.
  const sm = solveCompound({ solveFor: "monthly", principal: 10_000, rate: 0.07, years: 20, futureValue: 250_000, frequency: 12, contributionFrequency: 12 });
  assertClose(sm.outputs.futureValue, 250_000, 1e-3, "solve monthly recovers FV");
  console.log("  Solve monthly: OK", sm.result);

  // Solve for rate (no contributions).
  const rateTestFv = expectedFutureValue(10_000, 0, 0.07, 10, 12, 12);
  const sr = solveCompound({ solveFor: "rate", principal: 10_000, monthly: 0, years: 10, futureValue: rateTestFv, frequency: 12, contributionFrequency: 12 });
  assertClose(sr.result, 0.07, 1e-5, "solve rate simple");
  assertClose(sr.outputs.futureValue, rateTestFv, 1e-2, "solve rate recovers FV");
  console.log("  Solve rate simple: OK", sr.result);

  // Solve for rate with contributions.
  const sr2 = solveCompound({ solveFor: "rate", principal: 10_000, monthly: 500, years: 20, futureValue: 250_000, frequency: 12, contributionFrequency: 12 });
  assertClose(sr2.outputs.futureValue, 250_000, 1e-2, "solve rate with contributions recovers FV");
  console.log("  Solve rate with contributions: OK", sr2.result);

  // Solve for years (no contributions).
  const sy = solveCompound({ solveFor: "years", principal: 10_000, monthly: 0, rate: 0.07, futureValue: 20_000, frequency: 12, contributionFrequency: 12 });
  assertClose(sy.outputs.futureValue, 20_000, 1e-2, "solve years recovers FV");
  console.log("  Solve years doubling: OK", sy.result);

  // Solve for years with contributions.
  const sy2 = solveCompound({ solveFor: "years", principal: 10_000, monthly: 500, rate: 0.07, futureValue: 250_000, frequency: 12, contributionFrequency: 12 });
  assertClose(sy2.outputs.futureValue, 250_000, 1e-2, "solve years with contributions recovers FV");
  console.log("  Solve years with contributions: OK", sy2.result);

  // Mortgage compatibility: calculateCompound without contributionFrequency should behave like old frequency-only call.
  const mortgage = calculateCompound({ principal: 0, monthly: 100, rate: 0.06, years: 10 }).futureValue;
  const mortgageCompat = expectedFutureValue(0, 100, 0.06, 10, 12, 12);
  assertClose(mortgage, mortgageCompat, 1e-9, "mortgage compatibility");
  console.log("  Mortgage compatibility: OK", mortgage);

  console.log("All compound-interest math tests passed.");
}

runTests();
