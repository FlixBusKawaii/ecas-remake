import { db } from './db';

export async function exportData(): Promise<void> {
  const meters = await db.meters.toArray();
  const readings = await db.readings.toArray();

  const data = {
    meters,
    readings,
  };

  const json = JSON.stringify(data, null, 2);

  const blob = new Blob([json], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().slice(0, 10);
  const filename = `ecas-export-${date}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
