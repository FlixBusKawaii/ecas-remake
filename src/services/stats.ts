import type { Reading, EnrichedReading } from '../types';

export function sortReadings(readings: Reading[]): Reading[] {
  return [...readings].sort((a, b) => {

    const dateDiff =
      new Date(a.date).getTime() -
      new Date(b.date).getTime();

    if (dateDiff !== 0) {
      return dateDiff;
    }

    return a.id - b.id;
  });
}

export function computeConsumption(
  previous: Reading,
  current: Reading
) {
  const consumption =
    current.value - previous.value;

  const ms =
    new Date(current.date).getTime() -
    new Date(previous.date).getTime();

  const days =
    ms / (1000 * 60 * 60 * 24);

  return {
    consumption,
    days,
    perDay: consumption / days
  };
}

export function enrichReadings(
  readings: Reading[]
): EnrichedReading[] {

  const sorted = sortReadings(readings);

  return sorted.map((reading, index) => {

    if (index === 0) {
      return reading;
    }

    const previous = sorted[index - 1];

    return {
      ...reading,
      ...computeConsumption(previous, reading)
    };
  });
}