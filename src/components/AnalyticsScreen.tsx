"use client";

import { useRef, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { currentMonthKey, shiftMonthKey } from "@/lib/date";
import { monthLabel } from "@/lib/format";
import { countInMonth, spentInMonth, topCategories } from "@/lib/stats";
import { DonutChart } from "@/components/DonutChart";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { formatKzt } from "@/lib/format";

export function AnalyticsScreen() {
  const { hydrated, transactions } = useWallet();
  const [month, setMonth] = useState<string | null>(null);
  const touchX = useRef<number | null>(null);

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-2xl bg-card" />;
  }

  const activeMonth = month ?? currentMonthKey();
  const isCurrent = activeMonth === currentMonthKey();

  const total = spentInMonth(transactions, activeMonth);
  const count = countInMonth(transactions, activeMonth);
  const data = topCategories(transactions, activeMonth);

  const goPrev = () => setMonth(shiftMonthKey(activeMonth, -1));
  const goNext = () =>
    setMonth(isCurrent ? null : shiftMonthKey(activeMonth, 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  return (
    <div
      className="pb-24"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Предыдущий месяц"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-ink shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:bg-bg"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold">{monthLabel(activeMonth)}</h1>
          <p className="mt-0.5 text-xs text-muted">
            {total > 0
              ? `${formatKzt(total)} · ${count} ${pluralOps(count)}`
              : "Траты за месяц"}
          </p>
        </div>
        <button
          type="button"
          onClick={goNext}
          disabled={isCurrent}
          aria-label="Следующий месяц"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-ink shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:bg-bg disabled:opacity-30 disabled:active:bg-card"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {!isCurrent && (
        <button
          type="button"
          onClick={() => setMonth(null)}
          className="mx-auto mt-2 block text-xs font-medium text-primary"
        >
          ← К текущему месяцу
        </button>
      )}

      {total === 0 ? (
        <div className="mt-6 rounded-2xl bg-card px-4 py-12 text-center text-sm text-muted">
          {isCurrent
            ? "В этом месяце ещё нет трат"
            : `В ${monthLabel(activeMonth).toLowerCase()} трат не было`}
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-2xl bg-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <DonutChart data={data} />
          </div>
          <CategoryBreakdown data={data} total={total} />
        </>
      )}
    </div>
  );
}

function pluralOps(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "операция";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
    return "операции";
  return "операций";
}
