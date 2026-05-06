import { db } from './db';
import type { Meter, Reading } from '../types';

export async function importData() {
  const response = await fetch('/data/export.json');
  const data = await response.json();

  const meters: Meter[] = data.meters;
  const readings: Reading[] = data.readings;

  await db.meters.bulkPut(meters);
  await db.readings.bulkPut(readings);

  console.log('Import terminé');
}