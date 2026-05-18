import { db } from './db';
import type { Meter, Reading } from '../types';

interface ExportData {
  meters: Meter[];
  readings: Reading[];
}

export async function getData() {
  const response = await fetch('/data/export.json');
  const data = await response.json();

  const meters: Meter[] = data.meters;
  const readings: Reading[] = data.readings;

  await db.meters.bulkPut(meters);
  await db.readings.bulkPut(readings);

  console.log('Import terminé');
}

export async function importData(file: File): Promise<void> {
  const text = await file.text();

  const data = JSON.parse(text) as ExportData;

  if (!Array.isArray(data.meters) || !Array.isArray(data.readings)) {
    throw new Error('Invalid file format');
  }

  await db.transaction('rw', db.meters, db.readings, async () => {
    await db.meters.clear();
    await db.readings.clear();

    await db.meters.bulkAdd(data.meters);
    await db.readings.bulkAdd(data.readings);
  });
}
