"use client";

import { CATEGORY_MAP } from "@/lib/categories";
import { formatKzt } from "@/lib/format";
import type { CategoryTotal } from "@/lib/stats";
import { Card } from "./ui/Card";

export function CategoryBreakdown({
  data,
  total,
}: {
  data: CategoryTotal[];
  total: number;
}) {
  if (data.length === 0) return null;
  return (
    <Card className="mt-4">
      <ul>
        {data.map((d, i) => {
          const cat = CATEGORY_MAP[d.category];
          const share = total > 0 ? Math.round((d.total / total) * 100) : 0;
          return (
            <li
              key={d.category}
              className={`flex items-center gap-3 py-3 ${
                i > 0 ? "border-t border-border/60" : ""
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="flex-1 text-sm font-medium">{cat.label}</span>
              <span className="text-sm tabular text-muted">{share}%</span>
              <span className="w-24 text-right text-sm font-semibold tabular">
                {formatKzt(d.total)}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
