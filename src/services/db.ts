import Dexie, { type Table } from 'dexie';
import type { Meter, Reading } from '../types';

export class EcasDB extends Dexie {
  meters!: Table<Meter, number>;
  readings!: Table<Reading, number>;

  constructor() {
    super('ecas');

    this.version(1).stores({
      meters: 'id,name,unit',
      readings: 'id,meterId,value,date'
    });
  }
}

export const db = new EcasDB();