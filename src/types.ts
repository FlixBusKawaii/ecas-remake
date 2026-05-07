export interface Meter {
  id: number;
  name: string;
  unit: string;
}

export interface Reading {
  id: number;
  meterId: number;
  value: number;
  date: string;
}