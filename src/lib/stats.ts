import { currentMonthKey, monthKey, todayKey } from "./date";
import type { CategoryId, Transaction } from "./types";

export interface DayGroup {
  dayKey: string;
  label: string;
  items: Transaction[];
  subtotal: number;
}

export interface CategoryTotal {
  category: CategoryId;
  total: number;
}

export function spentOnDay(transactions: Transaction[], day: string): number {
  return transactions
    .filter((t) => t.date === day)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function spentInMonth(transactions: Transaction[], month: string): number {
  return transactions
    .filter((t) => monthKey(t.date) === month)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function totalsByCategory(
  transactions: Transaction[],
  month: string,
): CategoryTotal[] {
  const map = new Map<CategoryId, number>();
  for (const t of transactions) {
    if (monthKey(t.date) !== month) continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  return [...map.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function topCategories(
  transactions: Transaction[],
  month: string = currentMonthKey(),
): CategoryTotal[] {
  return totalsByCategory(transactions, month);
}

export function sortTransactions(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return b.createdAt - a.createdAt;
  });
}

export function groupByDay(
  transactions: Transaction[],
  labelFn: (key: string) => string,
): DayGroup[] {
  const sorted = sortTransactions(transactions);
  const groups: DayGroup[] = [];
  for (const t of sorted) {
    const last = groups[groups.length - 1];
    if (last && last.dayKey === t.date) {
      last.items.push(t);
      last.subtotal += t.amount;
    } else {
      groups.push({
        dayKey: t.date,
        label: labelFn(t.date),
        items: [t],
        subtotal: t.amount,
      });
    }
  }
  return groups;
}

export function countInMonth(transactions: Transaction[], month: string): number {
  return transactions.filter((t) => monthKey(t.date) === month).length;
}

export function spentToday(transactions: Transaction[]): number {
  return spentOnDay(transactions, todayKey());
}
