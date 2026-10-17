"use client";

import { CATEGORY_MAP } from "@/lib/categories";
import { formatKzt } from "@/lib/format";
import type { CategoryTotal } from "@/lib/stats";

interface Slice {
  category: CategoryTotal["category"];
  total: number;
  color: string;
  fraction: number;
}

export function DonutChart({ data }: { data: CategoryTotal[] }) {
  const total = data.reduce((s, d) => s + d.total, 0);
  const size = 200;
  const r = 70;
  const stroke = 28;
  const C = 2 * Math.PI * r;

  const slices: Slice[] = data.map((d) => ({
    category: d.category,
    total: d.total,
    color: CATEGORY_MAP[d.category].color,
    fraction: total > 0 ? d.total / total : 0,
  }));

  let offset = 0;

  return (
    <div className="relative mx-auto h-52 w-52">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={stroke}
        />
        {total > 0 &&
          slices.map((s) => {
            const len = s.fraction * C;
            const dash = `${Math.max(len - 3, 0)} ${C - Math.max(len - 3, 0)}`;
            const el = (
              <circle
                key={s.category}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += len;
            return el;
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular">
          {total > 0 ? formatKzt(total) : "—"}
        </span>
        <span className="text-xs text-muted">за месяц</span>
      </div>
    </div>
  );
}
