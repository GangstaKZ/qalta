"use client";

import { CATEGORY_MAP } from "@/lib/categories";
import { formatKzt } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import { Icon } from "./Icon";

export function TransactionRow({
  tx,
  onClick,
}: {
  tx: Transaction;
  onClick: (tx: Transaction) => void;
}) {
  const cat = CATEGORY_MAP[tx.category];
  return (
    <button
      type="button"
      onClick={() => onClick(tx)}
      className="flex w-full items-center gap-2 py-3 text-left active:bg-bg"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${cat.color}1a`, color: cat.color }}
      >
        <Icon name={cat.icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {tx.note || cat.label}
        </span>
        <span className="block text-xs text-muted">{cat.label}</span>
      </span>
      <span className="shrink-0 text-sm font-semibold tabular">
        −{formatKzt(tx.amount)}
      </span>
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0 text-border"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  );
}
