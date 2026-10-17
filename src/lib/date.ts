export function dayKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayKey(): string {
  return dayKey(new Date());
}

export function monthKey(day: string): string {
  return day.slice(0, 7);
}

export function currentMonthKey(): string {
  return todayKey().slice(0, 7);
}

/** Shift YYYY-MM by delta months (negative = past, positive = future). */
export function shiftMonthKey(mKey: string, delta: number): string {
  const [Y, M] = mKey.split("-").map(Number);
  const d = new Date(Y, M - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
