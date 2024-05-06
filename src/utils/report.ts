export function getPeriod(date: string) {
  const [year, month] = date.split("-").map(Number);
  const startAt = new Date(year, month - 1, 1);
  const endAt = new Date(year, month, 0);
  return { startAt, endAt };
}
