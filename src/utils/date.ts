export function formatMonth(month: number, locale: string): string {
  const date = new Date(2000, month - 1, 1);

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
  }).format(date);
}
