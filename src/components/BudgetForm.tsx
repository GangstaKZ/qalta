"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { formatKzt } from "@/lib/format";
import { Card } from "./ui/Card";

function parseBudget(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!cleaned) return null;
  const v = Number(cleaned);
  if (!Number.isFinite(v) || v < 0) return null;
  return Math.round(v);
}

export function BudgetForm() {
  const { budget, setBudget } = useWallet();
  // null = not edited yet; show current budget from store
  const [draft, setDraft] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const raw = draft ?? (budget !== null ? String(budget) : "");
  const parsed = parseBudget(raw);
  const canSave = parsed !== null;

  const handleSave = () => {
    if (!canSave || parsed === null) return;
    setBudget(parsed);
    setDraft(String(parsed));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  return (
    <Card>
      <p className="text-sm font-medium text-muted">Месячный бюджет</p>
      <p className="mt-1 text-2xl font-semibold tabular">
        {budget !== null ? formatKzt(budget) : "—"}
      </p>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={raw}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Например, 200 000"
          className="min-w-0 flex-1 rounded-2xl border border-border bg-bg px-4 py-3 text-sm tabular outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          {saved ? "Сохранено" : "Сохранить"}
        </button>
      </div>
      {raw.trim() !== "" && parsed === null && (
        <p className="mt-2 text-sm text-danger">Введите сумму</p>
      )}
    </Card>
  );
}
