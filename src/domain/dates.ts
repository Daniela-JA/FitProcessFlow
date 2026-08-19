export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(key: string, n: number): string {
  const d = new Date(`${key}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function monthKey(key: string): string {
  return key.slice(0, 7);
}

export function isIsoWeekdayLiftDay(date: Date, daysPerWeek: number): boolean {
  const day = date.getDay();
  const mondayFirst = day === 0 ? 6 : day - 1;
  const slots = [0, 1, 2, 3, 4, 5].slice(0, daysPerWeek);
  return slots.includes(mondayFirst);
}
