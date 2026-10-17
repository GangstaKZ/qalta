"use client";

import { formatKzt } from "@/lib/format";
import type { DayGroup as DayGroupType } from "@/lib/stats";
import type { Transaction } from "@/lib/types";
import { TransactionRow } from "./TransactionRow";

export function DayGroup({
  group,
  onEdit,
}: {
  group: DayGroupType;
  onEdit: (tx: Transaction) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between px-1 pt-4 pb-1">
        <span className="text-sm font-semibold text-muted">{group.label}</span>
        <span className="text-xs tabular text-muted">
          −{formatKzt(group.subtotal)}
        </span>
      </div>
      <div className="rounded-2xl bg-card px-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {group.items.map((tx, i) => (
          <div
            key={tx.id}
            className={i > 0 ? "border-t border-border/60" : undefined}
          >
            <TransactionRow tx={tx} onClick={onEdit} />
          </div>
        ))}
      </div>
    </div>
  );
}
