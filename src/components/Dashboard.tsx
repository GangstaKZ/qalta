"use client";

import { useWallet } from "@/hooks/useWallet";
import { currentMonthKey, todayKey } from "@/lib/date";
import { formatKzt } from "@/lib/format";
import { spentInMonth } from "@/lib/stats";
import { Card } from "./ui/Card";
import Link from "next/link";

export function Dashboard() {
  const { hydrated, transactions, budget } = useWallet();

  if (!hydrated) {
    return (
      <Card className="animate-pulse">
        <div className="h-20" />
      </Card>
    );
  }

  const today = todayKey();
  const spentToday = transactions
    .filter((t) => t.date === today)
    .reduce((s, t) => s + t.amount, 0);
  const spentMonth = spentInMonth(transactions, currentMonthKey());
  const remaining = budget !== null ? budget - spentMonth : null;
  const pct =
    budget && budget > 0 ? Math.min((spentMonth / budget) * 100, 100) : 0;
  const over = remaining !== null && remaining < 0;
  const barColor =
    over || pct >= 100
      ? "bg-danger"
      : pct >= 80
        ? "bg-warning"
        : "bg-primary";

  return (
    <Card>
      <div>
        <p className="text-sm text-muted">Потрачено сегодня</p>
        <p className="mt-1 text-4xl font-semibold tabular">
          {formatKzt(spentToday)}
        </p>
      </div>

      <div className="my-4 h-px bg-border" />

      <div>
        <p className="text-sm text-muted">Остаток бюджета</p>
        {budget === null || budget === 0 ? (
          <p className="mt-1">
            <span className="text-lg font-medium">Бюджет не задан</span>{" "}
            <Link href="/settings" className="text-primary underline">
              Задать
            </Link>
          </p>
        ) : (
          <>
            <p className="mt-1 text-3xl font-semibold tabular">
              {over ? (
                <span className="text-danger">
                  −{formatKzt(Math.abs(remaining ?? 0))}
                </span>
              ) : (
                formatKzt(remaining ?? 0)
              )}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full ${barColor} transition-all`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              из {formatKzt(budget)} в месяц · потрачено {formatKzt(spentMonth)}
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
