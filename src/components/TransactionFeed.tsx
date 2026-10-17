"use client";

import { useWallet } from "@/hooks/useWallet";
import { dayLabel } from "@/lib/format";
import { groupByDay } from "@/lib/stats";
import type { Transaction } from "@/lib/types";
import { DayGroup } from "./DayGroup";

export function TransactionFeed({
  onEdit,
}: {
  onEdit: (tx: Transaction) => void;
}) {
  const { hydrated, transactions } = useWallet();

  if (!hydrated) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-card" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-4 py-10 text-center text-sm text-muted">
        Пока нет операций — нажмите +
      </div>
    );
  }

  const groups = groupByDay(transactions, dayLabel);

  return (
    <div className="space-y-1">
      {groups.map((g) => (
        <DayGroup key={g.dayKey} group={g} onEdit={onEdit} />
      ))}
    </div>
  );
}
