import Dexie, { type Table } from 'dexie';
import type { Meter, Reading } from '../types';

export class FlixtricityDB extends Dexie {
  meters!: Table<Meter, number>;
  readings!: Table<Reading, number>;

  constructor() {
    super('flixtricity');

    this.version(1).stores({
      meters: 'id,name,unit',
      readings: 'id,meterId,value,date'
    });
  }
}

export const db = new FlixtricityDB();