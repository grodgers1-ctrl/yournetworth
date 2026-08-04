import { calculateCompound } from "./compound";

export type MortgageInputs = {
  principal: number;
  annualRate: number;
  termYears: number;
  monthlyOverpayment: number;
  initialPeriodYears?: number;
  svrRate?: number;
  investRate?: number;
  propertyTaxAnnual?: number;
  insuranceAnnual?: number;
};

export type MortgageMonthPoint = {
  month: number;
  baselineBalance: number;
  overpaymentBalance: number;
  baselineInterest: number;
  overpaymentInterest: number;
  baselinePrincipal: number;
  overpaymentPrincipal: number;
  baselinePayment: number;
  overpaymentPayment: number;
  rate: number;
};

export type MortgageOutputs = {
  monthlyPayment: number;
  totalMonthlyPayment: number;
  escrowMonthly: number;
  baselineMonths: number;
  overpaymentMonths: number;
  monthsSaved: number;
  totalInterestBaseline: number;
  totalInterestOverpayment: number;
  interestSaved: number;
  totalCostBaseline: number;
  totalCostOverpayment: number;
  investValue: number;
  investDelta: number;
  series: MortgageMonthPoint[];
};

export function monthlyRate(annualRate: number): number {
  return annualRate / 12;
}

export function calculatePayment(principal: number, annualRate: number, months: number): number {
  if (months <= 0 || principal <= 0) return 0;
  const r = monthlyRate(annualRate);
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * (r * factor)) / (factor - 1);
}

type MonthStep = {
  newBalance: number;
  interestPaid: number;
  principalPaid: number;
  overpaymentApplied: number;
  totalPaid: number;
};

function stepMonth(
  balance: number,
  annualRate: number,
  payment: number,
  overpayment: number
): MonthStep {
  const r = monthlyRate(annualRate);
  const interest = balance * r;
  const scheduledPrincipal = payment - interest;
  const availableForPrincipal = Math.max(0, scheduledPrincipal + overpayment);

  if (availableForPrincipal >= balance) {
    return {
      newBalance: 0,
      interestPaid: interest,
      principalPaid: balance,
      overpaymentApplied: Math.max(0, balance - scheduledPrincipal),
      totalPaid: interest + balance,
    };
  }

  return {
    newBalance: balance - availableForPrincipal,
    interestPaid: interest,
    principalPaid: availableForPrincipal,
    overpaymentApplied: overpayment,
    totalPaid: payment + overpayment,
  };
}

function buildSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  monthlyOverpayment: number,
  fixedPeriodMonths: number,
  svrRate: number
): {
  baselineMonths: number;
  baselineTotalInterest: number;
  baselineTotalPaid: number;
  overpaymentMonths: number;
  overpaymentTotalInterest: number;
  overpaymentTotalPaid: number;
  points: MortgageMonthPoint[];
} {
  let baselineBalance = principal;
  let overpaymentBalance = principal;
  let baselinePayment = calculatePayment(principal, annualRate, termMonths);
  let overpaymentPayment = baselinePayment;
  let baselineTotalInterest = 0;
  let baselineTotalPaid = 0;
  let overpaymentTotalInterest = 0;
  let overpaymentTotalPaid = 0;
  let overpaymentDone = false;
  const points: MortgageMonthPoint[] = [];

  for (let month = 1; month <= termMonths; month++) {
    const currentRate = month <= fixedPeriodMonths ? annualRate : svrRate;

    if (month === fixedPeriodMonths + 1) {
      const remaining = termMonths - (month - 1);
      baselinePayment = calculatePayment(baselineBalance, currentRate, remaining);
      if (!overpaymentDone) {
        overpaymentPayment = calculatePayment(overpaymentBalance, currentRate, remaining);
      }
    }

    const baseline = stepMonth(baselineBalance, currentRate, baselinePayment, 0);
    baselineBalance = baseline.newBalance;
    baselineTotalInterest += baseline.interestPaid;
    baselineTotalPaid += baseline.totalPaid;

    let overpayment: MonthStep;
    if (!overpaymentDone) {
      overpayment = stepMonth(overpaymentBalance, currentRate, overpaymentPayment, monthlyOverpayment);
      overpaymentBalance = overpayment.newBalance;
      overpaymentTotalInterest += overpayment.interestPaid;
      overpaymentTotalPaid += overpayment.totalPaid;
      if (overpaymentBalance <= 0) {
        overpaymentDone = true;
      }
    } else {
      overpayment = {
        newBalance: 0,
        interestPaid: 0,
        principalPaid: 0,
        overpaymentApplied: 0,
        totalPaid: 0,
      };
    }

    points.push({
      month,
      baselineBalance: Math.max(0, baselineBalance),
      overpaymentBalance: overpaymentDone ? 0 : Math.max(0, overpaymentBalance),
      baselineInterest: baseline.interestPaid,
      overpaymentInterest: overpayment.interestPaid,
      baselinePrincipal: baseline.principalPaid,
      overpaymentPrincipal: overpayment.principalPaid,
      baselinePayment,
      overpaymentPayment: overpaymentDone ? 0 : overpaymentPayment,
      rate: currentRate,
    });
  }

  const overpaymentMonths = overpaymentDone
    ? points.findIndex((p) => p.overpaymentBalance <= 0) + 1
    : termMonths;

  return {
    baselineMonths: termMonths,
    baselineTotalInterest,
    baselineTotalPaid,
    overpaymentMonths,
    overpaymentTotalInterest,
    overpaymentTotalPaid,
    points,
  };
}

export function calculateMortgage(inputs: MortgageInputs): MortgageOutputs {
  const principal = Math.max(0, inputs.principal);
  const annualRate = Math.max(0, inputs.annualRate);
  const termYears = Math.max(1, inputs.termYears);
  const termMonths = termYears * 12;
  const monthlyOverpayment = Math.max(0, inputs.monthlyOverpayment);
  const initialPeriodYears = inputs.initialPeriodYears ?? termYears;
  const fixedPeriodMonths = Math.max(0, Math.min(initialPeriodYears * 12, termMonths));
  const svrRate = inputs.svrRate ?? annualRate;
  const investRate = inputs.investRate ?? 0.06;
  const propertyTaxAnnual = inputs.propertyTaxAnnual ?? 0;
  const insuranceAnnual = inputs.insuranceAnnual ?? 0;

  const schedule = buildSchedule(
    principal,
    annualRate,
    termMonths,
    monthlyOverpayment,
    fixedPeriodMonths,
    svrRate
  );

  const monthlyPayment = schedule.points[0]?.baselinePayment ?? calculatePayment(principal, annualRate, termMonths);
  const escrowMonthly = (propertyTaxAnnual + insuranceAnnual) / 12;
  const totalMonthlyPayment = monthlyPayment + escrowMonthly;

  const investValue = calculateCompound({
    principal: 0,
    monthly: monthlyOverpayment,
    rate: investRate,
    years: termYears,
  }).futureValue;

  const interestSaved = schedule.baselineTotalInterest - schedule.overpaymentTotalInterest;
  const investDelta = investValue - interestSaved;

  return {
    monthlyPayment,
    totalMonthlyPayment,
    escrowMonthly,
    baselineMonths: schedule.baselineMonths,
    overpaymentMonths: schedule.overpaymentMonths,
    monthsSaved: schedule.baselineMonths - schedule.overpaymentMonths,
    totalInterestBaseline: schedule.baselineTotalInterest,
    totalInterestOverpayment: schedule.overpaymentTotalInterest,
    interestSaved,
    totalCostBaseline: schedule.baselineTotalPaid,
    totalCostOverpayment: schedule.overpaymentTotalPaid,
    investValue,
    investDelta,
    series: schedule.points,
  };
}
