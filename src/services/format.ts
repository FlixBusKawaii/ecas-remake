export function round1(value: number | null): number | null {
  if (value === null) return null;
  return Math.round(value * 10) / 10;
}