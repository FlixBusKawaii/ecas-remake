import { db } from './db';
import type { Meter, Reading } from '../types';

export interface MeterSummary {
  meter: Meter;
  latestReading: Reading | null;
}

export async function getMeterSummaries(): Promise<MeterSummary[]> {
  const meters = await db.meters.toArray();

  const summaries = await Promise.all(
    meters.map(async (meter) => {
      const readings = await db.readings
        .where('meterId')
        .equals(meter.id)
        .sortBy('date');
      
      const latestReading = readings.at(-1) ?? null;

      return {
        meter,
        latestReading,
      };
    })
  );

  return summaries;
}
