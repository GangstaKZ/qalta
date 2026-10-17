import { dayKey } from "./date";

const kztFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

export function formatKzt(n: number): string {
  return `${kztFormatter.format(Math.round(n))} ₸`;
}

export function parseAmount(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!cleaned) return null;
  const v = Number(cleaned);
  if (!Number.isFinite(v) || v <= 0) return null;
  return Math.round(v);
}

export function dayLabel(key: string): string {
  if (key === dayKey(new Date())) return "Сегодня";
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (key === dayKey(y)) return "Вчера";
  const [Y, M, D] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(new Date(Y, M - 1, D));
}

export function monthLabel(mKey: string): string {
  const [Y, M] = mKey.split("-").map(Number);
  const d = new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
  }).format(new Date(Y, M - 1, 1));
  return d.charAt(0).toUpperCase() + d.slice(1);
}
