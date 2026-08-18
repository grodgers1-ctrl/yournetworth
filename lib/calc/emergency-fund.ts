export type EmergencyFundInputs = {
  monthlyExpenses: number;
  targetMonths: number;
  currentSavings: number;
  monthlyContribution: number;
};

export type EmergencyFundPoint = {
  month: number;
  balance: number;
  target: number;
};

export type EmergencyFundResult = {
  target: number;
  monthsToFund: number;
  progress: number;
  coverageMonths: number;
  fundedDate: string;
  series: EmergencyFundPoint[];
};

function clampNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

export function calculateEmergencyFund(raw: EmergencyFundInputs): EmergencyFundResult {
  const monthlyExpenses = clampNonNegative(raw.monthlyExpenses);
  const targetMonths = clampNonNegative(raw.targetMonths);
  const currentSavings = clampNonNegative(raw.currentSavings);
  const monthlyContribution = clampNonNegative(raw.monthlyContribution);

  const target = monthlyExpenses * targetMonths;
  const gap = target - currentSavings;

  let monthsToFund = 0;
  if (target <= 0) {
    monthsToFund = 0;
  } else if (gap <= 0) {
    monthsToFund = 0;
  } else if (monthlyContribution <= 0) {
    monthsToFund = Infinity;
  } else {
    monthsToFund = Math.ceil(gap / monthlyContribution);
  }

  const progress = target > 0 ? currentSavings / target : 0;
  const coverageMonths = monthlyExpenses > 0 ? currentSavings / monthlyExpenses : 0;

  const fundedDate = Number.isFinite(monthsToFund)
    ? addMonths(new Date(), monthsToFund).toISOString().split("T")[0]
    : "";

  const seriesLength = Math.max(
    1,
    Math.ceil(Math.max(Number.isFinite(monthsToFund) ? monthsToFund : 0, targetMonths * 1.2))
  );

  const series: EmergencyFundPoint[] = [];
  for (let month = 0; month <= seriesLength; month++) {
    const balance = Math.min(currentSavings + monthlyContribution * month, target);
    series.push({ month, balance, target });
  }

  return {
    target,
    monthsToFund,
    progress,
    coverageMonths,
    fundedDate,
    series,
  };
}
