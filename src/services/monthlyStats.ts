import type { Reading } from '../types';
import type { MonthlyStat, PeriodConsumption, RollingYearConsumption } from '../types';
import { round1 } from './format';

export const MIN_STATS_YEAR = 2010;
export const MAX_STATS_YEAR = 2035;

export const MAX_PERIOD_MONTHS = 24;

export function estimateValueAt(
  readings: Reading[],
  targetDate: Date
): number | null {
  const sorted = [...readings].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const target = targetDate.getTime();

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const next = sorted[i];

    const prevTime = new Date(prev.date).getTime();
    const nextTime = new Date(next.date).getTime();

    if (target >= prevTime && target <= nextTime) {
      const ratio = (target - prevTime) / (nextTime - prevTime);

      return prev.value + ratio * (next.value - prev.value);
    }
  }

  return null;
}

export function computeMonthlyConsumption(
  readings: Reading[],
  year: number,
  month: number //use 0 for January
): number | null {
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 1));

  const startValue = estimateValueAt(readings, start);
  const endValue = estimateValueAt(readings, end);

  if (startValue === null || endValue === null) {
    return null;
  }

  return endValue - startValue;
}

export function computeYearStats(
  readings: Reading[],
  year: number
): MonthlyStat[] {
  const stats: MonthlyStat[] = [];

  for (let month = 0; month < 12; month++) {
    const current = computeMonthlyConsumption(readings, year, month);
    const previous = computeMonthlyConsumption(readings, year - 1, month);

    let difference: number | null = null;
    let percentage: number | null = null;

    if (current !== null && previous !== null) {
      difference = current - previous;

      if (previous !== 0) {
        percentage = (difference / previous) * 100;
      }
    }

    stats.push({
      month: month + 1,
      year,
      consumption: round1(current),
      previousYear: round1(previous),
      difference: round1(difference),
      percentage: round1(percentage),
    });
  }

  return stats;
}

export function computeStats(
  readings: Reading[],
  startYear: number,
  endYear: number
): MonthlyStat[] {
  const stats: MonthlyStat[] = [];

  for (let year = startYear; year <= endYear; year++) {
    stats.push(...computeYearStats(readings, year));
  }

  return stats;
}

export function computePeriodConsumption(
  stats: MonthlyStat[],
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number
): PeriodConsumption | null {
  const startIndex = startYear * 12 + (startMonth - 1);
  const endIndex = endYear * 12 + (endMonth - 1);

  if (endIndex < startIndex) {
    return null;
  }

  const periodStats = stats.filter((stat) => {
    const index = stat.year * 12 + (stat.month - 1);

    return index >= startIndex && index <= endIndex;
  });

  let total = 0;
  const missingMonths: { year: number; month: number }[] = [];

  for (let index = startIndex; index <= endIndex; index++) {
    const year = Math.floor(index / 12);
    const month = (index % 12) + 1;

    const stat = periodStats.find(
      (stat) =>
        stat.year === year &&
        stat.month === month
    );

    if (!stat || stat.consumption === null) {
      missingMonths.push({
        year,
        month,
      });

      continue;
    }

    total += stat.consumption;
  }

  return {
    total: round1(total),
    missingMonths,
  };
}

export function computeRollingYearConsumption(
  stats: MonthlyStat[],
  year: number,
  month: number
): RollingYearConsumption {
  const endIndex = year * 12 + (month - 1);
  const startIndex = endIndex - 11;

  let total = 0;
  const missingMonths: {
    year: number;
    month: number;
  }[] = [];

  for (let index = startIndex; index <= endIndex; index++) {
    const currentYear = Math.floor(index / 12);
    const currentMonth = (index % 12) + 1;

    const stat = stats.find(
      (item) =>
        item.year === currentYear &&
        item.month === currentMonth
    );

    if (!stat || stat.consumption === null) {
      missingMonths.push({
        year: currentYear,
        month: currentMonth,
      });
      continue;
    }

    total += stat.consumption;
  }

  return {
    total: round1(total),
    missingMonths,
  };
}
