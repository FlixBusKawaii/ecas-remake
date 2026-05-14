import type { Reading } from '../types';
import type { MonthlyStat } from '../types';
import { round1 } from './format';

const MONTH_NAMES = [
  'jan.', 'feb.', 'mar.', 'apr.', 'may', 'jun.',
  'jul.', 'aug.', 'sep.', 'oct.', 'nov.', 'dec.'
];

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
      month: `${MONTH_NAMES[month]} ${year}`,
      consumption: round1(current),
      previousYear: round1(previous),
      difference: round1(difference),
      percentage: round1(percentage),
    });
  }

  return stats;
}
