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

export interface EnrichedReading extends Reading {
  consumption?: number;
  days?: number;
  perDay?: number;
  perMonth?: number;
}

export interface MonthlyStat {
  month: string;
  consumption: number | null;
  previousYear: number | null;
  difference: number | null;
  percentage: number | null;
}
